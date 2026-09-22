// lib/auth.ts
//
// Compatibility shim.
//
// The real auth logic now lives in lib/auth/*. This file re-exports the
// public surface so existing imports (`@/lib/auth`) keep working while
// we migrate callers in Batch 3.
//
// Once Batch 3 is done, this file can be deleted and its callers
// updated to import from `@/lib/auth` (which resolves to lib/auth/index.ts).

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from './db';
import { campuslinkUsers } from './db/schema';
import { eq, sql } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('[lib/auth] JWT_SECRET is not set');
}

// ---------------------------------------------------------------------------
// Re-export the new centralized API
// ---------------------------------------------------------------------------

export { resolveAuth } from './auth/resolve-auth';
export type { AuthUser, AuthResult } from './auth/resolve-auth';
export { verifyToken } from './auth/verify-token';
export type { TokenPayload } from './auth/verify-token';
export { getCurrentUser, getUserByToken } from './auth/get-current-user';
export {
  canAccess,
  explainDenial,
  isPublic,
  PUBLIC_ROUTES,
  PUBLIC_PREEMPT_ROUTES,
  AUTH_ROUTE_RULES,
  API_ROUTE_RULES,
} from './auth/authorization';
export type { Rule } from './auth/authorization';
export {
  ALL_ROLES,
  LANDING_PATH,
  FALLBACK_LANDING,
  coerceRole,
  landingFor,
} from './auth/roles';
export type { Role } from './auth/roles';
export { requireUserFor, requireAuthFor, requireAnyAuth } from './auth/guards';

// ---------------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------------

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

export function signToken(userId: string, role: string = 'student') {
  return jwt.sign({ userId, role }, JWT_SECRET!, { expiresIn: '7d' });
}

// ---------------------------------------------------------------------------
// Legacy require* helpers
//
// Kept for compatibility with any caller we haven't migrated yet.
// New code should use:
//   - requireUserFor(pagePath)          for server components
//   - requireAuthFor(request, apiPath)  for API routes
//
// These throw on failure, matching their previous behavior.
// ---------------------------------------------------------------------------

export async function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };
  const [found] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, decoded.userId))
    .limit(1);

  if (!found) throw new Error('Unauthorized');
  if (found.isActive === false) throw new Error('Unauthorized');
  return found;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

export async function requirePublications() {
  const user = await requireAuth();
  if (user.role !== 'publications') throw new Error('Forbidden');
  return user;
}

export async function requireAdminOrPublications() {
  const user = await requireAuth();
  if (user.role !== 'admin' && user.role !== 'publications') {
    throw new Error('Forbidden');
  }
  return user;
}

export async function requireMentor() {
  const user = await requireAuth();

  if (user.isMentor && user.mentorStatus === 'approved') {
    return user;
  }

  if (user.role === 'admin' && hasSuperAccess()) {
    return user;
  }

  throw new Error('Mentor access required');
}

// ---------------------------------------------------------------------------
// Admin existence check (used by /admin/setup)
// ---------------------------------------------------------------------------

export async function adminExists(): Promise<boolean> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.role, 'admin'));
  return (result[0]?.count || 0) > 0;
}

// ---------------------------------------------------------------------------
// Cookies
// ---------------------------------------------------------------------------

export function setAuthCookie(token: string) {
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export function clearAuthCookie() {
  cookies().delete('auth_token');
}

// ---------------------------------------------------------------------------
// Redirect path (kept for callers that still import it)
// ---------------------------------------------------------------------------

export function getRedirectPath(user: {
  role?: string | null;
  isMentor?: boolean | null;
  mentorStatus?: string | null;
}): string {
  if (user.role === 'admin' || user.role === 'publications') return '/admin';
  if (user.isMentor && user.mentorStatus === 'approved') return '/mentor';
  return '/student/dashboard';
}

// ---------------------------------------------------------------------------
// Super access (unchanged)
// ---------------------------------------------------------------------------

const SUPER_ACCESS_COOKIE = 'super_access_token';
const SUPER_ACCESS_TTL_SECONDS = 60 * 60;

export function isSuperAccessEnabled(): boolean {
  return process.env.SUPER_ACCESS_ENABLED === 'true';
}

export function verifySuperAccessPassword(input: string): boolean {
  const expected = process.env.SUPER_ACCESS_PASSWORD;
  if (!expected || !isSuperAccessEnabled()) return false;
  if (input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < input.length; i++) {
    mismatch |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export function signSuperAccessToken() {
  return jwt.sign({ type: 'super_access' }, JWT_SECRET!, {
    expiresIn: SUPER_ACCESS_TTL_SECONDS,
  });
}

export function verifySuperAccessToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { type?: string };
    return decoded?.type === 'super_access';
  } catch {
    return false;
  }
}

export function setSuperAccessCookie() {
  const token = signSuperAccessToken();
  cookies().set(SUPER_ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SUPER_ACCESS_TTL_SECONDS,
    path: '/',
  });
}

export function clearSuperAccessCookie() {
  cookies().delete(SUPER_ACCESS_COOKIE);
}

export function hasSuperAccess(): boolean {
  if (!isSuperAccessEnabled()) return false;
  const token = cookies().get(SUPER_ACCESS_COOKIE)?.value;
  if (!token) return false;
  return verifySuperAccessToken(token);
}
