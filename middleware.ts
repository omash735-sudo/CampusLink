// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('[middleware] JWT_SECRET is not set');
}

const DEV_BYPASS_ENABLED = process.env.DEV_BYPASS === 'true';

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as { userId: string; role: string };
  } catch {
    return null;
  }
}

function checkSuperAccess(token: string | undefined): boolean {
  if (!token) return false;
  if (process.env.SUPER_ACCESS_ENABLED !== 'true') return false;
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { type?: string };
    return decoded?.type === 'super_access';
  } catch {
    return false;
  }
}

function getRedirectPathForRole(role: string | undefined): string {
  if (role === 'admin' || role === 'publications') return '/admin';
  return '/student/dashboard';
}

const publicRoutes = [
  '/',
  '/about',
  '/campus',
  '/programmes',
  '/resources',
  '/events',
  '/opportunities',
  '/faq',
  '/contact',
  '/feedback',
  '/terms',
  '/privacy',
  '/student-union',
  '/student-spotlight',
  '/clubs',
  '/publications',
];

const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/register-success',
  '/auth/forgot-password',
  '/auth/verify-otp',
  '/auth/reset-password',
];

const openAdminRoutes = ['/admin/setup'];
const openSuperAccessRoutes = ['/super-access'];

const publicationsAllowedRoutes = [
  '/admin',
  '/admin/announcements',
  '/admin/events',
  '/admin/student-union',
  '/admin/spotlights',
  '/admin/clubs',
  '/admin/resources',
  '/admin/resource-categories',
  '/admin/publications',
];

const adminRoutes = ['/admin'];
const mentorRoutes = ['/mentor'];
const studentRoutes = [
  '/student',
  '/connect',
  '/community',
  '/groups',
  '/mentors',
  '/profile',
  '/settings',
];

function matches(pathname: string, routes: string[]) {
  return routes.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const superToken = request.cookies.get('super_access_token')?.value;
  const pathname = request.nextUrl.pathname;

  if (matches(pathname, openSuperAccessRoutes)) return NextResponse.next();
  if (matches(pathname, openAdminRoutes)) return NextResponse.next();
  if (matches(pathname, publicRoutes)) return NextResponse.next();

  if (matches(pathname, authRoutes)) {
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        return NextResponse.redirect(
          new URL(getRedirectPathForRole(decoded.role), request.url)
        );
      }
    }
    return NextResponse.next();
  }

  if (DEV_BYPASS_ENABLED && matches(pathname, adminRoutes)) {
    console.warn(`[DEV_BYPASS] admin path allowed without auth: ${pathname}`);
    return NextResponse.next();
  }

  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (matches(pathname, adminRoutes)) {
    if (decoded.role === 'admin') return NextResponse.next();
    if (
      decoded.role === 'publications' &&
      matches(pathname, publicationsAllowedRoutes)
    ) {
      return NextResponse.next();
    }
    if (decoded.role === 'publications') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  if (matches(pathname, mentorRoutes)) {
    const hasSuper = checkSuperAccess(superToken);
    if (decoded.role === 'admin' && hasSuper) return NextResponse.next();
    return NextResponse.next();
  }

  if (matches(pathname, studentRoutes)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons/|images/|api/).*)',
  ],
};
