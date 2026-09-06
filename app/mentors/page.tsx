// app/mentors/page.tsx
import { db } from '@/lib/db';
import { mentors, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function MentorsPage() {
  const mentorsList = await db
    .select({
      id: mentors.id,
      userId: mentors.userId,
      status: mentors.status,
      expertise: mentors.expertise,
      subjects: mentors.subjects,
      introduction: mentors.introduction,
      rating: mentors.rating,
      reviewCount: mentors.reviewCount,
      user: {
        fullName: users.fullName,
        username: users.username,
        programme: users.programme,
        year: users.year,
        avatar: users.avatar,
      }
    })
    .from(mentors)
    .leftJoin(users, eq(mentors.userId, users.id))
    .where(eq(mentors.status, 'verified'))
    .orderBy(desc(mentors.rating))
    .limit(20);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Find a Mentor</h1>
        <p className="text-muted-text mb-8">
          Learn from experienced students who have been where you are.
        </p>

        {mentorsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorsList.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 border border-gray-200 bg-primary-green text-white flex items-center justify-center font-semibold text-lg overflow-hidden">
                    {mentor.user?.avatar ? (
                      <img src={mentor.user.avatar} alt={mentor.user.fullName} className="h-full w-full object-cover" />
                    ) : (
                      mentor.user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{mentor.user?.fullName || 'Unknown'}</h3>
                    <p className="text-sm text-muted-text">{mentor.user?.programme || 'No programme'}</p>
                    <p className="text-sm text-muted-text">Year {mentor.user?.year || '?'}</p>
                  </div>
                </div>
                {mentor.expertise && mentor.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mentor.expertise.slice(0, 3).map((exp) => (
                      <span key={exp} className="text-xs bg-gray-100 px-2 py-0.5">{exp}</span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="text-xs text-muted-text">+{mentor.expertise.length - 3}</span>
                    )}
                  </div>
                )}
                {mentor.introduction && (
                  <p className="text-sm text-muted-text mt-2 line-clamp-2">{mentor.introduction}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-text">
                  <span>{mentor.rating || 0} rating</span>
                  <span>{mentor.reviewCount || 0} reviews</span>
                </div>
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="mt-4 inline-block text-primary-green hover:underline text-sm font-medium"
                >
                  View Profile →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 bg-white p-8 text-center">
            <p className="text-muted-text">No verified mentors available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
