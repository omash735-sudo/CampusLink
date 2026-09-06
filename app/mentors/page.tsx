// app/mentors/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { mentors, users, mentorExpertise } from '@/lib/db/schema';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';
import Link from 'next/link';
import { MentorSearch } from '@/components/mentors/MentorSearch';
import { MentorFilters } from '@/components/mentors/MentorFilters';
import { MentorCard } from '@/components/mentors/MentorCard';
import { RecommendedMentors } from '@/components/mentors/RecommendedMentors';

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: { search?: string; expertise?: string; type?: string; availability?: string }
}) {
  const currentUser = await getCurrentUser();
  const search = searchParams.search || '';
  const expertiseFilter = searchParams.expertise || '';
  const typeFilter = searchParams.type || '';
  const availabilityFilter = searchParams.availability || '';

  // Build query conditions
  const conditions = [eq(mentors.status, 'verified')];

  if (search) {
    conditions.push(
      or(
        like(users.fullName, `%${search}%`),
        like(users.programme, `%${search}%`),
        like(mentors.expertise, `%${search}%`)
      )
    );
  }

  if (typeFilter) {
    conditions.push(eq(users.mentorType, typeFilter));
  }

  if (availabilityFilter === 'available') {
    conditions.push(eq(mentors.availability, 'available'));
  } else if (availabilityFilter === 'limited') {
    conditions.push(eq(mentors.availability, 'limited'));
  }

  // Get mentors
  const mentorsList = await db
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
    .where(and(...conditions))
    .orderBy(desc(mentors.rating))
    .limit(20);

  // Get all expertise options for filters
  const expertiseOptions = await db
    .selectDistinct({
      name: mentorExpertise.name,
    })
    .from(mentorExpertise)
    .orderBy(mentorExpertise.name);

  // Get mentor types for filters
  const mentorTypes = ['Student', 'Alumni', 'Professional', 'Staff'];

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">Find a Mentor</h1>
          <p className="text-lg text-muted-text mt-2">
            Get guidance from someone who has been where you are and knows where you're going.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/mentors"
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors"
            >
              Find a Mentor
            </Link>
            {!currentUser?.isMentor && (
              <Link
                href="/mentors/become"
                className="border-2 border-primary-green text-primary-green px-6 py-2 font-medium hover:bg-primary-green hover:text-white transition-colors"
              >
                Become a Mentor
              </Link>
            )}
          </div>
        </div>

        {/* Recommended Mentors - Only for logged in users */}
        {currentUser && (
          <div className="mb-8">
            <RecommendedMentors currentUserId={currentUser.id} />
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="max-w-2xl">
            <MentorSearch />
          </div>
          <div className="mt-4">
            <MentorFilters
              expertiseOptions={expertiseOptions}
              mentorTypes={mentorTypes}
            />
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {mentorsList.length} mentor{mentorsList.length !== 1 ? 's' : ''} available
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorsList.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                currentUserId={currentUser?.id}
              />
            ))}
          </div>
          {mentorsList.length === 0 && (
            <div className="border border-gray-200 bg-white p-8 text-center">
              <p className="text-muted-text">No mentors found matching your criteria.</p>
              <div className="mt-4 flex gap-4 justify-center">
                <Link
                  href="/mentors"
                  className="text-primary-green hover:underline text-sm"
                >
                  Clear Filters
                </Link>
                <Link
                  href="/mentors/become"
                  className="text-primary-green hover:underline text-sm"
                >
                  Become a Mentor
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
