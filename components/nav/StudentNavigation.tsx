// components/nav/StudentNavigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AccountDropdown } from './AccountDropdown';

export type NavUser = {
  fullName: string;
  email: string;
  avatar?: string | null;
};

const links = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/student/dashboard' },
  { name: 'Connect', href: '/connect' },
  { name: 'Find a Mentor', href: '/mentors' },
  { name: 'Resources', href: '/resources' },
  { name: 'Campus', href: '/campus' },
  { name: 'Events', href: '/events' },
];

export function StudentNavigation({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
              alt="CampusLink"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="text-xl font-semibold text-primary-green">
              CampusLink
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-green ${
                  pathname === link.href
                    ? 'text-primary-green'
                    : 'text-primary-text'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <AccountDropdown
              fullName={user.fullName}
              email={user.email}
              avatar={user.avatar}
              profileHref="/profile"
              settingsHref="/settings"
            />
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-primary-text hover:text-primary-green md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-off-white hover:text-primary-green ${
                    pathname === link.href
                      ? 'bg-off-white text-primary-green'
                      : 'text-primary-text'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                <AccountDropdown
                  fullName={user.fullName}
                  email={user.email}
                  avatar={user.avatar}
                  profileHref="/profile"
                  settingsHref="/settings"
                />
                <span className="text-sm text-muted-text truncate">
                  {user.fullName}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
