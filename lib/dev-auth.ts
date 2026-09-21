// lib/dev-auth.ts
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const DEV_BYPASS_ENABLED = process.env.DEV_BYPASS === 'true';

export type AuthUser = {
  id: string | null;
  role: string;
  email: string;
  fullName: string;
  username: string;
  avatar?: string | null;
  isBypass: boolean;
  [key: string]: unknown;
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
      cachedBypassUser = { ...admin, isBypass: true } as AuthUser;
      return cachedBypassUser;
    }
  } catch {
    // fall through
  }

  cachedBypassUser = {
    id: null,
    role: 'admin',
    email: 'dev-bypass@localhost',
    fullName: 'Developer (bypass)',
    username: 'dev-bypass',
    avatar: null,
    isBypass: true,
  };
  return cachedBypassUser;
}

/**
 * Admin OR publications gate.
 *
 * DEV_BYPASS=true  → returns a bypass admin without checking session.
 * DEV_BYPASS unset → real auth via getCurrentUser() + role check.
 *
 * Only the authorization step is skipped. DB writes, storage, and audit
 * all run normally.
 */
export async function requireAdminOrPublications(): Promise<AuthUser | null> {
  if (DEV_BYPASS_ENABLED) {
    const u = await resolveBypassUser();
    console.warn(`[DEV_BYPASS] admin/publications auth bypassed — acting as ${u.email}`);
    return u;
  }

  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'publications') return null;
  return { ...user, isBypass: false } as AuthUser;
}

/**
 * Strict admin-only gate.
 *
 * Use this for admin API routes that publications should NOT access
 * (mentors, mentorships, users, programmes, courses, reports, feedback,
 * activity, legal, campus).
 */
export async function requireAdminOnly(): Promise<AuthUser | null> {
  if (DEV_BYPASS_ENABLED) {
    const u = await resolveBypassUser();
    console.warn(`[DEV_BYPASS] admin-only auth bypassed — acting as ${u.email}`);
    return u;
  }

  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'admin') return null;
  return { ...user, isBypass: false } as AuthUser;
}
