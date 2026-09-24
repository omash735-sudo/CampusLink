// app/mentors/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers, mentorExpertise } from '@/lib/db/schema';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';
import Link from 'next/link';
import { MentorSearch } from '@/components/mentors/MentorSearch';
import { MentorFilters } from '@/components/mentors/MentorFilters';
import { MentorCard } from '@/components/mentors/MentorCard';
import { RecommendedMentors } from '@/components/mentors/RecommendedMentors';

export const dynamic = 'force-dynamic';

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    expertise?: string;
    type?: string;
    availability?: string;
  };
}) {
  const currentUser = await getCurrentUser();
  const search = searchParams.search || '';
  const expertiseFilter = searchParams.expertise || '';
  const typeFilter = searchParams.type || '';
  const availabilityFilter = searchParams.availability || '';

  // Build query using incremental approach
  let query = db
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
        fullName: campuslinkUsers.fullName,
        username: campuslinkUsers.username,
        programme: campuslinkUsers.programme,
        year: campuslinkUsers.year,
        avatar: campuslinkUsers.avatar,
        mentorType: campuslinkUsers.mentorType,
      },
    })
    .from(mentors)
    .leftJoin(campuslinkUsers, eq(mentors.userId, campuslinkUsers.id))
    .where(eq(mentors.status, 'approved'));

  if (search) {
    query = query.where(
      or(
        like(campuslinkUsers.fullName, `%${search}%`),
        like(campuslinkUsers.programme, `%${search}%`),
        like(mentors.expertise, `%${search}%`)
      )
    );
  }

  if (typeFilter) {
    query = query.where(eq(campuslinkUsers.mentorType, typeFilter));
  }

  if (availabilityFilter === 'available') {
    query = query.where(eq(mentors.availability, 'available'));
  } else if (availabilityFilter === 'limited') {
    query = query.where(eq(mentors.availability, 'limited'));
  }

  const mentorsList = await query.orderBy(desc(mentors.rating)).limit(20);

  const expertiseOptions = await db
    .selectDistinct({
      name: mentorExpertise.name,
    })
    .from(mentorExpertise)
    .orderBy(mentorExpertise.name);

  const mentorTypes = ['Student', 'Alumni', 'Professional', 'Staff'];

  const hasActiveFilters = !!(search || expertiseFilter || typeFilter || availabilityFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6faf7] via-off-white to-off-white relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-green/5 to-transparent"
      />

      <div className="relative container mx-auto px-4 py-8 md:py-10 max-w-6xl">
        {/* ---------- Page header ---------- */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-wide uppercase text-primary-green/80 mb-2">
            Mentorship
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">
            Find a Mentor
          </h1>
          <p className="text-base md:text-lg text-muted-text mt-2 max-w-2xl">
            Get guidance from someone who has been where you are and knows where
            you&apos;re going.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href="/mentors"
              className="bg-primary-green text-white px-5 py-2.5 text-sm font-medium hover:bg-deep-green hover:shadow-[0_8px_24px_-12px_rgba(23,107,58,0.4)] transition-all"
            >
              Find a Mentor
            </Link>
            {!currentUser?.isMentor && (
              <Link
                href="/mentors/become-a-mentor"
                className="bg-white/70 backdrop-blur-md border-2 border-primary-green text-primary-green px-5 py-2.5 text-sm font-medium hover:bg-primary-green hover:text-white transition-colors"
              >
                Become a Mentor
              </Link>
            )}
          </div>
        </div>

        {/* ---------- Recommended for you ---------- */}
        {currentUser && (
          <div className="mb-8">
            <RecommendedMentors currentUserId={currentUser.id} />
          </div>
        )}

        {/* ---------- Search + Filters ---------- */}
        <div className="bg-white/70 backdrop-blur-md border border-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5 md:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-text">
              Search & Filter
            </h2>
            {hasActiveFilters && (
              <Link
                href="/mentors"
                className="text-xs font-medium text-primary-green hover:underline"
              >
                Clear all
              </Link>
            )}
          </div>

          <div className="max-w-2xl">
            <MentorSearch />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100/80">
            <MentorFilters
              expertiseOptions={expertiseOptions}
              mentorTypes={mentorTypes}
            />
          </div>
        </div>

        {/* ---------- Results ---------- */}
        <div>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-lg md:text-xl font-bold text-primary-text">
              {mentorsList.length} mentor{mentorsList.length !== 1 ? 's' : ''}{' '}
              <span className="text-sm font-normal text-muted-text">available</span>
            </h2>
          </div>

          {mentorsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {mentorsList.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  currentUserId={currentUser?.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-md border border-dashed border-gray-200 p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary-green/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-6 w-6 text-primary-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-text">
                No mentors found
              </h3>
              <p className="text-sm text-muted-text mt-1 max-w-md mx-auto">
                Try adjusting your search or filters — or if you have
                experience to share, become a mentor yourself.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 justify-center">
                <Link
                  href="/mentors"
                  className="text-sm font-medium text-primary-green hover:underline"
                >
                  Clear Filters
                </Link>
                <Link
                  href="/mentors/become-a-mentor"
                  className="text-sm font-medium text-primary-green hover:underline"
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
