// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Students', href: '/admin/students', icon: UsersIcon },
  { name: 'Mentors', href: '/admin/mentors', icon: UserGroupIcon },
  { name: 'Mentor Applications', href: '/admin/mentors/applications', icon: AcademicIcon },
  { name: 'Mentorships', href: '/admin/mentorships', icon: BriefcaseIcon },
  { name: 'Programmes', href: '/admin/programmes', icon: BookOpenIcon },
  { name: 'Courses', href: '/admin/courses', icon: BookOpenIcon },
  { name: 'Resources', href: '/admin/resources', icon: BookOpenIcon },
  { name: 'Events', href: '/admin/events', icon: CalendarIcon },
  { name: 'Announcements', href: '/admin/announcements', icon: BellIcon },
  { name: 'Campus', href: '/admin/campus', icon: MapPinIcon },
  { name: 'Reports', href: '/admin/reports', icon: FlagIcon },
  { name: 'Feedback', href: '/admin/feedback', icon: ChatIcon },
  { name: 'Activity', href: '/admin/activity', icon: BellIcon },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/setup') {
    return <>{children}</>;
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

function AdminLayoutShell({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`bg-white border-r border-gray-200 fixed lg:relative z-50 h-full w-64 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <div className="h-8 w-8 border-2 border-primary-green bg-white"></div>
          <span className="text-lg font-semibold text-primary-green">CampusLink</span>
          <span className="text-xs bg-gray-100 px-2 py-0.5">Admin</span>
        </div>

        <nav className="p-3 overflow-y-auto h-[calc(100vh-8rem)]">
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Admin</span>
            <div className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green">
              A
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
