import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { checkSuperAccessToken } from '@/lib/middleware-helpers';

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
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Routes that are public (no auth required)
const openAdminRoutes = ['/admin/setup', '/admin/login'];
const openSuperAccessRoutes = ['/super-access'];

const studentRoutes = [
  '/student/dashboard',
  '/connect',
  '/community',
  '/groups',
  '/mentors',
  '/profile',
  '/settings',
];

const mentorRoutes = ['/mentor'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const superToken = request.cookies.get('super_access_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Super-access login page is always public
  if (openSuperAccessRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Admin setup page is public (self-disables inside the page if admin exists)
  if (openAdminRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Public marketing routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Auth pages — redirect if already logged in
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Everything below requires auth
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const decoded = verifyToken(token)!;
  const hasSuper = checkSuperAccessToken(superToken);

  // Admin routes — strictly admin only
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Mentor routes — allow real mentor, or admin with super access
  if (mentorRoutes.some((route) => pathname.startsWith(route))) {
    if (decoded.role === 'admin' && hasSuper) return NextResponse.next();
    return NextResponse.next(); // actual mentor check happens in page via requireMentor()
  }

  // Student routes — allow student, or admin with super access
  if (studentRoutes.some((route) => pathname.startsWith(route))) {
    if (decoded.role === 'admin' && hasSuper) return NextResponse.next();
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons/|images/|api/).*)',
  ],
};
