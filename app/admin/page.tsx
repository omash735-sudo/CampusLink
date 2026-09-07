// app/admin/page.tsx
import Link from 'next/link';
import { 
  UsersIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  BellIcon,
  FlagIcon,
  PlusIcon,
  AcademicIcon,
  BriefcaseIcon,
  MapPinIcon
} from '@/components/icons';

// Demo data clearly labeled
const DEMO_STATS = {
  totalStudents: 156,
  activeStudents: 142,
  totalMentors: 12,
  pendingMentorApplications: 5,
  activeMentorships: 8,
  totalResources: 67,
  pendingResources: 3,
  upcomingEvents: 4,
  publishedAnnouncements: 9,
  unresolvedReports: 2,
};

const DEMO_ACTIVITY = [
  { id: '1', action: 'New mentor application submitted', time: '2 minutes ago', type: 'application' },
  { id: '2', action: 'New resource awaiting approval', time: '15 minutes ago', type: 'resource' },
  { id: '3', action: 'Announcement published', time: '1 hour ago', type: 'announcement' },
  { id: '4', action: 'Campus location updated', time: '2 hours ago', type: 'campus' },
  { id: '5', action: 'Student account activated', time: '3 hours ago', type: 'user' },
];

const DEMO_QUICK_ACTIONS = [
  { name: 'Add Announcement', href: '/admin/announcements/new', icon: BellIcon },
  { name: 'Add Event', href: '/admin/events/new', icon: CalendarIcon },
  { name: 'Add Campus Location', href: '/admin/campus/locations/new', icon: MapPinIcon },
  { name: 'Add Resource', href: '/admin/resources/new', icon: BookOpenIcon },
  { name: 'Review Applications', href: '/admin/mentors/applications', icon: UserGroupIcon },
  { name: 'Manage Users', href: '/admin/students', icon: UsersIcon },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, Administrator</p>
        </div>
        <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-200">
          Demo Data – Replace with real information
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard title="Students" value={DEMO_STATS.totalStudents} icon={UsersIcon} href="/admin/students" />
        <StatCard title="Active" value={DEMO_STATS.activeStudents} icon={UsersIcon} href="/admin/students" />
        <StatCard title="Mentors" value={DEMO_STATS.totalMentors} icon={UserGroupIcon} href="/admin/mentors" />
        <StatCard title="Applications" value={DEMO_STATS.pendingMentorApplications} icon={AcademicIcon} href="/admin/mentors/applications" />
        <StatCard title="Resources" value={DEMO_STATS.totalResources} icon={BookOpenIcon} href="/admin/resources" />
        <StatCard title="Reports" value={DEMO_STATS.unresolvedReports} icon={FlagIcon} href="/admin/reports" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEMO_QUICK_ACTIONS.map((action) => (
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

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {DEMO_ACTIVITY.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 ${
                  activity.type === 'application' ? 'bg-yellow-100 text-yellow-700' :
                  activity.type === 'resource' ? 'bg-blue-100 text-blue-700' :
                  activity.type === 'announcement' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type}
                </span>
                <span className="text-sm">{activity.action}</span>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
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
      <span className="text-[10px] text-gray-400">demo data</span>
    </Link>
  );
}
