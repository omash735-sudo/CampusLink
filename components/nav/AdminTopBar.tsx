// components/nav/AdminTopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AccountDropdown } from './AccountDropdown';
import type { NavUser } from './StudentNavigation';

export function AdminTopBar({ user }: { user: NavUser }) {
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
            <span className="text-xs bg-gray-100 px-2 py-0.5">Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm font-medium text-primary-green hover:underline"
            >
              ← Back to Admin Dashboard
            </Link>
            <AccountDropdown
              fullName={user.fullName}
              email={user.email}
              avatar={user.avatar}
              profileHref="/admin/profile"
              settingsHref="/admin/settings"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
