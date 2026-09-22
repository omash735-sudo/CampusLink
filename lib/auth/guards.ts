// lib/auth/guards.ts
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { resolveAuth, type AuthUser } from './resolve-auth';
import {
  canAccess,
  explainDenial,
  API_ROUTE_RULES,
  AUTH_ROUTE_RULES,
} from './authorization';
import { landingFor } from './roles';

// ---------------------------------------------------------------------------
// Server component guard
// ---------------------------------------------------------------------------

/**
 * For server components. Resolves auth, enforces authorization for the
 * given page path, redirects on failure, returns the user on success.
 *
 *   const user = await requireUserFor('/admin/mentors');
 */
export async function requireUserFor(pagePath: string): Promise<AuthUser> {
  const auth = await resolveAuth();

  if (!auth.authenticated) {
    redirect(`/auth/login?next=${encodeURIComponent(pagePath)}`);
  }

  if (!canAccess(auth.user.role, pagePath, AUTH_ROUTE_RULES)) {
    explainDenial(auth.user.role, pagePath, AUTH_ROUTE_RULES);
    redirect(landingFor(auth.user.role));
  }

  return auth.user;
}

// ---------------------------------------------------------------------------
// API route guard
// ---------------------------------------------------------------------------

type GuardResult =
  | { ok: true; user: AuthUser }
  | { ok: false; response: NextResponse };

/**
 * For API route handlers. Resolves auth, enforces authorization for the
 * given API path, returns either { ok: false, response } for early return
 * or { ok: true, user } for the handler to continue.
 *
 *   const guard = await requireAuthFor(request, '/api/admin/mentors');
 *   if (!guard.ok) return guard.response;
 *   // use guard.user
 */
export async function requireAuthFor(
  request: Request,
  apiPath: string
): Promise<GuardResult> {
  const auth = await resolveAuth(request);

  if (!auth.authenticated) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (!canAccess(auth.user.role, apiPath, API_ROUTE_RULES)) {
    explainDenial(auth.user.role, apiPath, API_ROUTE_RULES);
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { ok: true, user: auth.user };
}

// ---------------------------------------------------------------------------
// Authentication-only guards (no authorization check)
// ---------------------------------------------------------------------------

/**
 * Require any authenticated user. No role check.
 * Use for endpoints that should work for any logged-in user
 * (e.g. profile updates, logout, /api/auth/me).
 */
export async function requireAnyAuth(request?: Request): Promise<AuthUser> {
  const auth = await resolveAuth(request);
  if (!auth.authenticated) {
    // For API use, prefer requireAuthFor. This variant is for server
    // components where redirect is the right failure mode.
    redirect('/auth/login');
  }
  return auth.user;
}
