// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicRoutes = ['/', '/about', '/campus', '/programmes', '/resources', '/events', '/opportunities', '/faq', '/contact'];
const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
const studentRoutes = ['/student/dashboard', '/connect', '/community', '/groups', '/mentors', '/profile', '/settings'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (!token || !verifyToken(token)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Protect student routes
  if (studentRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protect admin routes - check role from token
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const decoded = verifyToken(token);
    if (decoded?.role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Default: require authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons/|images/|api/).*)',
  ],
};
