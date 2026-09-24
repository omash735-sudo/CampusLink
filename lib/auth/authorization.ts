// lib/auth/authorization.ts
import type { Role } from './roles';

/**
 * A user shape sufficient for authorization decisions.
 * Matches the subset of campuslink_users the rules need.
 */
export type AuthUserLike = {
  role: Role | string | null | undefined;
  isMentor?: boolean | null;
  mentorStatus?: string | null;
  publicationsStatus?: string | null;
};

export type Rule = {
  pattern: string;
  allow: (user: AuthUserLike) => boolean;
};

// ---------------------------------------------------------------------------
// Pattern matching (unchanged)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Shared predicates
// ---------------------------------------------------------------------------

const isAdmin = (u: AuthUserLike) => u.role === 'admin';

/**
 * An approved mentor. Role stays 'student' for mentors promoted via the
 * application flow; isMentor + mentorStatus are the source of truth.
 * Admins are always allowed.
 */
const isApprovedMentor = (u: AuthUserLike) =>
  isAdmin(u) ||
  (u.isMentor === true && u.mentorStatus === 'approved');

/**
 * An approved publications officer. Set explicitly by the admin role-change
 * route, which flips role='publications' AND publicationsStatus='approved'.
 * Admins are always allowed.
 */
const isApprovedPublications = (u: AuthUserLike) =>
  isAdmin(u) ||
  u.role === 'publications' ||
  u.publicationsStatus === 'approved';

/**
 * Any authenticated user with an active account. Every rule below that isn't
 * admin-only or flag-gated lands here.
 */
const isAnyAuthenticated = (_u: AuthUserLike) => true;

// ---------------------------------------------------------------------------
// Public routes
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

export const PUBLIC_PREEMPT_ROUTES: string[] = [
  '/resources/upload',
];

export function isPublic(pathname: string): boolean {
  if (PUBLIC_PREEMPT_ROUTES.some((p) => matchPattern(p, pathname))) {
    return false;
  }
  return PUBLIC_ROUTES.some((p) => matchPattern(p, pathname));
}

// ---------------------------------------------------------------------------
// Authenticated route rules
// ---------------------------------------------------------------------------

export const AUTH_ROUTE_RULES: Rule[] = [
  // --- Shared infrastructure routes ---
  { pattern: '/resources/upload', allow: isAnyAuthenticated },
  { pattern: '/messages',         allow: isAnyAuthenticated },
  { pattern: '/messages/**',      allow: isAnyAuthenticated },
  { pattern: '/notifications',    allow: isAnyAuthenticated },
  { pattern: '/notifications/**', allow: isAnyAuthenticated },

  // --- Mentor area: approved mentor OR admin ---
  { pattern: '/mentor',    allow: isApprovedMentor },
  { pattern: '/mentor/**', allow: isApprovedMentor },

  // --- Student area: everyone ---
  { pattern: '/student/**',     allow: isAnyAuthenticated },
  { pattern: '/connect',        allow: isAnyAuthenticated },
  { pattern: '/connect/**',     allow: isAnyAuthenticated },
  { pattern: '/mentorship',     allow: isAnyAuthenticated },
  { pattern: '/mentorship/**',  allow: isAnyAuthenticated },
  { pattern: '/mentors',        allow: isAnyAuthenticated },
  { pattern: '/mentors/**',     allow: isAnyAuthenticated },
  { pattern: '/community/**',   allow: isAnyAuthenticated },
  { pattern: '/groups/**',      allow: isAnyAuthenticated },

  { pattern: '/profile',    allow: isAnyAuthenticated },
  { pattern: '/profile/**', allow: isAnyAuthenticated },
  { pattern: '/settings',   allow: isAnyAuthenticated },
  { pattern: '/settings/**', allow: isAnyAuthenticated },

  // --- Publications content area: approved publications officer OR admin ---
  // (must appear BEFORE the /admin/** catch-all)
  { pattern: '/admin',                        allow: isApprovedPublications },
  { pattern: '/admin/publications',           allow: isApprovedPublications },
  { pattern: '/admin/publications/**',        allow: isApprovedPublications },
  { pattern: '/admin/announcements',          allow: isApprovedPublications },
  { pattern: '/admin/announcements/**',       allow: isApprovedPublications },
  { pattern: '/admin/events',                 allow: isApprovedPublications },
  { pattern: '/admin/events/**',              allow: isApprovedPublications },
  { pattern: '/admin/student-union',          allow: isApprovedPublications },
  { pattern: '/admin/student-union/**',       allow: isApprovedPublications },
  { pattern: '/admin/spotlights',             allow: isApprovedPublications },
  { pattern: '/admin/spotlights/**',          allow: isApprovedPublications },
  { pattern: '/admin/clubs',                  allow: isApprovedPublications },
  { pattern: '/admin/clubs/**',               allow: isApprovedPublications },
  { pattern: '/admin/resources',              allow: isApprovedPublications },
  { pattern: '/admin/resources/**',           allow: isApprovedPublications },
  { pattern: '/admin/resource-categories',    allow: isApprovedPublications },
  { pattern: '/admin/resource-categories/**', allow: isApprovedPublications },
  { pattern: '/admin/profile',                allow: isApprovedPublications },
  { pattern: '/admin/profile/**',             allow: isApprovedPublications },

  // --- Admin only (catch-all) ---
  { pattern: '/admin/**', allow: isAdmin },
];

