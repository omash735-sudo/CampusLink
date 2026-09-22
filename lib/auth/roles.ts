// lib/auth/roles.ts

/**
 * The four real roles in CampusLink.
 * DEV_BYPASS is not a role — it's an authentication mode handled
 * inside resolveAuth(). Do not add it here.
 */
export type Role = 'student' | 'mentor' | 'publications' | 'admin';

export const ALL_ROLES: Role[] = ['student', 'mentor', 'publications', 'admin'];

/**
 * Where each role lands after login, and where they're redirected
 * if they try to access a page they aren't authorized for.
 */
export const LANDING_PATH: Record<Role, string> = {
  student: '/student/dashboard',
  mentor: '/mentor',
  publications: '/admin',
  admin: '/admin',
};

/** Fallback if a role string from the DB isn't recognized. */
export const FALLBACK_LANDING = '/student/dashboard';

/**
 * Coerce an arbitrary string (e.g. from a DB row) into a known Role.
 * Returns null if it isn't one of the four.
 */
export function coerceRole(value: unknown): Role | null {
  if (typeof value !== 'string') return null;
  return (ALL_ROLES as string[]).includes(value) ? (value as Role) : null;
}

/** Redirect target for an authenticated but unauthorized user. */
export function landingFor(role: Role | null | undefined): string {
  if (!role) return FALLBACK_LANDING;
  return LANDING_PATH[role] ?? FALLBACK_LANDING;
}
