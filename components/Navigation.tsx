// components/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = document.cookie.includes('auth_token');
    setIsLoggedIn(token);
  }, []);

  const navLinks = isLoggedIn ? [
    { name: 'Dashboard', href: '/student/dashboard' },
    { name: 'Connect', href: '/connect' },
    { name: 'Community', href: '/community' },
    { name: 'Resources', href: '/resources' },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Campus', href: '/campus' },
    { name: 'Events', href: '/events' },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 border-2 border-primary-green bg-white"></div>
            <span className="text-xl font-semibold text-primary-green">CampusLink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-green ${
                  pathname === link.href ? 'text-primary-green' : 'text-primary-text'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                  window.location.href = '/';
                }}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-primary-text hover:text-primary-green md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-off-white hover:text-primary-green ${
                    pathname === link.href ? 'bg-off-white text-primary-green' : 'text-primary-text'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-off-white text-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-primary-green hover:bg-off-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
