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

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(userId: string, role: string = 'student') {
  return jwt.sign({ userId, role }, JWT_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET!) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, decoded.userId));

  return user[0] || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') throw new Error('Forbidden');
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

export async function adminExists(): Promise<boolean> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.role, 'admin'));
  return (result[0]?.count || 0) > 0;
}

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

export function getRedirectPath(user: {
  role?: string | null;
  isMentor?: boolean | null;
  mentorStatus?: string | null;
}): string {
  if (user.role === 'admin') return '/admin';
  if (user.isMentor && user.mentorStatus === 'approved') return '/mentor';
  return '/student/dashboard';
}

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
