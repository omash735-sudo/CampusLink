// app/events/page.tsx
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import Link from 'next/link';
import { CalendarIcon, LocationIcon } from '@/components/icons';

export default async function EventsPage() {
  const eventsList = await db
    .select()
    .from(events)
    .where(eq(events.status, 'published'))
    .orderBy(asc(events.startDate));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Events</h1>

        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 min-w-[200px] border border-gray-300 bg-white px-4 py-2 focus:border-primary-green focus:outline-none"
            />
            <select className="border border-gray-300 bg-white px-4 py-2 focus:border-primary-green focus:outline-none">
              <option value="">All Categories</option>
              <option value="Orientation">Orientation</option>
              <option value="Career">Career</option>
              <option value="Academic">Academic</option>
              <option value="Social">Social</option>
            </select>
            <button className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsList.map((event) => {
            // Format time from startDate
            const startTime = event.startDate ? new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            
            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="border border-gray-200 bg-white hover:border-primary-green transition-colors p-6 h-full">
                  <div className="flex items-start justify-between">
                    <span className="text-xs bg-primary-green/10 text-primary-green px-3 py-1">
                      {event.category}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">Upcoming</span>
                  </div>
                  <h3 className="text-lg font-semibold mt-3">{event.title}</h3>
                  <p className="text-sm text-muted-text mt-1 line-clamp-2">{event.description}</p>
                  <div className="mt-3 space-y-1 text-sm text-muted-text">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(event.startDate).toLocaleDateString()} at {startTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {eventsList.length === 0 && (
          <div className="border border-gray-200 bg-white p-8 text-center">
            <p className="text-muted-text">No upcoming events.</p>
          </div>
        )}
      </div>
    </div>
  );
}
