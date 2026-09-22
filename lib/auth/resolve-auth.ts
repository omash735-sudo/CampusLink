// lib/auth/resolve-auth.ts
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from './verify-token';
import { coerceRole, type Role } from './roles';

// ---------------------------------------------------------------------------
// DEV_BYPASS — development-only override.
// Centralized here so it cannot accidentally become a production auth path.
//
// Turn off by:
//   1. Setting DEV_BYPASS=false (or removing it) in env
//   2. Redeploying
// The branch below stays in code but becomes inactive.
//
// For full removal once you're done testing: delete the branch and the
// `viaBypass` field from AuthResult.
// ---------------------------------------------------------------------------

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
  // Keep the shape open — /api/auth/me and Navigation.tsx consume
  // arbitrary fields. We never remove user properties here.
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

// --- Bypass user resolution ------------------------------------------------
// Prefers a real admin in the DB so writes/audit logs attribute correctly.
// Falls back to a synthetic user with id = null if no admin exists yet.

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
    id: '', // empty string — callers guarding on user.id should treat as no attribution
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

// --- Main entry point ------------------------------------------------------

/**
 * resolveAuth — the single source of truth for authentication.
 *
 * Works in both Edge (middleware) and Node (route handlers, server
 * components) because the Neon HTTP driver is Edge-compatible.
 *
 * Accepts:
 *   - a Request → reads auth_token from request.cookies
 *   - nothing → reads auth_token from cookies() (Route Handler / Server Component)
 *
 * Returns:
 *   - { authenticated: false, reason }
 *   - { authenticated: true, user, viaBypass }
 *
 * User properties are returned verbatim from the DB (plus role normalization).
 * No fields are removed or renamed — existing callers keep working.
 */
export async function resolveAuth(request?: Request): Promise<AuthResult> {
  // --- DEV_BYPASS branch ---
  if (DEV_BYPASS_ENABLED) {
    const user = await resolveBypassUser();
    return { authenticated: true, user, viaBypass: true };
  }

  // --- 1. Read the token ---
  let token: string | undefined;

  if (request) {
    // Middleware / any caller that has a raw Request
    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('auth_token='));
    if (match) {
      token = decodeURIComponent(match.slice('auth_token='.length));
    }
  } else {
    // Route Handler / Server Component
    try {
      const store = cookies();
      token = store.get('auth_token')?.value;
    } catch {
      // cookies() not available in this context
      token = undefined;
    }
  }

  if (!token) {
    return { authenticated: false, reason: 'no_cookie' };
  }

  // --- 2. Verify JWT ---
  const decoded = verifyToken(token);
  if (!decoded) {
    return { authenticated: false, reason: 'invalid_token' };
  }

  // --- 3. Look up user in DB ---
  const [found] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, decoded.userId))
    .limit(1);

  if (!found) {
    return { authenticated: false, reason: 'user_not_found' };
  }

  // --- 4. Check active status ---
  if (found.isActive === false) {
    return { authenticated: false, reason: 'inactive' };
  }

  // --- 5. Normalize role ---
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
