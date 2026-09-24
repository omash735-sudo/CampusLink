// lib/auth/resolve-auth.ts
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from './verify-token';
import { coerceRole, type Role } from './roles';

const DEV_BYPASS_ENABLED = process.env.DEV_BYPASS === 'true';

/**
 * AuthUser — the shape returned by resolveAuth.
 *
 * Extends the full campuslink_users row with the fields that pages,
 * APIs, and components consume. We list them explicitly so TypeScript
 * can narrow types (e.g. `user.publicationsMotivation || ''` works).
 *
 * The index signature at the bottom keeps us open to any additional
 * DB columns without breaking callers.
 */
export type AuthUser = {
  // --- Identity ---
  id: string;
  email: string;
  fullName: string;
  username: string;
  phone: string | null;
  avatar: string | null;
  bio: string | null;

  // --- Role / access ---
  role: Role;
  isActive: boolean;
  isVerified: boolean | null;
  isMentor: boolean;
  mentorType: string | null;
  mentorStatus: string | null;
  campus: string | null;

  // --- Academic ---
  programme: string | null;
  year: number | null;
  interests: string[] | null;

  // --- Publications ---
  publicationsStatus: string;
  publicationsMotivation: string | null;
  publicationsAppliedAt: Date | null;

  // --- Terms / privacy ---
  termsVersion: string | null;
  termsAcceptedAt: Date | null;
  privacyVersion: string | null;
  privacyAcceptedAt: Date | null;
  marketingEmailConsent: boolean;
  whatsappMarketingConsent: boolean;

  // --- Timestamps ---
  lastActive: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // --- Escape hatch ---
  // Any extra DB columns remain accessible without TS errors.
  [key: string]: unknown;
};

export type AuthResult =
  | {
      authenticated: false;
      reason: 'no_cookie' | 'invalid_token' | 'user_not_found' | 'inactive';
    }
  | {
      authenticated: true;
      user: AuthUser;
      viaBypass: boolean;
    };

let cachedBypassUser: AuthUser | null = null;

async function resolveBypassUser(): Promise<AuthUser> {
  if (cachedBypassUser) return cachedBypassUser;

  try {
    const [admin] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.role, 'admin'))
      .limit(1);

    if (admin) {
      const role = coerceRole(admin.role) ?? 'admin';
      cachedBypassUser = {
        ...admin,
        role,
        isActive: true,
        isMentor: admin.isMentor ?? false,
        mentorStatus: admin.mentorStatus ?? null,
        avatar: admin.avatar ?? null,
      } as AuthUser;
      return cachedBypassUser;
    }
  } catch {
    // fall through
  }

  cachedBypassUser = {
    id: '',
    email: 'dev-bypass@localhost',
    fullName: 'Developer (bypass)',
    username: 'dev-bypass',
    phone: null,
    avatar: null,
    bio: null,
    role: 'admin',
    isActive: true,
    isVerified: null,
    isMentor: false,
    mentorType: null,
    mentorStatus: null,
    campus: null,
    programme: null,
    year: null,
    interests: null,
    publicationsStatus: 'not_applied',
    publicationsMotivation: null,
    publicationsAppliedAt: null,
    termsVersion: null,
    termsAcceptedAt: null,
    privacyVersion: null,
    privacyAcceptedAt: null,
    marketingEmailConsent: false,
    whatsappMarketingConsent: false,
    lastActive: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return cachedBypassUser;
}

export async function resolveAuth(request?: Request): Promise<AuthResult> {
  if (DEV_BYPASS_ENABLED) {
    const user = await resolveBypassUser();
    return { authenticated: true, user, viaBypass: true };
  }

  let token: string | undefined;

  if (request) {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('auth_token='));
    if (match) {
      token = decodeURIComponent(match.slice('auth_token='.length));
    }
  } else {
    try {
      const store = await cookies();
      token = store.get('auth_token')?.value;
    } catch {
      token = undefined;
    }
  }

  if (!token) {
    return { authenticated: false, reason: 'no_cookie' };
  }

  // verifyToken() is async because it runs on jose/Web Crypto so it
  // works in the Edge runtime (middleware). See lib/auth/verify-token.ts.
  const decoded = await verifyToken(token);
  if (!decoded) {
    return { authenticated: false, reason: 'invalid_token' };
  }

  const [found] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, decoded.userId))
    .limit(1);

  if (!found) {
    return { authenticated: false, reason: 'user_not_found' };
  }

  if (found.isActive === false) {
    return { authenticated: false, reason: 'inactive' };
  }

  const role = coerceRole(found.role) ?? 'student';

  const user: AuthUser = {
    ...found,
    role,
    isActive: true,
    isVerified: found.isVerified ?? null,
    isMentor: found.isMentor ?? false,
    mentorType: found.mentorType ?? null,
    mentorStatus: found.mentorStatus ?? null,
    avatar: found.avatar ?? null,
    phone: found.phone ?? null,
    bio: found.bio ?? null,
    campus: found.campus ?? null,
    programme: found.programme ?? null,
    year: found.year ?? null,
    interests: found.interests ?? null,
    publicationsStatus: found.publicationsStatus ?? 'not_applied',
    publicationsMotivation: found.publicationsMotivation ?? null,
    publicationsAppliedAt: found.publicationsAppliedAt ?? null,
    termsVersion: found.termsVersion ?? null,
    termsAcceptedAt: found.termsAcceptedAt ?? null,
    privacyVersion: found.privacyVersion ?? null,
    privacyAcceptedAt: found.privacyAcceptedAt ?? null,
    marketingEmailConsent: found.marketingEmailConsent ?? false,
    whatsappMarketingConsent: found.whatsappMarketingConsent ?? false,
    lastActive: found.lastActive ?? null,
  };

  return { authenticated: true, user, viaBypass: false };
}
