// components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 border-2 border-primary-green bg-white"></div>
            <span className="text-xl font-semibold text-primary-green">CampusLink</span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className={`text-sm font-medium ${pathname === '/' ? 'text-primary-green' : 'text-primary-text'}`}>
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-primary-text hover:text-primary-green">About</Link>
            <Link href="/campus" className="text-sm font-medium text-primary-text hover:text-primary-green">Campus</Link>
            <Link href="/events" className="text-sm font-medium text-primary-text hover:text-primary-green">Events</Link>
            <Link href="/auth/login" className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
