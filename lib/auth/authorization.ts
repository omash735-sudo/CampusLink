// lib/auth/authorization.ts
import type { Role } from './roles';

export type Rule = {
  pattern: string;
  allow: Role[];
};

// ---------------------------------------------------------------------------
// Pattern matching
// ---------------------------------------------------------------------------
// '/admin'         → exact
// '/admin/**'      → '/admin' and everything under it
// '/admin/*'       → '/admin/x' but not '/admin/x/y'
// ---------------------------------------------------------------------------

function matchPattern(pattern: string, pathname: string): boolean {
  if (pattern === pathname) return true;

  if (pattern.endsWith('/**')) {
    const prefix = pattern.slice(0, -3); // strip '/**'
    return pathname === prefix || pathname.startsWith(prefix + '/');
  }

  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2); // strip '/*'
    if (!pathname.startsWith(prefix + '/')) return false;
    const rest = pathname.slice(prefix.length + 1);
    return rest.length > 0 && !rest.includes('/');
  }

  return false;
}

// ---------------------------------------------------------------------------
// Public routes — no authentication required
// ---------------------------------------------------------------------------

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

/**
 * Explicit authenticated pre-emptions that would otherwise be swept up
 * by a public wildcard above. These must be checked BEFORE PUBLIC_ROUTES.
 * Example: '/resources/upload' must not become public just because
 * '/resources/**' is public.
 */
export const PUBLIC_PREEMPT_ROUTES: string[] = [
  '/resources/upload',
];

export function isPublic(pathname: string): boolean {
  // Pre-emptions beat public wildcards.
  if (PUBLIC_PREEMPT_ROUTES.some((p) => matchPattern(p, pathname))) {
    return false;
  }
  return PUBLIC_ROUTES.some((p) => matchPattern(p, pathname));
}

// ---------------------------------------------------------------------------
// Authenticated route rules for pages
// ---------------------------------------------------------------------------

export const AUTH_ROUTE_RULES: Rule[] = [
  // --- Explicit authenticated pre-emptions (before public wildcards) ---
  { pattern: '/resources/upload', allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/messages',         allow: ['student', 'mentor', 'admin'] },
  { pattern: '/messages/**',      allow: ['student', 'mentor', 'admin'] },
  { pattern: '/notifications',    allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/notifications/**', allow: ['student', 'mentor', 'publications', 'admin'] },

  // --- Mentor ---
  { pattern: '/mentor',    allow: ['mentor', 'admin'] },
  { pattern: '/mentor/**', allow: ['mentor', 'admin'] },

  // --- Student ---
  { pattern: '/student/**',     allow: ['student', 'admin'] },
  { pattern: '/connect',        allow: ['student', 'mentor', 'admin'] },
  { pattern: '/connect/**',     allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentorship',     allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentorship/**',  allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentors',        allow: ['student', 'mentor', 'admin'] },
  { pattern: '/mentors/**',     allow: ['student', 'mentor', 'admin'] },
  { pattern: '/community/**',   allow: ['student', 'admin'] },
  { pattern: '/groups/**',      allow: ['student', 'admin'] },

  // --- Any authenticated user ---
  { pattern: '/profile',    allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/profile/**', allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/settings',   allow: ['student', 'mentor', 'publications', 'admin'] },
  { pattern: '/settings/**', allow: ['student', 'mentor', 'publications', 'admin'] },

  // --- Publications (must appear BEFORE the /admin/** catch-all) ---
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

  // --- Admin catch-all ---
  { pattern: '/admin/**', allow: ['admin'] },
];

// ---------------------------------------------------------------------------
// Authenticated route rules for API endpoints
// ---------------------------------------------------------------------------

export const API_ROUTE_RULES: Rule[] = [
  // Publications can manage content/media — upload included.
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

  // Everything else under /api/admin is admin-only
  { pattern: '/api/admin/**', allow: ['admin'] },

  // Mentor API
  { pattern: '/api/mentor',    allow: ['mentor', 'admin'] },
  { pattern: '/api/mentor/**', allow: ['mentor', 'admin'] },
];

// ---------------------------------------------------------------------------
// The authorization decision — pure function of (role, pathname, rules)
// ---------------------------------------------------------------------------

/**
 * Returns true if `role` may access `pathname` under `rules`.
 *
 * Deny-by-default: if no rule matches, returns false.
 * Any newly added route must be explicitly allowed by a rule.
 */
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
 * Development aid: if canAccess denies because no rule matched, log it
 * so a missing rule is obvious rather than silent.
 * Never logs in production.
 */
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
