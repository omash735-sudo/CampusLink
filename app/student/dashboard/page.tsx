// app/student/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { announcements, events, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function StudentDashboard() {
  const user = await requireAuth();

  const recentAnnouncements = await db.select().from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(announcements.publishedAt, 'desc')
    .limit(5);

  const upcomingEvents = await db.select().from(events)
    .where(eq(events.isPublished, true))
    .orderBy(events.startDate, 'asc')
    .limit(5);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Good morning, {user.fullName}</h1>
          <p className="text-muted-text">
            {user.campus} • {user.programme} • Year {user.year}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickAction title="Find Your Cohort" href="/connect/cohorts" />
          <QuickAction title="Find a Mentor" href="/mentors" />
          <QuickAction title="Browse Resources" href="/resources" />
          <QuickAction title="View Events" href="/events" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Announcements</h2>
            <div className="space-y-4">
              {recentAnnouncements.map((ann) => (
                <div key={ann.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="font-medium">{ann.title}</div>
                  <div className="text-sm text-muted-text">{ann.content}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-text">
                    {event.location && ` ${event.location}`}
                  </div>
                  <div className="text-sm text-muted-text">
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors">
      <div className="font-medium text-primary-green">{title}</div>
    </Link>
  );
}
