// app/admin/AdminLayoutShell.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  BellIcon,
  SettingsIcon,
  MapPinIcon,
  FlagIcon,
  ChatIcon,
  BriefcaseIcon,
  AcademicIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
} from '@/components/icons';

type NavItem = {
  name: string;
  href: string;
  icon: any;
  roles: Array<'admin' | 'publications'>;
};

const allNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, roles: ['admin', 'publications'] },
  { name: 'Students', href: '/admin/students', icon: UsersIcon, roles: ['admin'] },
  { name: 'Mentors', href: '/admin/mentors', icon: UserGroupIcon, roles: ['admin'] },
  { name: 'Mentor Applications', href: '/admin/mentors/applications', icon: AcademicIcon, roles: ['admin'] },
  { name: 'Mentorships', href: '/admin/mentorships', icon: BriefcaseIcon, roles: ['admin'] },
  { name: 'Programmes', href: '/admin/programmes', icon: BookOpenIcon, roles: ['admin'] },
  { name: 'Courses', href: '/admin/courses', icon: BookOpenIcon, roles: ['admin'] },
  { name: 'Academic Library', href: '/admin/resources', icon: BookOpenIcon, roles: ['admin', 'publications'] },
  { name: 'Events', href: '/admin/events', icon: CalendarIcon, roles: ['admin', 'publications'] },
  { name: 'Announcements', href: '/admin/announcements', icon: BellIcon, roles: ['admin', 'publications'] },
  { name: 'Campus', href: '/admin/campus', icon: MapPinIcon, roles: ['admin'] },
  { name: 'Student Union', href: '/admin/student-union', icon: UserGroupIcon, roles: ['admin', 'publications'] },
  { name: 'Spotlights', href: '/admin/spotlights', icon: AcademicIcon, roles: ['admin', 'publications'] },
  { name: 'Clubs', href: '/admin/clubs', icon: UserGroupIcon, roles: ['admin', 'publications'] },
  { name: 'Communities', href: '/admin/communities', icon: UserGroupIcon, roles: ['admin'] },
  { name: 'Publications', href: '/admin/publications', icon: UsersIcon, roles: ['admin', 'publications'] },
  { name: 'Reports', href: '/admin/reports', icon: FlagIcon, roles: ['admin'] },
  { name: 'Feedback', href: '/admin/feedback', icon: ChatIcon, roles: ['admin'] },
  { name: 'Activity', href: '/admin/activity', icon: BellIcon, roles: ['admin'] },
  { name: 'Legal', href: '/admin/legal', icon: FlagIcon, roles: ['admin'] },
  { name: 'Diagnostics', href: '/admin/diagnostics', icon: SettingsIcon, roles: ['admin'] },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon, roles: ['admin'] },
];

function initialsFrom(fullName: string): string {
  return (
    fullName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'A'
  );
}

export function AdminLayoutShell({
  children,
  role,
  fullName,
  email,
  avatar,
}: {
  children: React.ReactNode;
  role: string;
  fullName: string;
  email: string;
  avatar: string | null;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore — we're logging out either way
    }
    // Full page reload so the layout + navbar re-fetch auth state
    window.location.href = '/auth/login';
  };

  if (pathname === '/admin/setup') {
    return <>{children}</>;
  }

  const isPublications = role === 'publications';
  const navItems = allNavItems.filter((item) =>
    item.roles.includes(role as 'admin' | 'publications')
  );

  const badgeLabel = isPublications ? 'Publications' : 'Admin';
  const initials = initialsFrom(fullName);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`bg-white border-r border-gray-200 fixed lg:relative z-50 h-full w-64 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/dfsvnaslv/image/upload/v1788726475/icon-mark-transparent_qnuzur.png"
            alt="CampusLink"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="text-lg font-semibold text-primary-green">CampusLink</span>
          <span className="text-xs bg-gray-100 px-2 py-0.5">{badgeLabel}</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-primary-green/10 text-primary-green font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 lg:hidden"
          >
            {sidebarOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3 ml-auto relative" ref={menuRef}>
            <span className="text-sm text-gray-500 hidden sm:inline">{badgeLabel}</span>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Open account menu"
              className="flex items-center rounded-full hover:bg-gray-100 p-1 transition-colors"
            >
              {avatar ? (
                <Image
                  src={avatar}
                  alt={fullName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green">
                  {initials}
                </span>
              )}
            </button>

            {menuOpen && (
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
                  href="/admin/profile"
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UsersIcon className="h-4 w-4" />
                  Profile
                </Link>

                {!isPublications && (
                  <>
                    <Link
                      href="/admin/settings"
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/admin/diagnostics"
                      role="menuitem"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      Diagnostics
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
