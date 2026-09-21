// app/mentor/profile/page.tsx
import Link from 'next/link';
import { requireMentor } from '@/lib/auth';
import { db } from '@/lib/db';
import { mentors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ContactPreferencesForm } from './ContactPreferencesForm';

export const dynamic = 'force-dynamic';

export default async function MentorProfilePage() {
  const user = await requireMentor();

  const [mentor] = await db
    .select()
    .from(mentors)
    .where(eq(mentors.userId, user.id))
    .limit(1);

  if (!mentor) {
    return (
      <div className="min-h-screen bg-off-white py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">No Mentor Profile</h1>
            <p className="text-muted-text">
              We couldn&apos;t find a mentor profile for your account.
            </p>
            <Link
              href="/mentor"
              className="text-primary-green hover:underline text-sm mt-4 inline-block"
            >
              ← Back to Mentor Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Link
            href="/mentor"
            className="text-primary-green hover:underline text-sm"
          >
            ← Back to Mentor Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-2">Mentor Profile</h1>
          <p className="text-muted-text mt-1">
            Manage how mentees reach you and what information appears on your
            public mentor card.
          </p>
        </div>

        {/* Read-only summary */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-text">Name</span>
              <span className="font-medium text-right">{user.fullName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-text">Programme</span>
              <span className="font-medium text-right">
                {user.programme || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-text">Mentor type</span>
              <span className="font-medium text-right">
                {user.mentorType || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-text">Availability</span>
              <span className="font-medium text-right">
                {mentor.availability || 'available'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-text mt-4">
            Editing your name, programme, expertise and introduction isn&apos;t
            available yet. Contact an administrator if you need changes.
          </p>
        </div>

        {/* Contact preferences form */}
        <ContactPreferencesForm
          initialPreferredContactMethod={mentor.preferredContactMethod}
          initialContactWhatsapp={mentor.contactWhatsapp}
        />
      </div>
    </div>
  );
}