export const API_ROUTE_RULES: Rule[] = [
  // --- Publications-accessible admin APIs ---
  { pattern: '/api/admin/upload',                  allow: isApprovedPublications },
  { pattern: '/api/admin/publications',            allow: isApprovedPublications },
  { pattern: '/api/admin/publications/**',         allow: isApprovedPublications },
  { pattern: '/api/admin/announcements',           allow: isApprovedPublications },
  { pattern: '/api/admin/announcements/**',        allow: isApprovedPublications },
  { pattern: '/api/admin/events',                  allow: isApprovedPublications },
  { pattern: '/api/admin/events/**',               allow: isApprovedPublications },
  { pattern: '/api/admin/student-union',           allow: isApprovedPublications },
  { pattern: '/api/admin/student-union/**',        allow: isApprovedPublications },
  { pattern: '/api/admin/spotlights',              allow: isApprovedPublications },
  { pattern: '/api/admin/spotlights/**',           allow: isApprovedPublications },
  { pattern: '/api/admin/clubs',                   allow: isApprovedPublications },
  { pattern: '/api/admin/clubs/**',                allow: isApprovedPublications },
  { pattern: '/api/admin/resources',               allow: isApprovedPublications },
  { pattern: '/api/admin/resources/**',            allow: isApprovedPublications },
  { pattern: '/api/admin/resource-categories',     allow: isApprovedPublications },
  { pattern: '/api/admin/resource-categories/**',  allow: isApprovedPublications },

  // --- Admin only ---
  { pattern: '/api/admin/**', allow: isAdmin },

  // --- Mentor APIs ---
  { pattern: '/api/mentor',    allow: isApprovedMentor },
  { pattern: '/api/mentor/**', allow: isApprovedMentor },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function canAccess(
  user: AuthUserLike,
  pathname: string,
  rules: Rule[] = AUTH_ROUTE_RULES
): boolean {
  for (const rule of rules) {
    if (matchPattern(rule.pattern, pathname)) {
      return rule.allow(user);
    }
  }
  return false;
}

/**
 * Back-compat: previous signature took a bare `role` string.
 * Still supported for callers that haven't been updated yet.
 *
 * NOTE: this only knows the role, not the flags, so it will NOT grant
 * flag-based access (e.g. a student with isMentor=true will be denied
 * /mentor via this helper). Prefer canAccess(user, path).
 */
export function canAccessByRole(
  role: Role,
  pathname: string,
  rules: Rule[] = AUTH_ROUTE_RULES
): boolean {
  return canAccess({ role }, pathname, rules);
}

export function canAccessAsMentor(
  user: AuthUserLike,
  pathname: string
): boolean {
  return isApprovedMentor(user) && (pathname === '/mentor' || pathname.startsWith('/mentor/'));
}

export function explainDenial(
  user: AuthUserLike,
  pathname: string,
  rules: Rule[] = AUTH_ROUTE_RULES
): { matched: Rule | null; allowed: boolean } {
  for (const rule of rules) {
    if (matchPattern(rule.pattern, pathname)) {
      const allowed = rule.allow(user);
      if (!allowed && process.env.NODE_ENV !== 'production') {
        console.warn(
          `[auth] user(role=${user.role}, mentor=${user.isMentor}, pubs=${user.publicationsStatus}) denied ${pathname} (rule: ${rule.pattern})`
        );
      }
      return { matched: rule, allowed };
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[auth] user(role=${user.role}) denied ${pathname} (no matching rule — deny by default)`
    );
  }
  return { matched: null, allowed: false };
}
