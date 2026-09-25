// app/events/page.tsx
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, asc, and, or, ilike } from 'drizzle-orm';
import Link from 'next/link';
import { CalendarIcon, LocationIcon } from '@/components/icons';
import { EventFilters } from '@/components/events/EventFilters';
import { PosterImage } from '@/components/PosterImage';

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
      <div className="container mx-auto px-4 max-w-3xl">
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
          <div className="space-y-8">
            {eventsList.map((event) => {
              const startTime = event.startDate
                ? new Date(event.startDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block bg-white border border-gray-200 hover:border-primary-green transition-colors"
                >
                  {/* Poster first — full graphic visible, uncropped. */}
                  {event.image && (
                    <PosterImage
                      src={event.image}
                      alt={event.title}
                      variant="card"
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      {event.category && (
                        <span className="text-xs bg-primary-green/10 text-primary-green px-3 py-1">
                          {event.category}
                        </span>
                      )}
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 ml-auto">
                        Upcoming
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold mt-3">
                      {event.title}
                    </h2>

                    {event.description && (
                      <p className="text-sm text-muted-text mt-2">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-4 space-y-1 text-sm text-muted-text">
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
