// app/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { announcements, events } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { Hero } from '@/components/home/Hero';

export default async function HomePage() {
  const recentAnnouncements = await db.select().from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt))
    .limit(3);

  const upcomingEvents = await db.select().from(events)
    .where(eq(events.status, 'published'))
    .orderBy(asc(events.startDate))
    .limit(3);

  return (
    <div className="bg-white">
      <Hero />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Your Campus Community, Reimagined</h2>
            <p className="text-muted-text mt-2">Everything you need to navigate university life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link 
                key={feature.title} 
                href={feature.href} 
                className="rounded-xl border border-gray-200 p-6 hover:border-primary-green hover:bg-off-white hover:shadow-lg transition-all duration-300 group"
              >
                <feature.icon className="h-8 w-8 text-primary-green mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-text">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Announcements</h2>
            <Link href="/announcements" className="text-primary-green hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <span className="text-xs text-muted-text">
                    {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString() : ''}
                  </span>
                  <h3 className="text-lg font-semibold mt-1">{announcement.title}</h3>
                  <p className="text-muted-text text-sm mt-2 line-clamp-2">{announcement.content}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-text col-span-3 text-center py-8">No announcements yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-primary-green hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <span className="text-xs text-muted-text">
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                  <h3 className="text-lg font-semibold mt-1">{event.title}</h3>
                  {event.location && (
                    <p className="text-sm text-muted-text mt-1">📍 {event.location}</p>
                  )}
                  <p className="text-muted-text text-sm mt-2 line-clamp-2">{event.description}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-text col-span-3 text-center py-8">No upcoming events.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  { title: 'Find Your People', description: 'Connect with students in your programme and cohort.', href: '/connect', icon: UsersIcon },
  { title: 'Find a Mentor', description: 'Learn from experienced students.', href: '/mentors', icon: AcademicIcon },
  { title: 'Academic Resources', description: 'Access notes, past papers, and study materials.', href: '/resources', icon: BookIcon },
  { title: 'Discover Campus', description: 'Learn everything about LUANAR City Campus.', href: '/campus', icon: MapIcon },
];

function UsersIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>; }
function AcademicIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>; }
function BookIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>; }
function MapIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
