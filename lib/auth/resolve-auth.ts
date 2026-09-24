// lib/auth/resolve-auth.ts
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from './verify-token';
import { coerceRole, type Role } from './roles';

const DEV_BYPASS_ENABLED = process.env.DEV_BYPASS === 'true';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: Role;
  isActive: boolean;
  isMentor: boolean;
  mentorStatus: string | null;
  avatar: string | null;
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
    role: 'admin',
    isActive: true,
    isMentor: false,
    mentorStatus: null,
    avatar: null,
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
    // Next.js 15: cookies() is async
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

  const decoded = verifyToken(token);
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
    isMentor: found.isMentor ?? false,
    mentorStatus: found.mentorStatus ?? null,
    avatar: found.avatar ?? null,
  };

  return { authenticated: true, user, viaBypass: false };
}
