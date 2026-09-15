// app/mentor/mentees/page.tsx
import Link from 'next/link';
import { requireMentor } from '@/lib/auth';
import { db } from '@/lib/db';
import { mentors, mentorships, campuslinkUsers } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function MentorMenteesPage() {
  const user = await requireMentor();

  const [mentor] = await db
    .select()
    .from(mentors)
    .where(eq(mentors.userId, user.id));
  if (!mentor) {
    return (
      <div className="min-h-screen bg-off-white py-8">
        <div className="container mx-auto px-4">
          <p className="text-muted-text">You&apos;re not a mentor yet.</p>
        </div>
      </div>
    );
  }

  const rows = await db
    .select({
      id: mentorships.id,
      startedAt: mentorships.startedAt,
      status: mentorships.status,
      student: {
        id: campuslinkUsers.id,
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
    .orderBy(desc(mentorships.startedAt));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/mentor" className="text-primary-green hover:underline text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">My Mentees</h1>
          </div>
          <span className="text-sm bg-primary-green/10 text-primary-green px-3 py-1">
            {rows.length} active
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-muted-text">
              You don&apos;t have any active mentees yet.
            </p>
            <Link
              href="/mentor/requests"
              className="text-primary-green hover:underline text-sm mt-2 inline-block"
            >
              View pending requests →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((m) => {
              const initials =
                m.student?.fullName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || '?';
              return (
                <Link key={m.id} href={`/mentor/mentees/${m.student?.id}`}>
                  <div className="bg-white border border-gray-200 p-6 hover:border-primary-green transition-colors h-full">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary-green/10 flex items-center justify-center text-lg font-semibold text-primary-green flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{m.student?.fullName}</h3>
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-muted-text">
                          {m.student?.programme} • Year {m.student?.year}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-text">
                          <span>
                            Started: {new Date(m.startedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
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
