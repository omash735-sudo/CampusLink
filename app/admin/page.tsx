// app/admin/page.tsx
import { getDashboardStats } from '@/lib/services/admin.service';
import Link from 'next/link';
import { 
  UsersIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  BellIcon,
  FlagIcon,
  AcademicIcon,
  BriefcaseIcon,
  MapPinIcon
} from '@/components/icons';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const quickActions = [
    { name: 'Add Announcement', href: '/admin/announcements/new', icon: BellIcon },
    { name: 'Add Event', href: '/admin/events/new', icon: CalendarIcon },
    { name: 'Add Campus Location', href: '/admin/campus/locations/new', icon: MapPinIcon },
    { name: 'Add Resource', href: '/admin/resources/new', icon: BookOpenIcon },
    { name: 'Review Applications', href: '/admin/mentors/applications', icon: UserGroupIcon },
    { name: 'Manage Users', href: '/admin/students', icon: UsersIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, Administrator</p>
        </div>
        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 border border-green-200">
          Live Data
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard title="Students" value={stats.users.total} icon={UsersIcon} href="/admin/students" />
        <StatCard title="Active" value={stats.users.active} icon={UsersIcon} href="/admin/students" />
        <StatCard title="Mentors" value={stats.users.mentors} icon={UserGroupIcon} href="/admin/mentors" />
        <StatCard title="Applications" value={stats.users.pendingMentors} icon={AcademicIcon} href="/admin/mentors/applications" />
        <StatCard title="Resources" value={stats.resources.total} icon={BookOpenIcon} href="/admin/resources" />
        <StatCard title="Reports" value={stats.reports} icon={FlagIcon} href="/admin/reports" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="bg-white border border-gray-200 p-4 text-center hover:border-primary-green transition-colors group"
          >
            <action.icon className="h-5 w-5 text-primary-green mx-auto mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">{action.name}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Events" value={stats.events} icon={CalendarIcon} href="/admin/events" />
        <StatCard title="Announcements" value={stats.announcements} icon={BellIcon} href="/admin/announcements" />
        <StatCard title="Mentorships" value={stats.mentorships.active} icon={BriefcaseIcon} href="/admin/mentorships" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, href }: { title: string; value: number; icon: any; href: string }) {
  return (
    <Link href={href} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-green" />
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </Link>
  );
}
