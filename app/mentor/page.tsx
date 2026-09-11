// app/mentor/page.tsx
import { db } from '@/lib/db';
import {
  mentorshipRequests,
  mentorships,
  campuslinkUsers,
  mentors,
} from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import SuperAccessBannerServer from '@/components/SuperAccessBannerServer';
import {
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  BellIcon,
} from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function MentorDashboard() {
  // TEMP: fake user for visual testing. Auth disabled.
  const user = {
    id: '4b93eb7d-f26f-4aaa-95fe-ae7abea695eb',   // admin's real UUID
    email: 'mentor@test.com',
    fullName: 'Test Mentor',
    username: 'testmentor',
    role: 'mentor',
    avatar: null as string | null,
    isMentor: true,
    mentorStatus: 'approved',
  };

  const mentor = await db
    .select()
    .from(mentors)
    .where(eq(mentors.userId, user.id))
    .then((res) => res[0]);

  if (!mentor) {
    return (
      <>
        <SuperAccessBannerServer as="mentor" />
        <div className="min-h-screen bg-off-white py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white border border-gray-200 p-8 max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-2">No Mentor Profile</h1>
              <p className="text-muted-text mb-4">
                This is what an admin sees when using Super Access to view the
                mentor dashboard without an actual mentor profile.
              </p>
              <p className="text-sm text-muted-text">
                When a real mentor logs in, they will see their requests and
                mentees here.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const pendingRequests = await db
    .select({
      id: mentorshipRequests.id,
      message: mentorshipRequests.message,
      createdAt: mentorshipRequests.createdAt,
      student: {
        fullName: campuslinkUsers.fullName,
        username: campuslinkUsers.username,
        programme: campuslinkUsers.programme,
        year: campuslinkUsers.year,
        avatar: campuslinkUsers.avatar,
      },
    })
    .from(mentorshipRequests)
    .leftJoin(campuslinkUsers, eq(mentorshipRequests.studentId, campuslinkUsers.id))
    .where(
      and(
        eq(mentorshipRequests.mentorId, mentor.id),
        eq(mentorshipRequests.status, 'pending')
      )
    )
    .orderBy(desc(mentorshipRequests.createdAt))
    .limit(5);

  const activeMentorships = await db
    .select({
      id: mentorships.id,
      startedAt: mentorships.startedAt,
      student: {
        fullName: campuslinkUsers.fullName,
        username: campuslinkUsers.username,
        programme: campuslinkUsers.programme,
        year: campuslinkUsers.year,
        avatar: campuslinkUsers.avatar,
      },
    })
    .from(mentorships)
    .leftJoin(campuslinkUsers, eq(mentorships.studentId, campuslinkUsers.id))
    .where(
      and(
        eq(mentorships.mentorId, mentor.id),
        eq(mentorships.status, 'active')
      )
    )
    .orderBy(desc(mentorships.startedAt))
    .limit(5);

  return (
    <>
      <SuperAccessBannerServer as="mentor" />
      <div className="min-h-screen bg-off-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mentor Dashboard</h1>
              <p className="text-muted-text">Welcome back, {user.fullName}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/mentor/notifications"
                className="relative p-2 border border-gray-200 hover:border-primary-green transition-colors"
              >
                <BellIcon className="h-5 w-5 text-muted-text" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                  {pendingRequests.length}
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link
              href="/mentor/requests"
              className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors"
            >
              <div className="text-2xl font-bold text-primary-green">
                {pendingRequests.length}
              </div>
              <div className="text-sm text-muted-text">Pending Requests</div>
            </Link>
            <Link
              href="/mentor/mentees"
              className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors"
            >
              <div className="text-2xl font-bold text-primary-green">
                {activeMentorships.length}
              </div>
              <div className="text-sm text-muted-text">Active Mentees</div>
            </Link>
            <Link
              href="/mentor/mentees"
              className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors"
            >
              <div className="text-2xl font-bold text-primary-green">
                {mentor?.rating || 0}
              </div>
              <div className="text-sm text-muted-text">Rating</div>
            </Link>
            <Link
              href="/mentor/profile"
              className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors"
            >
              <div className="text-2xl font-bold text-primary-green">
                {mentor?.reviewCount || 0}
              </div>
              <div className="text-sm text-muted-text">Reviews</div>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <QuickAction href="/mentor/requests" label="Review Requests" icon={UserGroupIcon} />
            <QuickAction href="/mentor/mentees" label="View Mentees" icon={UsersIcon} />
            <QuickAction href="/mentor/schedule" label="Manage Availability" icon={CalendarIcon} />
            <QuickAction href="/mentor/profile" label="Edit Profile" icon={UserGroupIcon} />
          </div>

          <div className="bg-white border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pending Requests</h2>
              <Link
                href="/mentor/requests"
                className="text-sm text-primary-green hover:underline"
              >
                View all →
              </Link>
            </div>
            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-100 p-4 hover:border-primary-green transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                          {request.student?.fullName
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || '?'}
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            {request.student?.fullName}
                          </h4>
                          <p className="text-sm text-muted-text">
                            {request.student?.programme} • Year{' '}
                            {request.student?.year}
                          </p>
                          {request.message && (
                            <p className="text-sm text-muted-text mt-1 line-clamp-1">
                              {request.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-green-600 text-white px-3 py-1 text-sm hover:bg-green-700 transition-colors">
                          Accept
                        </button>
                        <button className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 transition-colors">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-text">No pending requests.</p>
            )}
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Active Mentees</h2>
              <Link
                href="/mentor/mentees"
                className="text-sm text-primary-green hover:underline"
              >
                View all →
              </Link>
            </div>
            {activeMentorships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeMentorships.map((mentorship) => (
                  <div key={mentorship.id} className="border border-gray-100 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-xs font-semibold text-primary-green">
                        {mentorship.student?.fullName
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || '?'}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {mentorship.student?.fullName}
                        </h4>
                        <p className="text-xs text-muted-text">
                          {mentorship.student?.programme}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-text">No active mentees yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function QuickAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: any;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-200 p-4 text-center hover:border-primary-green transition-colors group"
    >
      <Icon className="h-6 w-6 text-primary-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
