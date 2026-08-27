// components/layout/Navigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  ChatBubbleLeftIcon,
  BookOpenIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = false; // Will be replaced with auth state

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Connect', href: '/connect', icon: UsersIcon },
    { name: 'Community', href: '/community', icon: ChatBubbleLeftIcon },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  ];

  const publicNavigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Campus', href: '/campus' },
    { name: 'Programmes', href: '/programmes' },
    { name: 'Resources', href: '/resources' },
    { name: 'Events', href: '/events' },
    { name: 'Opportunities', href: '/opportunities' },
  ];

  const currentNav = isAuthenticated ? navigation : publicNavigation;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 border-2 border-primary-green bg-white"></div>
            <span className="text-xl font-semibold text-primary-green">
              CampusLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {currentNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-green ${
                  pathname === item.href
                    ? 'text-primary-green'
                    : 'text-primary-text'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="btn-primary px-4 py-2 text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-primary-text hover:text-primary-green md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="space-y-2">
              {currentNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 text-sm font-medium transition-colors hover:bg-off-white hover:text-primary-green ${
                    pathname === item.href
                      ? 'bg-off-white text-primary-green'
                      : 'text-primary-text'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm font-medium text-primary-green hover:bg-off-white"
                  onClick={() => setIsMobileMenuOpen(false)}
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
