// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { announcements, events, clubs } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { Hero } from '@/components/home/Hero';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { StudentUnion } from '@/components/home/StudentUnion';
import { StudentSpotlight } from '@/components/home/StudentSpotlight';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const recentAnnouncements = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt))
    .limit(3);

  const upcomingEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, 'published'))
    .orderBy(asc(events.startDate))
    .limit(3);

  const featuredClubs = await db
    .select()
    .from(clubs)
    .where(eq(clubs.isActive, true))
    .orderBy(desc(clubs.isFeatured), asc(clubs.sortOrder))
    .limit(3);

  return (
    <div className="bg-white">
      <Hero />

      <FeatureGrid />

      <StudentUnion />

      <StudentSpotlight />

      {/* ---------- Featured clubs ---------- */}
      {featuredClubs.length > 0 && (
        <section className="py-16 md:py-20 bg-off-white relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-primary-green/80 mb-2">
                  Clubs
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-text">
                  Interested in Joining Campus Clubs?
                </h2>
                <p className="text-muted-text mt-2">
                  Find a community that matches your interests.
                </p>
              </div>
              <Link
                href="/clubs"
                className="text-primary-green hover:underline text-sm font-medium whitespace-nowrap"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {featuredClubs.map((club) => (
                <Link
                  key={club.id}
                  href="/clubs"
                  className="group bg-white/70 backdrop-blur-md border border-gray-200/70 p-6 flex flex-col hover:border-primary-green/60 hover:bg-white hover:shadow-[0_4px_20px_-12px_rgba(23,107,58,0.25)] transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {club.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="h-14 w-14 object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-primary-green/10 flex items-center justify-center text-primary-green font-bold flex-shrink-0">
                        {club.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-primary-text truncate group-hover:text-primary-green transition-colors">
                        {club.name}
                      </h3>
                      {club.category && (
                        <p className="text-xs text-primary-green mt-0.5 truncate">
                          {club.category}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-text line-clamp-3 leading-relaxed">
                    {club.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/clubs/register"
                className="border-2 border-primary-green text-primary-green px-6 py-3 font-medium hover:bg-primary-green hover:text-white transition-colors inline-block"
              >
                Register Your Club
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Announcements ---------- */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-primary-green/80 mb-2">
                News
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-text">
                Latest Announcements
              </h2>
            </div>
            <Link
              href="/announcements"
              className="text-primary-green hover:underline text-sm font-medium whitespace-nowrap"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="group bg-white border border-gray-200 overflow-hidden hover:border-primary-green/60 hover:shadow-[0_8px_24px_-16px_rgba(16,24,40,0.15)] transition-all"
                >
                  {announcement.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={announcement.imageUrl}
                        alt={announcement.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs text-muted-text">
                        {announcement.publishedAt
                          ? new Date(announcement.publishedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                      {announcement.priority === 'urgent' && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">
                          Urgent
                        </span>
                      )}
                      {announcement.priority === 'high' && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5">
                          High
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-primary-text mt-1 group-hover:text-primary-green transition-colors line-clamp-2">
                      {announcement.title}
                    </h3>
                    <p className="text-muted-text text-sm mt-2 line-clamp-2 leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border border-dashed border-gray-200 bg-off-white/50">
                <p className="text-muted-text text-sm">No announcements yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Events ---------- */}
      <section className="py-16 md:py-20 bg-off-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-wide uppercase text-primary-green/80 mb-2">
                What&apos;s On
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-text">
                Upcoming Events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-primary-green hover:underline text-sm font-medium whitespace-nowrap"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white border border-gray-200 overflow-hidden hover:border-primary-green/60 hover:shadow-[0_8px_24px_-16px_rgba(16,24,40,0.15)] transition-all"
                >
                  {event.image && (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs text-muted-text">
                        {new Date(event.startDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">
                        Verified
                      </span>
                      {event.category && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 capitalize">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-primary-text mt-1 group-hover:text-primary-green transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-sm text-muted-text mt-1.5 truncate">
                        {event.location}
                      </p>
                    )}
                    <p className="text-muted-text text-sm mt-2 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                    {event.organizer && (
                      <p className="text-xs text-muted-text mt-3 pt-3 border-t border-gray-100">
                        Organized by {event.organizer}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border border-dashed border-gray-200 bg-white/50">
                <p className="text-muted-text text-sm">No upcoming events.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
