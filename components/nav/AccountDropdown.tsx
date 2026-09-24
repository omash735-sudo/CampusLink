// components/nav/AccountDropdown.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export function AccountDropdown({
  fullName,
  email,
  avatar,
  profileHref,
  settingsHref,
}: {
  fullName: string;
  email: string;
  avatar?: string | null;
  profileHref: string;
  settingsHref?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const initials =
    fullName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex items-center rounded-full hover:bg-gray-100 p-1 transition-colors"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={fullName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-primary-text truncate">
              {fullName}
            </p>
            <p className="text-xs text-muted-text truncate">{email}</p>
          </div>

          <Link
            href={profileHref}
            role="menuitem"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profile
          </Link>

          {settingsHref && (
            <Link
              href={settingsHref}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Settings
            </Link>
          )}

          <div className="border-t border-gray-100">
            <button
              onClick={handleLogout}
              role="menuitem"
              className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
