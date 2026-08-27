// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth/auth';

const publicRoutes = ['/', '/about', '/campus', '/programmes', '/resources', '/events', '/opportunities', '/faq', '/contact'];
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const studentRoutes = ['/home', '/connect', '/community', '/groups', '/mentors', '/profile', '/settings'];
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  // Protect student routes
  if (studentRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check admin role
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.id)
      .single();

    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    
    return NextResponse.next();
  }

  // Default: require authentication
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - service-worker.js (service worker)
     * - icons/ (icon placeholder)
     * - images/ (image placeholders)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icons/|images/).*)',
  ],
};
