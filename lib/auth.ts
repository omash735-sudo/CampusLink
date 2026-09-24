// lib/auth.ts
//
// Compatibility shim.
//
// The real auth logic now lives in lib/auth/*. This file re-exports the
// public surface so existing imports (`@/lib/auth`) keep working while
// we migrate callers.

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

// NOTE: verifyToken is now ASYNC (it uses jose/Web Crypto so it works in the
// Edge runtime — see lib/auth/verify-token.ts). Any caller importing it from
// '@/lib/auth' MUST await it:
//
//     const payload = await verifyToken(token);
//
// Calling it without await returns a Promise, which is always truthy, so
// `if (payload)` checks would silently succeed for invalid tokens.
export { verifyToken } from './auth/verify-token';
export type { TokenPayload } from './auth/verify-token';

export { getCurrentUser, getUserByToken } from './auth/get-current-user';
export {
  canAccess,
  canAccessAsMentor,
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
// Legacy require* helpers — kept for compatibility.
// New code should use requireUserFor / requireAuthFor.
//
// These delegate to resolveAuth() so they share the same source of truth.
// ---------------------------------------------------------------------------

export async function requireAuth() {
  const { resolveAuth } = await import('./auth/resolve-auth');
  const auth = await resolveAuth();
  if (!auth.authenticated) throw new Error('Unauthorized');
  return auth.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

export async function requirePublications() {
  const user = await requireAuth();
  if (
    user.role !== 'admin' &&
    user.role !== 'publications' &&
    user.publicationsStatus !== 'approved'
  ) {
    throw new Error('Forbidden');
  }
  return user;
}

export async function requireAdminOrPublications() {
  return requirePublications();
}

export async function requireMentor() {
  const user = await requireAuth();

  if (user.isMentor && user.mentorStatus === 'approved') {
    return user;
  }

  if (user.role === 'admin' && (await hasSuperAccess())) {
    return user;
  }

  throw new Error('Mentor access required');
}

// ---------------------------------------------------------------------------
// Admin existence check
// ---------------------------------------------------------------------------

export async function adminExists(): Promise<boolean> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.role, 'admin'));
  return (result[0]?.count || 0) > 0;
}

// ---------------------------------------------------------------------------
// Cookies — Next.js 15: cookies() is async
// ---------------------------------------------------------------------------

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete('auth_token');
}

// ---------------------------------------------------------------------------
// Redirect path & dashboard switching
// ---------------------------------------------------------------------------

type AuthUserShape = {
  role?: string | null;
  isMentor?: boolean | null;
  mentorStatus?: string | null;
  publicationsStatus?: string | null;
};

/**
 * Where should we send this user after login?
 *
 * Precedence:
 *   1. admin                    → /admin
 *   2. publications-approved    → /admin
 *   3. mentor-approved          → /mentor
 *   4. everyone else            → /student/dashboard
 *
 * A stacked user (mentor + publications) lands on /admin, since that's the
 * broader surface. They can switch to /mentor from the dropdown.
 */
export function getRedirectPath(user: AuthUserShape): string {
  if (user.role === 'admin') return '/admin';
  if (user.role === 'publications' || user.publicationsStatus === 'approved') {
    return '/admin';
  }
  if (user.isMentor === true && user.mentorStatus === 'approved') {
    return '/mentor';
  }
  return '/student/dashboard';
}

/**
 * Which dashboards can this user switch between?
 *
 * Returns an ordered list of { label, href } entries. Layouts can call this
 * and filter out the current path to render a "switch dashboard" menu.
 */
export function getSwitchLinks(
  user: AuthUserShape
): Array<{ label: string; href: string }> {
  const links: Array<{ label: string; href: string }> = [];

  // Everyone has a student home.
  links.push({ label: 'Student Dashboard', href: '/student/dashboard' });

  // Approved mentor → mentor home.
  if (user.isMentor === true && user.mentorStatus === 'approved') {
    links.push({ label: 'Mentor Dashboard', href: '/mentor' });
  }

  // Approved publications officer or admin → admin content home.
  if (
    user.role === 'admin' ||
    user.role === 'publications' ||
    user.publicationsStatus === 'approved'
  ) {
    links.push({ label: 'Publications Dashboard', href: '/admin' });
  }

  return links;
}

// ---------------------------------------------------------------------------
// Super access — also async now
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

export async function setSuperAccessCookie() {
  const token = signSuperAccessToken();
  const store = await cookies();
  store.set(SUPER_ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SUPER_ACCESS_TTL_SECONDS,
    path: '/',
  });
}

export async function clearSuperAccessCookie() {
  const store = await cookies();
  store.delete(SUPER_ACCESS_COOKIE);
}

export async function hasSuperAccess(): Promise<boolean> {
  if (!isSuperAccessEnabled()) return false;
  const store = await cookies();
  const token = store.get(SUPER_ACCESS_COOKIE)?.value;
  if (!token) return false;
  return verifySuperAccessToken(token);
}
