// app/mentor/mentees/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireMentor } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  mentors,
  mentorships,
  campuslinkUsers,
  mentorNotes,
} from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { MentorNotes } from './MentorNotes';

export const dynamic = 'force-dynamic';

export default async function MenteeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireMentor();

  const [mentor] = await db
    .select()
    .from(mentors)
    .where(eq(mentors.userId, user.id));
  if (!mentor) notFound();

  const [mentorship] = await db
    .select()
    .from(mentorships)
    .where(
      and(
        eq(mentorships.mentorId, mentor.id),
        eq(mentorships.studentId, params.id),
        eq(mentorships.status, 'active')
      )
    );
  if (!mentorship) notFound();

  const [mentee] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, params.id));
  if (!mentee) notFound();

  const notes = await db
    .select()
    .from(mentorNotes)
    .where(
      and(
        eq(mentorNotes.mentorId, mentor.id),
        eq(mentorNotes.menteeId, mentee.id)
      )
    )
    .orderBy(desc(mentorNotes.createdAt));

  const initials = mentee.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/mentor/mentees" className="text-primary-green hover:underline text-sm">
          ← Back to Mentees
        </Link>

        <div className="bg-white border border-gray-200 p-6 mt-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl font-semibold text-primary-green flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{mentee.fullName}</h1>
              <p className="text-muted-text">
                {mentee.programme} • Year {mentee.year}
              </p>
              {mentee.bio && (
                <p className="text-sm text-muted-text mt-1">{mentee.bio}</p>
              )}
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1">
              Active Mentee
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="font-semibold mb-3">Mentorship</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-text">Started</span>
                <span>{new Date(mentorship.startedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Status</span>
                <span className="text-green-600 capitalize">{mentorship.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h3 className="font-semibold mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-text">Username</span>
                <span>@{mentee.username}</span>
              </div>
            </div>
          </div>
        </div>

        <MentorNotes
          menteeId={mentee.id}
          initialNotes={notes.map((n) => ({
            id: n.id,
            content: n.content,
            createdAt: n.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
