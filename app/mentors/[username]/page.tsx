// app/mentors/[username]/page.tsx
import { db } from '@/lib/db';
import { mentors, campuslinkUsers, mentorExpertise } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import Image from 'next/image';

export default async function MentorProfilePage({ params }: { params: { username: string } }) {
  const currentUser = await getCurrentUser();

  const user = await db
    .select({
      id: campuslinkUsers.id,
      fullName: campuslinkUsers.fullName,
      username: campuslinkUsers.username,
      avatar: campuslinkUsers.avatar,
      programme: campuslinkUsers.programme,
      year: campuslinkUsers.year,
      mentorType: campuslinkUsers.mentorType,
      bio: campuslinkUsers.bio,
    })
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.username, params.username))
    .then(res => res[0]);

  if (!user) notFound();

  const mentor = await db
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
    })
    .from(mentors)
    .where(and(
      eq(mentors.userId, user.id),
      eq(mentors.status, 'approved')
    ))
    .then(res => res[0]);

  if (!mentor) notFound();

  const expertiseList = await db
    .select()
    .from(mentorExpertise)
    .where(eq(mentorExpertise.mentorId, mentor.id));

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/mentors" className="text-primary-green hover:underline text-sm">
          ← Back to Mentors
        </Link>

        <div className="bg-white border border-gray-200 p-8 mt-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-24 w-24 flex-shrink-0 border border-gray-200 bg-primary-green text-white flex items-center justify-center font-semibold text-3xl overflow-hidden">
              {user.avatar ? (
                <Image src={user.avatar} alt={user.fullName} width={96} height={96} className="h-full w-full object-cover" />
              ) : (
                user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{user.fullName}</h1>
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1">Verified Mentor</span>
              </div>
              {user.mentorType && (
                <p className="text-lg text-muted-text">{user.mentorType} Mentor</p>
              )}
              {user.programme && (
                <p className="text-muted-text">{user.programme}</p>
              )}
              {user.year && (
                <p className="text-muted-text">Year {user.year}</p>
              )}
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-text">
                {mentor.availability && (
                  <span className={`px-3 py-1 ${
                    mentor.availability === 'available' ? 'bg-green-100 text-green-700' :
                    mentor.availability === 'limited' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {mentor.availability === 'available' ? 'Available for Mentorship' :
                     mentor.availability === 'limited' ? 'Limited Availability' :
                     'Currently Unavailable'}
                  </span>
                )}
                <span>{mentor.rating || 0} rating</span>
                <span>{mentor.reviewCount || 0} reviews</span>
              </div>
            </div>
          </div>
        </div>

        {user.bio || mentor.introduction ? (
          <div className="bg-white border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold mb-3">About</h2>
            <p className="text-muted-text">{mentor.introduction || user.bio}</p>
          </div>
        ) : null}

        {(mentor.expertise && mentor.expertise.length > 0) || expertiseList.length > 0 ? (
          <div className="bg-white border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold mb-3">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise?.map((exp: string) => (
                <span key={exp} className="bg-gray-100 px-3 py-1 text-sm">{exp}</span>
              ))}
              {expertiseList.map((exp) => (
                <span key={exp.id} className="bg-gray-100 px-3 py-1 text-sm">{exp.name}</span>
              ))}
            </div>
          </div>
        ) : null}

        {mentor.experience && (
          <div className="bg-white border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold mb-3">Experience</h2>
            <p className="text-muted-text">{mentor.experience}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4">
          {!isOwnProfile && currentUser ? (
            <Link
              href={`/mentors/${user.username}/request`}
              className="bg-primary-green text-white px-8 py-3 font-medium hover:bg-deep-green transition-colors"
            >
              Request Mentorship
            </Link>
          ) : isOwnProfile ? (
            <Link
              href="/mentor"
              className="bg-primary-green text-white px-8 py-3 font-medium hover:bg-deep-green transition-colors"
            >
              Manage Mentorship
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-primary-green text-white px-8 py-3 font-medium hover:bg-deep-green transition-colors"
            >
              Sign in to Request Mentorship
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
