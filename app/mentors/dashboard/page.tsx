// app/mentors/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { mentors, mentorshipRequests, mentorships, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function MentorDashboard() {
  const user = await requireAuth();

  const mentor = await db
    .select()
    .from(mentors)
    .where(eq(mentors.userId, user.id))
    .then(res => res[0]);

  if (!mentor) {
    return (
      <div className="min-h-screen bg-off-white py-8">
        <div className="container mx-auto px-4">
          <div className="border border-gray-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Not a Mentor Yet</h2>
            <p className="text-muted-text mb-4">You need to become a mentor to access this dashboard.</p>
            <Link
              href="/mentors/become"
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors inline-block"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get pending requests
  const pendingRequests = await db
    .select({
      id: mentorshipRequests.id,
      message: mentorshipRequests.message,
      introduction: mentorshipRequests.introduction,
      helpNeeded: mentorshipRequests.helpNeeded,
      createdAt: mentorshipRequests.createdAt,
      student: {
        id: users.id,
        fullName: users.fullName,
        username: users.username,
        programme: users.programme,
        year: users.year,
        avatar: users.avatar,
      }
    })
    .from(mentorshipRequests)
    .leftJoin(users, eq(mentorshipRequests.studentId, users.id))
    .where(and(
      eq(mentorshipRequests.mentorId, mentor.id),
      eq(mentorshipRequests.status, 'pending')
    ))
    .orderBy(desc(mentorshipRequests.createdAt));

  // Get active mentorships
  const activeMentorships = await db
    .select({
      id: mentorships.id,
      startedAt: mentorships.startedAt,
      lastInteraction: mentorships.lastInteraction,
      student: {
        id: users.id,
        fullName: users.fullName,
        username: users.username,
        programme: users.programme,
        year: users.year,
        avatar: users.avatar,
      }
    })
    .from(mentorships)
    .leftJoin(users, eq(mentorships.studentId, users.id))
    .where(and(
      eq(mentorships.mentorId, mentor.id),
      eq(mentorships.status, 'active')
    ))
    .orderBy(desc(mentorships.startedAt));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mentor Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-primary-green">{pendingRequests.length}</div>
            <div className="text-sm text-muted-text">Pending Requests</div>
          </div>
          <div className="border border-gray-200 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-primary-green">{activeMentorships.length}</div>
            <div className="text-sm text-muted-text">Active Mentees</div>
          </div>
          <div className="border border-gray-200 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-primary-green">{mentor.rating || 0}</div>
            <div className="text-sm text-muted-text">Rating</div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-100 p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 flex-shrink-0 border border-gray-200 bg-primary-green text-white flex items-center justify-center font-semibold text-sm overflow-hidden">
                      {request.student?.avatar ? (
                        <img src={request.student.avatar} alt={request.student.fullName || ''} className="h-full w-full object-cover" />
                      ) : (
                        request.student?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{request.student?.fullName}</h4>
                      <p className="text-sm text-muted-text">{request.student?.programme} • Year {request.student?.year}</p>
                      {request.message && (
                        <p className="text-sm text-muted-text mt-1">{request.message}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-600 text-white px-4 py-1 text-sm hover:bg-green-700 transition-colors">
                        Accept
                      </button>
                      <button className="border border-gray-300 px-4 py-1 text-sm hover:bg-gray-50 transition-colors">
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

        {/* Active Mentees */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Active Mentees</h2>
          {activeMentorships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMentorships.map((mentorship) => (
                <div key={mentorship.id} className="border border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 border border-gray-200 bg-primary-green text-white flex items-center justify-center font-semibold text-sm overflow-hidden">
                      {mentorship.student?.avatar ? (
                        <img src={mentorship.student.avatar} alt={mentorship.student.fullName || ''} className="h-full w-full object-cover" />
                      ) : (
                        mentorship.student?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{mentorship.student?.fullName}</h4>
                      <p className="text-sm text-muted-text">{mentorship.student?.programme}</p>
                      <p className="text-xs text-muted-text">
                        Since {new Date(mentorship.startedAt).toLocaleDateString()}
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
  );
}
