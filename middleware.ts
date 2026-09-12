// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('[middleware] JWT_SECRET is not set');
}

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
];

const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/register-success',
  '/auth/forgot-password',
  '/auth/reset-password',
];

const openAdminRoutes = ['/admin/setup'];
const openSuperAccessRoutes = ['/super-access'];

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
  return routes.some(
    (r) => pathname === r || pathname.startsWith(r + '/')
  );
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const superToken = request.cookies.get('super_access_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Public: super-access setup, admin first-time setup
  if (matches(pathname, openSuperAccessRoutes)) return NextResponse.next();
  if (matches(pathname, openAdminRoutes)) return NextResponse.next();

  // Public marketing pages
  if (matches(pathname, publicRoutes)) return NextResponse.next();

  // Auth pages — if already logged in, send to their dashboard
  if (matches(pathname, authRoutes)) {
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const target =
          decoded.role === 'admin' ? '/admin' : '/student/dashboard';
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
    return NextResponse.next();
  }

  // Everything below requires a valid token
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) {
    // Not logged in — send to login. Preserve intended destination.
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: admin only
  if (matches(pathname, adminRoutes)) {
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Mentor routes: mentor, admin, or admin with super access
  if (matches(pathname, mentorRoutes)) {
    const hasSuper = checkSuperAccess(superToken);
    if (decoded.role === 'admin' && hasSuper) return NextResponse.next();
    // Actual mentor check happens in the page via requireMentor()
    return NextResponse.next();
  }

  // Student routes: any authenticated user
  if (matches(pathname, studentRoutes)) {
    return NextResponse.next();
  }

  // Unknown protected route — require auth but let through
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons/|images/|api/).*)',
  ],
};
