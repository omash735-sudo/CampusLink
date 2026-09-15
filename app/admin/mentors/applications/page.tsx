// app/admin/mentors/applications/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ApplicationRow } from './ApplicationRow';

export const dynamic = 'force-dynamic';

export default async function MentorApplicationsPage() {
  const rows = await db
    .select({
      mentorId: mentors.id,
      userId: mentors.userId,
      status: mentors.status,
      expertise: mentors.expertise,
      subjects: mentors.subjects,
      introduction: mentors.introduction,
      experience: mentors.experience,
      createdAt: mentors.createdAt,
      user: {
        id: campuslinkUsers.id,
        fullName: campuslinkUsers.fullName,
        username: campuslinkUsers.username,
        email: campuslinkUsers.email,
        programme: campuslinkUsers.programme,
        year: campuslinkUsers.year,
        mentorType: campuslinkUsers.mentorType,
      },
    })
    .from(mentors)
    .leftJoin(campuslinkUsers, eq(mentors.userId, campuslinkUsers.id))
    .where(eq(mentors.status, 'pending'))
    .orderBy(desc(mentors.createdAt));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentor Applications</h1>
          <p className="text-sm text-gray-500">
            {rows.length} pending application{rows.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No pending mentor applications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <ApplicationRow
              key={row.mentorId}
              mentorId={row.mentorId}
              userId={row.userId}
              fullName={row.user?.fullName || 'Unknown'}
              username={row.user?.username || ''}
              email={row.user?.email || ''}
              programme={row.user?.programme || null}
              year={row.user?.year || null}
              mentorType={row.user?.mentorType || null}
              introduction={row.introduction}
              experience={row.experience}
              expertise={row.expertise || []}
              subjects={row.subjects || []}
              createdAt={row.createdAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
