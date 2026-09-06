// components/mentors/RecommendedMentors.tsx
import { db } from '@/lib/db';
import { mentors, users } from '@/lib/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { MentorCard } from './MentorCard';

export async function RecommendedMentors({ currentUserId }: { currentUserId: string }) {
  const currentUser = await db
    .select({
      id: users.id,
      programme: users.programme,
      year: users.year,
    })
    .from(users)
    .where(eq(users.id, currentUserId))
    .then(res => res[0]);

  if (!currentUser || !currentUser.programme) return null;

  // Get recommended mentors based on programme
  const recommendedMentors = await db
    .select({
      id: mentors.id,
      userId: mentors.userId,
      status: mentors.status,
      expertise: mentors.expertise,
      subjects: mentors.subjects,
      introduction: mentors.introduction,
      experience: mentors.experience,
      rating: mentors.rating,
      reviewCount: mentors.reviewCount,
      availability: mentors.availability,
      user: {
        fullName: users.fullName,
        username: users.username,
        programme: users.programme,
        year: users.year,
        avatar: users.avatar,
        mentorType: users.mentorType,
      }
    })
    .from(mentors)
    .leftJoin(users, eq(mentors.userId, users.id))
    .where(and(
      eq(mentors.status, 'verified'),
      ne(mentors.userId, currentUserId),
      eq(users.programme, currentUser.programme)
    ))
    .orderBy(desc(mentors.rating))
    .limit(4);

  if (recommendedMentors.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">Recommended for You</h2>
      <p className="text-muted-text text-sm mb-4">
        Recommended because you study {currentUser.programme}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedMentors.map((mentor) => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
