// lib/auth/get-current-user.ts
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from './verify-token';

/**
 * Delegates to resolveAuth() so behavior is identical.
 * Returns the same AuthUser shape, or null if unauthenticated.
 */
export async function getCurrentUser() {
  const { resolveAuth } = await import('./resolve-auth');
  const auth = await resolveAuth();
  if (!auth.authenticated) return null;
  return auth.user;
}

/**
 * Variant for middleware / callers that already have a token.
 * Also shares verification + DB lookup logic.
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
