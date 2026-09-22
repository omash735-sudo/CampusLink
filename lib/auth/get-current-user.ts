// lib/auth/get-current-user.ts
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from './verify-token';

/**
 * Reads the auth_token cookie from the current request context,
 * verifies it, and returns the full user row.
 *
 * Uses Node/Edge-compatible Neon HTTP driver, so this runs in both
 * route handlers and (via resolve-auth) middleware.
 *
 * Returns null if:
 *   - no cookie
 *   - token invalid/expired
 *   - user no longer exists
 *   - user.isActive === false
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const [found] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, decoded.userId))
    .limit(1);

  if (!found) return null;
  if (found.isActive === false) return null;

  return found;
}

/**
 * Variant used by resolveAuth when running in middleware, where the
 * `cookies()` helper isn't available. Takes the raw token string.
 */
export async function getUserByToken(token: string) {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const [found] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, decoded.userId))
    .limit(1);

  if (!found) return null;
  if (found.isActive === false) return null;

  return found;
}
