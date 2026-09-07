// app/student/dashboard/page.tsx
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UsersIcon, 
  AcademicIcon, 
  BookOpenIcon, 
  MapPinIcon, 
  CalendarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  HomeIcon
} from '@/components/icons';

// Mock data for dashboard
const mockEvents = [
  { id: '1', title: 'Orientation Week', date: '2026-09-15', location: 'Main Hall' },
  { id: '2', title: 'Career Fair', date: '2026-09-20', location: 'Student Center' },
];

const mockAnnouncements = [
  { id: '1', title: 'Library Extended Hours', content: 'The library will be open until midnight during exam period.' },
  { id: '2', title: 'Student Union Elections', content: 'Nominations are now open for Student Union positions.' },
];

const mockRecommendations = [
  { id: '1', name: 'John Banda', programme: 'Agricultural Economics', year: 3, type: 'student' },
  { id: '2', name: 'Dr. Jane Mwale', programme: 'Social Work', type: 'mentor' },
  { id: '3', title: 'Introduction to Research Methods', type: 'resource' },
  { id: '4', title: 'Career Development Workshop', type: 'event' },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="h-16 w-16 rounded-full border-2 border-primary-green bg-primary-green/10 flex items-center justify-center text-2xl font-bold text-primary-green overflow-hidden">
              {user?.avatar ? (
                <Image src={user.avatar} alt={user.fullName} width={64} height={64} className="object-cover" />
              ) : (
                user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">Good morning, {user?.fullName || 'Student'}</h1>
              <p className="text-muted-text">
                {user?.programme || 'No programme'} • Year {user?.year || '?'} 
                <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-0.5">Profile 60% complete</span>
              </p>
            </div>
            <Link 
              href="/profile" 
              className="border border-gray-200 px-4 py-2 text-sm hover:border-primary-green transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <QuickAction href="/connect" icon={UsersIcon} label="Find Students" />
          <QuickAction href="/mentors" icon={AcademicIcon} label="Find a Mentor" />
          <QuickAction href="/resources" icon={BookOpenIcon} label="Academic Resources" />
          <QuickAction href="/campus" icon={MapPinIcon} label="Explore Campus" />
          <QuickAction href="/events" icon={CalendarIcon} label="View Events" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming</h2>
              <div className="space-y-4">
                {mockEvents.map((event) => (
                  <div key={event.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-text">{event.location}</p>
                      </div>
                      <span className="text-sm text-muted-text">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended for You */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRecommendations.map((item) => (
                  <div key={item.id} className="border border-gray-100 p-4 hover:border-primary-green transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 flex-shrink-0 bg-primary-green/10 rounded-full flex items-center justify-center text-primary-green">
                        {item.type === 'student' && <UsersIcon className="h-5 w-5" />}
                        {item.type === 'mentor' && <AcademicIcon className="h-5 w-5" />}
                        {item.type === 'resource' && <BookOpenIcon className="h-5 w-5" />}
                        {item.type === 'event' && <CalendarIcon className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{item.name || item.title}</h4>
                        <p className="text-xs text-muted-text">
                          {item.programme || item.type === 'resource' ? 'Academic Resource' : ''}
                          {item.type === 'event' ? 'Upcoming Event' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Announcements */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Announcements</h2>
              <div className="space-y-3">
                {mockAnnouncements.map((ann) => (
                  <div key={ann.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <h4 className="font-medium text-sm">{ann.title}</h4>
                    <p className="text-xs text-muted-text line-clamp-2">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Where You Left Off */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Continue Where You Left Off</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <BookOpenIcon className="h-4 w-4 text-primary-green" />
                  <span className="text-sm">Case Management Notes</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-primary-green" />
                  <span className="text-sm">Library Location</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link 
      href={href} 
      className="bg-white border border-gray-200 p-4 text-center hover:border-primary-green hover:shadow-md transition-all group"
    >
      <Icon className="h-6 w-6 text-primary-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
