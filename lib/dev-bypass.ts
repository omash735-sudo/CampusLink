// lib/dev-bypass.ts
import { getCurrentUser } from '@/lib/auth';

const BYPASS_ENABLED =
  process.env.NODE_ENV !== 'production' &&
  process.env.TEMP_ADMIN_BYPASS === 'true';

export type AuthUser = {
  id: string | null;
  role: string;
  email: string;
  fullName: string;
};

/**
 * Returns the current admin/publications user, or a fake dev user when
 * TEMP_ADMIN_BYPASS=true in local development.
 *
 * The fake user has id=null so FK-constrained writes (uploadedBy, adminId)
 * are skipped rather than failing. Never active in production builds.
 */
export async function requireAdminOrPublications(): Promise<AuthUser | null> {
  if (BYPASS_ENABLED) {
    return {
      id: null,
      role: 'admin',
      email: 'dev@localhost',
      fullName: 'Dev Bypass',
    };
  }
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'publications') return null;
  return user as AuthUser;
}

export const IS_DEV_BYPASS = BYPASS_ENABLED;
