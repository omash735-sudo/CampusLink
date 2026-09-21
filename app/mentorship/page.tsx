// app/mentorship/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import {
  mentorships,
  mentorshipRequests,
  mentors,
  campuslinkUsers,
} from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { getCurrentUser } from '@/lib/auth';
import { EndMentorshipButton } from './EndMentorshipButton';

export const dynamic = 'force-dynamic';

const mentorUser = alias(campuslinkUsers, 'mentor_user');

function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
}

function whatsappHref(
  rawNumber: string,
  mentorName: string,
  studentName: string
): string {
  const digits = rawNumber.replace(/\D/g, '');
  const msg = `Hi ${mentorName}, I'm ${studentName} — we're matched on CampusLink for mentorship. Do you have a moment to talk?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

function topicFrom(
  expertise: string[] | null | undefined,
  programme: string | null | undefined
): string {
  if (expertise && expertise.length > 0) return expertise[0];
  if (programme) return programme;
  return 'Mentorship';
}

export default async function MentorshipPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const activeMentorships = await db
    .select({
      id: mentorships.id,
      startedAt: mentorships.startedAt,
      mentorName: mentorUser.fullName,
      mentorUsername: mentorUser.username,
      mentorProgramme: mentorUser.programme,
      mentorExpertise: mentors.expertise,
      mentorPreferredContact: mentors.preferredContactMethod,
      mentorContactWhatsapp: mentors.contactWhatsapp,
    })
    .from(mentorships)
    .leftJoin(mentors, eq(mentorships.mentorId, mentors.id))
    .leftJoin(mentorUser, eq(mentors.userId, mentorUser.id))
    .where(
      and(
        eq(mentorships.studentId, user.id),
        eq(mentorships.status, 'active')
      )
    )
    .orderBy(desc(mentorships.startedAt));

  const pendingRequests = await db
    .select({
      id: mentorshipRequests.id,
      message: mentorshipRequests.message,
      createdAt: mentorshipRequests.createdAt,
      mentorName: mentorUser.fullName,
      mentorUsername: mentorUser.username,
      mentorProgramme: mentorUser.programme,
      mentorExpertise: mentors.expertise,
      mentorPreferredContact: mentors.preferredContactMethod,
    })
    .from(mentorshipRequests)
    .leftJoin(mentors, eq(mentorshipRequests.mentorId, mentors.id))
    .leftJoin(mentorUser, eq(mentors.userId, mentorUser.id))
    .where(
      and(
        eq(mentorshipRequests.studentId, user.id),
        eq(mentorshipRequests.status, 'pending')
      )
    )
    .orderBy(desc(mentorshipRequests.createdAt));

  const completedMentorships = await db
    .select({
      id: mentorships.id,
      startedAt: mentorships.startedAt,
      endedAt: mentorships.endedAt,
      mentorName: mentorUser.fullName,
      mentorUsername: mentorUser.username,
      mentorProgramme: mentorUser.programme,
      mentorExpertise: mentors.expertise,
    })
    .from(mentorships)
    .leftJoin(mentors, eq(mentorships.mentorId, mentors.id))
    .leftJoin(mentorUser, eq(mentors.userId, mentorUser.id))
    .where(
      and(
        eq(mentorships.studentId, user.id),
        eq(mentorships.status, 'completed')
      )
    )
    .orderBy(desc(mentorships.endedAt));

  const totalCount =
    activeMentorships.length +
    pendingRequests.length +
    completedMentorships.length;

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Mentorships</h1>
          <Link
            href="/mentors"
            className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
          >
            Find a Mentor
          </Link>
        </div>

        {/* Active */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Active Mentorship</h2>
          {activeMentorships.length > 0 ? (
            <div className="space-y-3">
              {activeMentorships.map((m) => {
                const contact = m.mentorPreferredContact;
                const canWhatsApp =
                  (contact === 'whatsapp' || contact === 'both') &&
                  !!m.mentorContactWhatsapp;
                const canMessage =
                  contact === 'campuslink' || contact === 'both';
                const noPreference = !contact;

                return (
                  <div key={m.id} className="border border-gray-100 p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                          {initials(m.mentorName)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">
                            {m.mentorName || 'Unknown mentor'}
                          </h3>
                          <p className="text-sm text-muted-text truncate">
                            {m.mentorProgramme || 'No programme'} •{' '}
                            {topicFrom(m.mentorExpertise, m.mentorProgramme)}
                          </p>
                          <p className="text-xs text-muted-text mt-0.5">
                            Started{' '}
                            {new Date(m.startedAt).toLocaleDateString()}
                          </p>
                          {contact && (
                            <p className="text-xs text-muted-text mt-1">
                              Preferred contact:{' '}
                              <span className="font-medium text-gray-700">
                                {contact === 'whatsapp'
                                  ? 'WhatsApp'
                                  : contact === 'campuslink'
                                  ? 'CampusLink Messages'
                                  : 'WhatsApp or CampusLink Messages'}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 shrink-0">
                        Active
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {m.mentorUsername && (
                        <Link
                          href={`/profile/${m.mentorUsername}`}
                          className="text-sm text-primary-green hover:underline"
                        >
                          View Profile
                        </Link>
                      )}

                      {canWhatsApp && (
                        <a
                          href={whatsappHref(
                            m.mentorContactWhatsapp!,
                            m.mentorName || 'there',
                            user.fullName || 'a student'
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-green hover:underline font-medium"
                        >
                          Contact on WhatsApp →
                        </a>
                      )}

                      {canMessage && (
                        <span className="text-xs text-muted-text italic">
                          CampusLink Messages coming soon
                        </span>
                      )}

                      {noPreference && (
                        <span className="text-xs text-muted-text italic">
                          {m.mentorName || 'This mentor'} hasn&apos;t set a
                          preferred contact method yet.
                        </span>
                      )}

                      <div className="ml-auto">
                        <EndMentorshipButton mentorshipId={m.id} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-text">No active mentorships.</p>
          )}
        </div>

        {/* Pending */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.map((m) => (
                <div key={m.id} className="border border-gray-100 p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-semibold text-yellow-700 flex-shrink-0">
                        {initials(m.mentorName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">
                          {m.mentorName || 'Unknown mentor'}
                        </h3>
                        <p className="text-sm text-muted-text truncate">
                          {m.mentorProgramme || 'No programme'} •{' '}
                          {topicFrom(m.mentorExpertise, m.mentorProgramme)}
                        </p>
                        {m.message && (
                          <p className="text-xs text-muted-text mt-1 line-clamp-1">
                            {m.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 shrink-0">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-muted-text mt-2">
                    Request sent{' '}
                    {new Date(m.createdAt).toLocaleDateString()} • Awaiting
                    response
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-text">No pending requests.</p>
          )}
        </div>

        {/* Completed */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Previous Mentorships</h2>
          {completedMentorships.length > 0 ? (
            <div className="space-y-3">
              {completedMentorships.map((m) => (
                <div key={m.id} className="border border-gray-100 p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                        {initials(m.mentorName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">
                          {m.mentorName || 'Unknown mentor'}
                        </h3>
                        <p className="text-sm text-muted-text truncate">
                          {m.mentorProgramme || 'No programme'} •{' '}
                          {topicFrom(m.mentorExpertise, m.mentorProgramme)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 shrink-0">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-muted-text mt-2">
                    {m.endedAt
                      ? `Completed ${new Date(m.endedAt).toLocaleDateString()}`
                      : `Started ${new Date(m.startedAt).toLocaleDateString()}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-text">No previous mentorships.</p>
          )}
        </div>

        {totalCount === 0 && (
          <div className="bg-white border border-gray-200 p-8 text-center mt-6">
            <p className="text-muted-text mb-4">
              You don&apos;t have any mentorships yet.
            </p>
            <Link
              href="/mentors"
              className="text-primary-green hover:underline text-sm font-medium"
            >
              Browse mentors →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
