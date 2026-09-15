// app/events/page.tsx
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, asc, and, or, ilike } from 'drizzle-orm';
import Link from 'next/link';
import { CalendarIcon, LocationIcon } from '@/components/icons';
import { EventFilters } from '@/components/events/EventFilters';

export const dynamic = 'force-dynamic';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const search = searchParams.search?.trim() || '';
  const category = searchParams.category?.trim() || '';

  const conditions: any[] = [eq(events.status, 'published')];

  if (search) {
    conditions.push(
      or(
        ilike(events.title, `%${search}%`),
        ilike(events.description, `%${search}%`),
        ilike(events.location, `%${search}%`)
      )!
    );
  }

  if (category) {
    conditions.push(eq(events.category, category));
  }

  const eventsList = await db
    .select()
    .from(events)
    .where(and(...conditions))
    .orderBy(asc(events.startDate));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Events</h1>

        <div className="bg-white border border-gray-200 p-6 mb-8">
          <EventFilters />
        </div>

        {eventsList.length === 0 ? (
          <div className="border border-gray-200 bg-white p-8 text-center">
            <p className="text-muted-text">
              {search || category
                ? 'No events match your filters.'
                : 'No upcoming events.'}
            </p>
            {(search || category) && (
              <Link
                href="/events"
                className="text-primary-green hover:underline text-sm mt-3 inline-block"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsList.map((event) => {
              const startTime = event.startDate
                ? new Date(event.startDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="border border-gray-200 bg-white hover:border-primary-green transition-colors p-6 h-full">
                    <div className="flex items-start justify-between">
                      {event.category && (
                        <span className="text-xs bg-primary-green/10 text-primary-green px-3 py-1">
                          {event.category}
                        </span>
                      )}
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 ml-auto">
                        Upcoming
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mt-3">{event.title}</h3>
                    <p className="text-sm text-muted-text mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-3 space-y-1 text-sm text-muted-text">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString()} at{' '}
                        {startTime}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <LocationIcon className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
