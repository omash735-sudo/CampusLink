// app/admin/mentors/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers, mentorships } from '@/lib/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function AdminMentorsPage() {
  const rows = await db
    .select({
      id: mentors.id,
      userId: mentors.userId,
      status: mentors.status,
      expertise: mentors.expertise,
      availability: mentors.availability,
      rating: mentors.rating,
      createdAt: mentors.createdAt,
      user: {
        fullName: campuslinkUsers.fullName,
        username: campuslinkUsers.username,
        programme: campuslinkUsers.programme,
        year: campuslinkUsers.year,
        mentorType: campuslinkUsers.mentorType,
        avatar: campuslinkUsers.avatar,
      },
    })
    .from(mentors)
    .leftJoin(campuslinkUsers, eq(mentors.userId, campuslinkUsers.id))
    .where(eq(mentors.status, 'approved'))
    .orderBy(desc(mentors.createdAt));

  const menteeCounts = await db
    .select({
      mentorId: mentorships.mentorId,
      count: sql<number>`count(*)`,
    })
    .from(mentorships)
    .where(eq(mentorships.status, 'active'))
    .groupBy(mentorships.mentorId);

  const countMap = new Map(menteeCounts.map((r) => [r.mentorId, Number(r.count)]));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentors</h1>
          <p className="text-sm text-gray-500">
            {rows.length} approved mentor{rows.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No approved mentors yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((mentor) => {
            const menteeCount = countMap.get(mentor.id) || 0;
            return (
              <div
                key={mentor.id}
                className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {mentor.user?.fullName || 'Unknown'}
                      </h3>
                      {mentor.user?.mentorType && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 flex-shrink-0">
                          {mentor.user.mentorType}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {mentor.user?.programme || 'No programme'}
                      {mentor.user?.year ? ` • Year ${mentor.user.year}` : ''}
                    </p>
                    {mentor.expertise && mentor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mentor.expertise.slice(0, 3).map((exp) => (
                          <span key={exp} className="text-xs bg-gray-100 px-2 py-0.5">
                            {exp}
                          </span>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{mentor.expertise.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>{menteeCount} mentee{menteeCount !== 1 ? 's' : ''}</span>
                      <span>
                        Joined {new Date(mentor.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 flex-shrink-0 ml-2 ${
                      mentor.availability === 'available'
                        ? 'bg-green-100 text-green-700'
                        : mentor.availability === 'limited'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {mentor.availability === 'available'
                      ? 'Available'
                      : mentor.availability === 'limited'
                      ? 'Limited'
                      : 'Unavailable'}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3">
                  <Link
                    href={`/admin/mentors/${mentor.id}`}
                    className="text-primary-green hover:underline text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/mentors/${mentor.user?.username}`}
                    target="_blank"
                    className="text-gray-500 hover:underline text-sm"
                  >
                    Public Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
