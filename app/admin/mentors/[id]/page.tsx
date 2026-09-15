// app/admin/mentors/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers, mentorships } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { AdminMentorActions } from './AdminMentorActions';

export const dynamic = 'force-dynamic';

export default async function MentorDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [mentor] = await db
    .select()
    .from(mentors)
    .where(eq(mentors.id, params.id));

  if (!mentor) notFound();

  const [user] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, mentor.userId));

  if (!user) notFound();

  const [{ count: menteeCount } = { count: 0 }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(mentorships)
    .where(
      and(
        eq(mentorships.mentorId, mentor.id),
        eq(mentorships.status, 'active')
      )
    );

  const totalMentees = Number(menteeCount) || 0;

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/mentors" className="text-primary-green hover:underline text-sm">
          ← Back to Mentors
        </Link>
        <h1 className="text-2xl font-bold">Mentor Details</h1>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl font-semibold text-primary-green flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              {user.mentorType && (
                <span className="text-xs bg-gray-100 px-2 py-0.5">
                  {user.mentorType}
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 ${
                  mentor.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : mentor.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {mentor.status.charAt(0).toUpperCase() + mentor.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-500">@{user.username}</p>
            <p className="text-gray-500">
              {user.programme} {user.year ? `• Year ${user.year}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/mentors/${user.username}`}
              target="_blank"
              className="border border-gray-300 px-4 py-1.5 text-sm hover:border-primary-green transition-colors"
            >
              Public Profile
            </Link>
            <AdminMentorActions
              mentorId={mentor.id}
              userId={user.id}
              currentStatus={mentor.status}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Username</span>
              <span>@{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined Mentor</span>
              <span>{new Date(mentor.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rating</span>
              <span>{mentor.rating || 0} / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Availability</span>
              <span className="capitalize">
                {mentor.availability || 'Not set'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Mentorship Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Active Mentees</span>
              <span>{totalMentees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Programme</span>
              <span>{user.programme || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Year</span>
              <span>{user.year || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reviews</span>
              <span>{mentor.reviewCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {(mentor.expertise?.length || mentor.subjects?.length) ? (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Expertise & Subjects</h3>
          <div className="space-y-3">
            {mentor.expertise && mentor.expertise.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Areas of Expertise
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mentor.expertise.map((exp) => (
                    <span key={exp} className="text-sm bg-gray-100 px-3 py-1">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {mentor.subjects && mentor.subjects.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Subjects</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mentor.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="text-sm bg-primary-green/10 text-primary-green px-3 py-1"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {mentor.introduction && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Introduction</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {mentor.introduction}
          </p>
        </div>
      )}

      {mentor.experience && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Experience</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {mentor.experience}
          </p>
        </div>
      )}
    </div>
  );
}
