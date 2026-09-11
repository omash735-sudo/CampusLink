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
  '/auth/forgot-password',
  '/auth/reset-password',
];

const openAdminRoutes = ['/admin/setup'];
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

  if (openSuperAccessRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    return NextResponse.next();
  }

  if (openAdminRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    return NextResponse.next();
  }

  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  if (authRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    if (token && verifyToken(token)) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const decoded = verifyToken(token)!;

  if (adminRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (mentorRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  if (studentRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons/|images/|api/).*)',
  ],
};
