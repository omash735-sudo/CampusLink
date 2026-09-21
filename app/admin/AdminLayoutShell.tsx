// app/admin/AdminLayoutShell.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  { name: 'Publications', href: '/admin/publications', icon: UsersIcon, roles: ['admin'] },
  { name: 'Reports', href: '/admin/reports', icon: FlagIcon, roles: ['admin'] },
  { name: 'Feedback', href: '/admin/feedback', icon: ChatIcon, roles: ['admin'] },
  { name: 'Activity', href: '/admin/activity', icon: BellIcon, roles: ['admin'] },
  { name: 'Legal', href: '/admin/legal', icon: FlagIcon, roles: ['admin'] },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon, roles: ['admin'] },
];

export function AdminLayoutShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'super_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/auth/login');
    router.refresh();
  };

  if (pathname === '/admin/setup') {
    return <>{children}</>;
  }

  const isPublications = role === 'publications';
  const navItems = allNavItems.filter((item) =>
    item.roles.includes(role as 'admin' | 'publications')
  );

  const badgeLabel = isPublications ? 'Publications' : 'Admin';
  const avatarLetter = isPublications ? 'P' : 'A';

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

        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign Out
          </button>
        </div>
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
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-gray-500">{badgeLabel}</span>
            <div className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green">
              {avatarLetter}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
