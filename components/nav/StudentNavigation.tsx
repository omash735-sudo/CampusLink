// components/nav/StudentNavigation.tsx
'use client';

import { useEffect, useState } from 'react';
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

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + close on Escape while drawer is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo — always left, always visible */}
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

          {/* Desktop nav — unchanged */}
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

          {/* Mobile right cluster: Profile + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <AccountDropdown
              fullName={user.fullName}
              email={user.email}
              avatar={user.avatar}
              profileHref="/profile"
              settingsHref="/settings"
            />
            <button
              onClick={() => setOpen(true)}
              className="p-2 text-primary-text hover:text-primary-green"
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-nav-drawer"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Right-side drawer */}
      <aside
        id="mobile-nav-drawer"
        className={`fixed right-0 top-0 z-50 h-full w-72 max-w-[80vw] transform bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-lg font-semibold text-primary-green">
            Menu
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-primary-text hover:text-primary-green"
            aria-label="Close navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col py-2">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-3 text-sm font-medium transition-colors hover:bg-off-white hover:text-primary-green ${
                pathname === link.href
                  ? 'bg-off-white text-primary-green'
                  : 'text-primary-text'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </aside>
    </nav>
  );
}
