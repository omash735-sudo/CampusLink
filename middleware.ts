// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveAuth } from '@/lib/auth/resolve-auth';
import {
  isPublic,
  canAccess,
  canAccessAsMentor,
  explainDenial,
  AUTH_ROUTE_RULES,
} from '@/lib/auth/authorization';
import { landingFor } from '@/lib/auth/roles';

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/register-success',
  '/auth/forgot-password',
  '/auth/verify-otp',
  '/auth/reset-password',
];

function matchesAny(pathname: string, routes: string[]): boolean {
  return routes.some(
    (r) => pathname === r || pathname.startsWith(r + '/')
  );
}

function isAuthRoute(pathname: string): boolean {
  return matchesAny(pathname, AUTH_ROUTES);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  if (isAuthRoute(pathname)) {
    const auth = await resolveAuth(request);
    if (auth.authenticated) {
      return NextResponse.redirect(
        new URL(landingFor(auth.user.role), request.url)
      );
    }
    return NextResponse.next();
  }

  const auth = await resolveAuth(request);

  if (!auth.authenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Combined check: role-based rules OR mentor-flag rules.
  const allowed =
    canAccess(auth.user.role, pathname, AUTH_ROUTE_RULES) ||
    canAccessAsMentor(auth.user, pathname);

  if (!allowed) {
    explainDenial(auth.user.role, pathname, AUTH_ROUTE_RULES);
    return NextResponse.redirect(
      new URL(landingFor(auth.user.role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons/|images/|api/).*)',
  ],
};
