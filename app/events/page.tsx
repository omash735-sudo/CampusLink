// app/events/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export default async function EventsPage() {
  const allEvents = await db.select().from(events)
    .where(eq(events.status, 'published'))
    .orderBy(asc(events.startDate));

  return (
    <div className="min-h-screen bg-off-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-primary-green hover:underline text-sm inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-4">Upcoming Events</h1>
          <p className="text-muted-text mt-2">Discover events happening at LUANAR City Campus</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allEvents.length > 0 ? (
            allEvents.map((event) => (
              <div 
                key={event.id} 
                className="border border-gray-200 bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {event.imageUrl && (
                  <div className="relative h-56 w-full">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-muted-text">
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    {event.isVerified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">Verified</span>
                    )}
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 capitalize">
                      {event.eventType}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mt-1">{event.title}</h2>
                  {event.location && (
                    <p className="text-sm text-muted-text mt-1">{event.location}</p>
                  )}
                  <p className="text-muted-text text-sm mt-3 leading-relaxed">{event.description}</p>
                  {event.organizer && (
                    <p className="text-xs text-muted-text mt-2">Organized by: {event.organizer}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-muted-text">No upcoming events.</p>
              <p className="text-sm text-muted-text mt-2">Check back later for events.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
