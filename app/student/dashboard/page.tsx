// app/student/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { announcements, events, resources, campuslinkUsers, programmes } from '@/lib/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UsersIcon, 
  AcademicIcon, 
  BookOpenIcon, 
  MapPinIcon, 
  CalendarIcon,
  UserGroupIcon
} from '@/components/icons';

export default async function StudentDashboard() {
  const user = await requireAuth();
  
  // Get announcements
  const recentAnnouncements = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt))
    .limit(5);
  
  // Get upcoming events
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, 'published'))
    .orderBy(asc(events.startDate))
    .limit(5);
  
  // Get programme ID for user's programme
  let programmeId: string | undefined;
  if (user.programme) {
    const programme = await db
      .select({ id: programmes.id })
      .from(programmes)
      .where(eq(programmes.name, user.programme))
      .then(res => res[0]);
    programmeId = programme?.id;
  }
  
  // Get recommended resources based on user's programme
  const recommendedResources = programmeId
    ? await db
        .select()
        .from(resources)
        .where(and(
          eq(resources.status, 'approved'),
          eq(resources.programmeId, programmeId)
        ))
        .orderBy(desc(resources.downloads))
        .limit(4)
    : [];
  
  // Get students from same programme
  const cohortStudents = await db
    .select({
      id: campuslinkUsers.id,
      fullName: campuslinkUsers.fullName,
      username: campuslinkUsers.username,
      avatar: campuslinkUsers.avatar,
      programme: campuslinkUsers.programme,
      year: campuslinkUsers.year,
    })
    .from(campuslinkUsers)
    .where(and(
      eq(campuslinkUsers.isActive, true),
      user.programme ? eq(campuslinkUsers.programme, user.programme) : undefined
    ))
    .limit(6);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="h-16 w-16 rounded-full border-2 border-primary-green bg-primary-green/10 flex items-center justify-center text-2xl font-bold text-primary-green overflow-hidden">
              {user.avatar ? (
                <Image src={user.avatar} alt={user.fullName} width={64} height={64} className="object-cover" />
              ) : (
                user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">Good morning, {user.fullName}</h1>
              <p className="text-muted-text">
                {user.programme || 'No programme'} • Year {user.year || '?'}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickAction href="/connect" icon={UsersIcon} label="Find Students" />
          <QuickAction href="/mentors" icon={AcademicIcon} label="Find a Mentor" />
          <QuickAction href="/resources" icon={BookOpenIcon} label="Academic Resources" />
          <QuickAction href="/campus" icon={MapPinIcon} label="Explore Campus" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Announcements */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Announcements</h2>
                <Link href="/announcements" className="text-primary-green hover:underline text-sm">
                  View all →
                </Link>
              </div>
              {recentAnnouncements.length > 0 ? (
                <div className="space-y-3">
                  {recentAnnouncements.map((ann) => (
                    <div key={ann.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{ann.title}</h3>
                          <p className="text-sm text-muted-text line-clamp-1">{ann.content}</p>
                        </div>
                        <span className="text-xs text-muted-text">
                          {ann.publishedAt ? new Date(ann.publishedAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-text">No announcements yet.</p>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upcoming Events</h2>
                <Link href="/events" className="text-primary-green hover:underline text-sm">
                  View all →
                </Link>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-text">{event.location}</p>
                        </div>
                        <span className="text-xs text-muted-text">
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-text">No upcoming events.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Your Cohort */}
            {cohortStudents.length > 0 && (
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4">Your Cohort</h2>
                <div className="space-y-3">
                  {cohortStudents.map((student) => (
                    <Link key={student.id} href={`/profile/${student.username}`} className="flex items-center gap-3 hover:text-primary-green transition-colors">
                      <div className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-xs font-semibold text-primary-green">
                        {student.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{student.fullName}</p>
                        <p className="text-xs text-muted-text">{student.programme} • Year {student.year}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/connect" className="text-sm text-primary-green hover:underline mt-3 inline-block">
                  View all →
                </Link>
              </div>
            )}

            {/* Recommended Resources */}
            {recommendedResources.length > 0 && (
              <div className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4">Recommended Resources</h2>
                <div className="space-y-3">
                  {recommendedResources.map((resource) => (
                    <Link key={resource.id} href={`/resources/${resource.id}`} className="block hover:text-primary-green transition-colors">
                      <p className="font-medium text-sm">{resource.title}</p>
                      <p className="text-xs text-muted-text">{resource.course}</p>
                    </Link>
                  ))}
                </div>
                <Link href="/resources" className="text-sm text-primary-green hover:underline mt-3 inline-block">
                  Browse all →
                </Link>
              </div>
            )}
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
