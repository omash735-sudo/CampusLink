// lib/auth/authorization.ts
import type { Role } from './roles';

export type Rule = {
  pattern: string;
  allow: Role[];
};

function matchPattern(pattern: string, pathname: string): boolean {
  if (pattern === pathname) return true;

  if (pattern.endsWith('/**')) {
    const prefix = pattern.slice(0, -3);
    return pathname === prefix || pathname.startsWith(prefix + '/');
  }

  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2);
    if (!pathname.startsWith(prefix + '/')) return false;
    const rest = pathname.slice(prefix.length + 1);
    return rest.length > 0 && !rest.includes('/');
  }

  return false;
}

export const PUBLIC_ROUTES: string[] = [
  '/',
  '/about',
  '/campus',
  '/campus/**',
  '/programmes',
  '/programmes/**',
  '/resources',
  '/resources/**',
  '/events',
  '/events/**',
  '/opportunities',
  '/opportunities/**',
  '/faq',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy',
  '/student-union',
  '/student-union/**',
  '/student-spotlight',
  '/student-spotlight/**',
  '/clubs',
  '/clubs/**',
  '/publications',
  '/publications/**',
  '/auth/login',
  '/auth/register',
  '/auth/register-success',
  '/auth/forgot-password',
  '/auth/verify-otp',
  '/auth/reset-password',
  '/admin/setup',
  '/super-access',
];

export const PUBLIC_PREEMPT_ROUTES: string[] = [
  '/resources/upload',
];

export function isPublic(pathname: string): boolean {
  if (PUBLIC_PREEMPT_ROUTES.some((p) => matchPattern(p, pathname))) {
    return false;
  }
  return PUBLIC_ROUTES.some((p) => matchPattern(p, pathname));
}

