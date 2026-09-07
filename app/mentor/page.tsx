// app/mentor/page.tsx
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UsersIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  BellIcon,
  CheckIcon,
  XIcon
} from '@/components/icons';

const mockStats = {
  activeMentees: 4,
  pendingRequests: 3,
  upcomingSessions: 2,
  profileCompletion: 75
};

const mockPendingRequests = [
  {
    id: '1',
    student: 'Jane Mwale',
    programme: 'Social Work & Youth Development',
    year: 2,
    topic: 'Academic Support',
    message: 'I need help with my research methods course.',
    date: '2026-09-05',
    avatar: null
  },
  {
    id: '2',
    student: 'John Banda',
    programme: 'Agricultural Economics',
    year: 3,
    topic: 'Career Guidance',
    message: 'I want to explore career options in agribusiness.',
    date: '2026-09-04',
    avatar: null
  },
  {
    id: '3',
    student: 'Sarah Phiri',
    programme: 'Food Science',
    year: 1,
    topic: 'University Life',
    message: 'I need help adjusting to university life.',
    date: '2026-09-03',
    avatar: null
  }
];

const mockUpcomingSessions = [
  {
    id: '1',
    student: 'Jane Mwale',
    topic: 'Academic Support',
    date: '2026-09-07',
    time: '14:00',
    status: 'upcoming'
  },
  {
    id: '2',
    student: 'John Banda',
    topic: 'Career Guidance',
    date: '2026-09-08',
    time: '10:00',
    status: 'upcoming'
  }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'accepted',
    description: 'Accepted mentorship request from Jane Mwale',
    time: '2 hours ago'
  },
  {
    id: '2',
    type: 'session',
    description: 'Completed session with John Banda',
    time: '5 hours ago'
  },
  {
    id: '3',
    type: 'resource',
    description: 'Shared research methods resource with Sarah Phiri',
    time: '1 day ago'
  }
];

export default async function MentorDashboard() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Good morning, {user?.fullName || 'Mentor'}</h1>
            <p className="text-muted-text">Here's what's happening with your mentorships.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Link href="/mentor/notifications" className="relative p-2 border border-gray-200 hover:border-primary-green transition-colors">
              <BellIcon className="h-5 w-5 text-muted-text" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                3
              </span>
            </Link>
            <div className="h-10 w-10 rounded-full border-2 border-primary-green bg-primary-green/10 flex items-center justify-center font-semibold text-primary-green overflow-hidden">
              {user?.avatar ? (
                <Image src={user.avatar} alt={user.fullName} width={40} height={40} className="object-cover" />
              ) : (
                user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/mentor/mentees" className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="text-2xl font-bold text-primary-green">{mockStats.activeMentees}</div>
            <div className="text-sm text-muted-text">Active Mentees</div>
          </Link>
          <Link href="/mentor/requests" className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="text-2xl font-bold text-orange-500">{mockStats.pendingRequests}</div>
            <div className="text-sm text-muted-text">Pending Requests</div>
          </Link>
          <Link href="/mentor/schedule" className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="text-2xl font-bold text-blue-500">{mockStats.upcomingSessions}</div>
            <div className="text-sm text-muted-text">Upcoming Sessions</div>
          </Link>
          <Link href="/mentor/profile" className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="text-2xl font-bold text-green-500">{mockStats.profileCompletion}%</div>
            <div className="text-sm text-muted-text">Profile Completion</div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickAction href="/mentor/requests" label="Review Requests" icon={CheckIcon} color="primary" />
          <QuickAction href="/mentor/mentees" label="View Mentees" icon={UsersIcon} color="primary" />
          <QuickAction href="/mentor/schedule" label="Manage Availability" icon={CalendarIcon} color="primary" />
          <QuickAction href="/mentor/profile" label="Edit Mentor Profile" icon={UserGroupIcon} color="secondary" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Pending Requests</h2>
                <Link href="/mentor/requests" className="text-sm text-primary-green hover:underline">
                  View all →
                </Link>
              </div>
              {mockPendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {mockPendingRequests.map((request) => (
                    <div key={request.id} className="border border-gray-100 p-4 hover:border-primary-green transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                            {request.student.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold">{request.student}</h4>
                            <p className="text-sm text-muted-text">{request.programme} • Year {request.year}</p>
                            <p className="text-sm text-muted-text mt-1">Topic: {request.topic}</p>
                            <p className="text-xs text-muted-text mt-1">{new Date(request.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="bg-green-600 text-white px-3 py-1 text-sm hover:bg-green-700 transition-colors">
                            Accept
                          </button>
                          <button className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 transition-colors">
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-text">No pending mentorship requests.</p>
              )}
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upcoming Sessions</h2>
                <Link href="/mentor/schedule" className="text-sm text-primary-green hover:underline">
                  View schedule →
                </Link>
              </div>
              {mockUpcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {mockUpcomingSessions.map((session) => (
                    <div key={session.id} className="border border-gray-100 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{session.student}</h4>
                          <p className="text-sm text-muted-text">{session.topic}</p>
                          <p className="text-xs text-muted-text mt-1">
                            {new Date(session.date).toLocaleDateString()} at {session.time}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">Upcoming</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-text">No upcoming sessions.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-text">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-text">Mentorship since</span>
                  <span>September 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Total mentees</span>
                  <span>7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Sessions completed</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Rating</span>
                  <span>⭐ 4.8 (15 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, label, icon: Icon, color }: { href: string; label: string; icon: any; color: string }) {
  return (
    <Link 
      href={href} 
      className={`border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group ${
        color === 'primary' ? 'hover:bg-primary-green/5' : 'hover:bg-gray-50'
      }`}
    >
      <Icon className="h-6 w-6 text-primary-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
