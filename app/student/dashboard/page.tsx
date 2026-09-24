// app/student/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { announcements, events, resources, campuslinkUsers, programmes } from '@/lib/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import SuperAccessBannerServer from '@/components/SuperAccessBannerServer';
import {
  UsersIcon,
  AcademicIcon,
  BookOpenIcon,
  MapPinIcon,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

/**
 * Greeting based on Malawi local time (UTC+2, no DST).
 * Vercel server functions run in UTC, so we shift the hour manually.
 * All CampusLink users are in Malawi, so this matches their real local time.
 */
function getGreeting(): string {
  const now = new Date();
  const malawiHour = (now.getUTCHours() + 2) % 24;

  if (malawiHour < 12) return 'Good morning';
  if (malawiHour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function StudentDashboard() {
  const user = await requireAuth();
  const greeting = getGreeting();

  const recentAnnouncements = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt))
    .limit(5);

  const upcomingEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, 'published'))
    .orderBy(asc(events.startDate))
    .limit(5);

  let programmeId: string | undefined;
  if (user.programme) {
    const programme = await db
      .select({ id: programmes.id })
      .from(programmes)
      .where(eq(programmes.name, user.programme))
      .then((res) => res[0]);
    programmeId = programme?.id;
  }

  const recommendedResources = programmeId
    ? await db
        .select()
        .from(resources)
        .where(
          and(
            eq(resources.status, 'published'),
            eq(resources.programmeId, programmeId)
          )
        )
        .orderBy(desc(resources.downloads))
        .limit(4)
    : [];

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
    .where(
      and(
        eq(campuslinkUsers.isActive, true),
        user.programme ? eq(campuslinkUsers.programme, user.programme) : undefined
      )
    )
    .limit(6);

  const isApprovedMentor =
    user.isMentor === true && user.mentorStatus === 'approved';

  const initials = user.fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <SuperAccessBannerServer as="student" />

      {/* Refined backdrop: soft green-to-white gradient wash + subtle texture */}
      <div className="min-h-screen bg-gradient-to-b from-[#f6faf7] via-off-white to-off-white relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-green/5 to-transparent"
        />

        <div className="relative container mx-auto px-4 py-8 md:py-10">
          {/* ---------- Welcome header ---------- */}
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.08)] p-6 md:p-7 mb-6">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary-green/10 blur-3xl"
            />

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="h-16 w-16 md:h-18 md:w-18 rounded-full ring-2 ring-primary-green/30 bg-primary-green/10 flex items-center justify-center text-2xl font-bold text-primary-green overflow-hidden flex-shrink-0">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.fullName}
                    width={72}
                    height={72}
                    className="object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium tracking-wide uppercase text-primary-green/80">
                  Student Dashboard
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-primary-text mt-1">
                  {greeting}, {user.fullName.split(' ')[0]}
                </h1>
                <p className="text-sm text-muted-text mt-1">
                  {user.programme || 'No programme'}
                  {user.year ? ` • Year ${user.year}` : ''}
                </p>
              </div>

              <Link
                href="/profile"
                className="border border-gray-200 bg-white/60 hover:bg-white hover:border-primary-green px-4 py-2 text-sm font-medium transition-colors flex-shrink-0"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* ---------- Mentor Mode banner ---------- */}
          {isApprovedMentor && (
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/80 to-white/60 backdrop-blur-md border border-blue-200/80 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 md:p-6 mb-6">
              <div
                aria-hidden="true"
                className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl"
              />

              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <AcademicIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-primary-text">
                      Mentor Mode
                    </h2>
                    <p className="text-sm text-muted-text mt-0.5 max-w-xl">
                      You&apos;re an approved CampusLink mentor. Switch to your
                      mentor dashboard to manage requests, mentees and your
                      mentor profile.
                    </p>
                  </div>
                </div>
                <Link
                  href="/mentor"
                  className="bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  Open Mentor Dashboard →
                </Link>
              </div>
            </div>
          )}

          {/* ---------- Quick actions ---------- */}
          <div className="mb-6">
            <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-text mb-3 px-1">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <QuickAction href="/connect" icon={UsersIcon} label="Find Students" subtitle="Connect with peers" />
              <QuickAction href="/mentors" icon={AcademicIcon} label="Find a Mentor" subtitle="Get guidance" />
              <QuickAction href="/resources" icon={BookOpenIcon} label="Academic Resources" subtitle="Notes & past papers" />
              <QuickAction href="/campus" icon={MapPinIcon} label="Explore Campus" subtitle="Places & facilities" />
            </div>
          </div>

          {/* ---------- Main grid ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <DashboardCard
                title="Announcements"
                href="/announcements"
                hrefLabel="View all"
                isEmpty={recentAnnouncements.length === 0}
                emptyText="No announcements yet."
              >
                {recentAnnouncements.map((ann, i) => (
                  <div
                    key={ann.id}
                    className={`group -mx-2 px-2 py-3.5 hover:bg-gray-50/70 transition-colors ${
                      i !== recentAnnouncements.length - 1
                        ? 'border-b border-gray-100/80'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-[15px] text-primary-text group-hover:text-primary-green transition-colors">
                          {ann.title}
                        </h3>
                        <p className="text-sm text-muted-text line-clamp-1 mt-0.5">
                          {ann.content}
                        </p>
                      </div>
                      <span className="text-xs text-muted-text whitespace-nowrap flex-shrink-0 mt-1">
                        {ann.publishedAt
                          ? new Date(ann.publishedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </DashboardCard>

              <DashboardCard
                title="Upcoming Events"
                href="/events"
                hrefLabel="View all"
                isEmpty={upcomingEvents.length === 0}
                emptyText="No upcoming events."
              >
                {upcomingEvents.map((event, i) => (
                  <div
                    key={event.id}
                    className={`group -mx-2 px-2 py-3.5 hover:bg-gray-50/70 transition-colors ${
                      i !== upcomingEvents.length - 1
                        ? 'border-b border-gray-100/80'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-[15px] text-primary-text group-hover:text-primary-green transition-colors">
                          {event.title}
                        </h3>
                        {event.location && (
                          <p className="text-sm text-muted-text mt-0.5 truncate">
                            {event.location}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-text whitespace-nowrap flex-shrink-0 mt-1">
                        {new Date(event.startDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </DashboardCard>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {cohortStudents.length > 0 && (
                <DashboardCard
                  title="Your Cohort"
                  href="/connect"
                  hrefLabel="View all"
                >
                  <div className="space-y-1">
                    {cohortStudents.map((student) => (
                      <Link
                        key={student.id}
                        href={`/profile/${student.username}`}
                        className="flex items-center gap-3 -mx-2 px-2 py-2.5 hover:bg-gray-50/70 transition-colors"
                      >
                        <div className="h-9 w-9 rounded-full bg-primary-green/10 flex items-center justify-center text-xs font-semibold text-primary-green flex-shrink-0">
                          {student.fullName
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary-text truncate">
                            {student.fullName}
                          </p>
                          <p className="text-xs text-muted-text truncate">
                            {student.programme}
                            {student.year ? ` • Year ${student.year}` : ''}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </DashboardCard>
              )}

              {recommendedResources.length > 0 && (
                <DashboardCard
                  title="Recommended Resources"
                  href="/resources"
                  hrefLabel="Browse all"
                >
                  <div className="space-y-1">
                    {recommendedResources.map((resource) => (
                      <Link
                        key={resource.id}
                        href={`/resources/${resource.id}`}
                        className="group block -mx-2 px-2 py-3 hover:bg-gray-50/70 transition-colors"
                      >
                        <p className="font-medium text-sm text-primary-text group-hover:text-primary-green transition-colors line-clamp-2">
                          {resource.title}
                        </p>
                        {resource.subject && (
                          <p className="text-xs text-muted-text mt-0.5 truncate">
                            {resource.subject}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </DashboardCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared card shell — consistent across every section               */
/* ------------------------------------------------------------------ */

function DashboardCard({
  title,
  href,
  hrefLabel,
  isEmpty,
  emptyText,
  children,
}: {
  title: string;
  href: string;
  hrefLabel: string;
  isEmpty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white/70 backdrop-blur-md border border-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-bold text-primary-text">
          {title}
        </h2>
        <Link
          href={href}
          className="text-xs md:text-sm font-medium text-primary-green hover:underline"
        >
          {hrefLabel} →
        </Link>
      </div>

      {isEmpty ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-text">{emptyText}</p>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick action card                                                 */
/* ------------------------------------------------------------------ */

function QuickAction({
  href,
  icon: Icon,
  label,
  subtitle,
}: {
  href: string;
  icon: any;
  label: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white/70 backdrop-blur-md border border-gray-200/70 p-4 md:p-5 hover:border-primary-green/60 hover:bg-white hover:shadow-[0_4px_16px_-8px_rgba(23,107,58,0.25)] transition-all"
    >
      <div className="flex flex-col items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-green/15 transition-colors">
          <Icon className="h-5 w-5 text-primary-green group-hover:scale-110 transition-transform" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary-text leading-tight">
            {label}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-text mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