export const AUTH_ROUTE_RULES: Rule[] = [
  { pattern: '/resources/upload', allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/messages',         allow: ['student', 'mentor', 'admin'] },
  { pattern: '/messages/**',      allow: ['student', 'mentor', 'admin'] },
  { pattern: '/notifications',    allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/notifications/**', allow: ['student', 'mentor', 'publications', 'admin'] },

  { pattern: '/mentor',    allow: ['mentor', 'admin'] },
  { pattern: '/mentor/**', allow: ['mentor', 'admin'] },

  { pattern: '/student/**',     allow: ['student', 'admin'] },
  { pattern: '/connect',        allow: ['student', 'mentor', 'admin'] },
  { pattern: '/connect/**',     allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentorship',     allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentorship/**',  allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentors',        allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentors/**',     allow: ['student', 'mentor', 'admin'] },
  { pattern: '/community/**',   allow: ['student', 'admin'] },
  { pattern: '/groups/**',      allow: ['student', 'admin'] },

  { pattern: '/profile',    allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/profile/**', allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/settings',   allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/settings/**', allow: ['student', 'mentor', 'publications', 'admin'] },

  { pattern: '/admin',                        allow: ['publications', 'admin'] },
  { pattern: '/admin/publications',           allow: ['publications', 'admin'] },
  { pattern: '/admin/publications/**',        allow: ['publications', 'admin'] },
  { pattern: '/admin/announcements',          allow: ['publications', 'admin'] },
  { pattern: '/admin/announcements/**',       allow: ['publications', 'admin'] },
  { pattern: '/admin/events',                 allow: ['publications', 'admin'] },
  { pattern: '/admin/events/**',              allow: ['publications', 'admin'] },
  { pattern: '/admin/student-union',          allow: ['publications', 'admin'] },
  { pattern: '/admin/student-union/**',       allow: ['publications', 'admin'] },
  { pattern: '/admin/spotlights',             allow: ['publications', 'admin'] },
  { pattern: '/admin/spotlights/**',          allow: ['publications', 'admin'] },
  { pattern: '/admin/clubs',                  allow: ['publications', 'admin'] },
  { pattern: '/admin/clubs/**',               allow: ['publications', 'admin'] },
  { pattern: '/admin/resources',              allow: ['publications', 'admin'] },
  { pattern: '/admin/resources/**',           allow: ['publications', 'admin'] },
  { pattern: '/admin/resource-categories',    allow: ['publications', 'admin'] },
  { pattern: '/admin/resource-categories/**', allow: ['publications', 'admin'] },
  { pattern: '/admin/profile',                allow: ['publications', 'admin'] },
  { pattern: '/admin/profile/**',             allow: ['publications', 'admin'] },

  { pattern: '/admin/**', allow: ['admin'] },
];

export const API_ROUTE_RULES: Rule[] = [
  { pattern: '/api/admin/upload',                  allow: ['publications', 'admin'] },
  { pattern: '/api/admin/publications',            allow: ['publications', 'admin'] },
  { pattern: '/api/admin/publications/**',         allow: ['publications', 'admin'] },
  { pattern: '/api/admin/announcements',           allow: ['publications', 'admin'] },
  { pattern: '/api/admin/announcements/**',        allow: ['publications', 'admin'] },
  { pattern: '/api/admin/events',                  allow: ['publications', 'admin'] },
  { pattern: '/api/admin/events/**',               allow: ['publications', 'admin'] },
  { pattern: '/api/admin/student-union',           allow: ['publications', 'admin'] },
  { pattern: '/api/admin/student-union/**',        allow: ['publications', 'admin'] },
  { pattern: '/api/admin/spotlights',              allow: ['publications', 'admin'] },
  { pattern: '/api/admin/spotlights/**',           allow: ['publications', 'admin'] },
  { pattern: '/api/admin/clubs',                   allow: ['publications', 'admin'] },
  { pattern: '/api/admin/clubs/**',                allow: ['publications', 'admin'] },
  { pattern: '/api/admin/resources',               allow: ['publications', 'admin'] },
  { pattern: '/api/admin/resources/**',            allow: ['publications', 'admin'] },
  { pattern: '/api/admin/resource-categories',     allow: ['publications', 'admin'] },
  { pattern: '/api/admin/resource-categories/**',  allow: ['publications', 'admin'] },

  { pattern: '/api/admin/**', allow: ['admin'] },

  { pattern: '/api/mentor',    allow: ['mentor', 'admin'] },
  { pattern: '/api/mentor/**', allow: ['mentor', 'admin'] },
];

export function canAccess(
  role: Role,
  pathname: string,
  rules: Rule[] = AUTH_ROUTE_RULES
): boolean {
  for (const rule of rules) {
    if (matchPattern(rule.pattern, pathname)) {
      return rule.allow.includes(role);
    }
  }
  return false;
}

/**
 * Mentor-flag authorization check.
 *
 * Runs alongside canAccess(). A user whose DB flags are
 * isMentor === true and mentorStatus === 'approved' gets access
 * to /mentor/* regardless of their base role (which stays 'student').
 *
 * Non-mentors get false here — canAccess is still the primary gate
 * for their role-based routes.
 */
export function canAccessAsMentor(
  user: { isMentor?: boolean | null; mentorStatus?: string | null },
  pathname: string
): boolean {
  const isApprovedMentor =
    user.isMentor === true && user.mentorStatus === 'approved';
  if (!isApprovedMentor) return false;

  if (pathname === '/mentor' || pathname.startsWith('/mentor/')) {
    return true;
  }

  return false;
}

export function explainDenial(
  role: Role,
  pathname: string,
  rules: Rule[] = AUTH_ROUTE_RULES
): { matched: Rule | null; allowed: boolean } {
  for (const rule of rules) {
    if (matchPattern(rule.pattern, pathname)) {
      const allowed = rule.allow.includes(role);
      if (!allowed && process.env.NODE_ENV !== 'production') {
        console.warn(
          `[auth] ${role} denied ${pathname} (rule: ${rule.pattern}, allowed: ${rule.allow.join(', ')})`
        );
      }
      return { matched: rule, allowed };
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[auth] ${role} denied ${pathname} (no matching rule — deny by default)`
    );
  }
  return { matched: null, allowed: false };
}
