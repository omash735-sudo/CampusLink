// app/admin/clubs/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { clubs, clubRegistrations } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { ClubRow } from './ClubRow';
import { RegistrationRow } from './RegistrationRow';

export const dynamic = 'force-dynamic';

export default async function AdminClubsPage() {
  const activeClubs = await db
    .select()
    .from(clubs)
    .orderBy(desc(clubs.createdAt));

  const pending = await db
    .select()
    .from(clubRegistrations)
    .where(eq(clubRegistrations.status, 'pending'))
    .orderBy(desc(clubRegistrations.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Campus Clubs</h1>
          <p className="text-sm text-gray-500">
            Manage clubs and review new club registrations.
          </p>
        </div>
        <Link
          href="/admin/clubs/new"
          className="bg-primary-green text-white px-4 py-2 font-medium hover:bg-deep-green transition-colors"
        >
          + Add Club
        </Link>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-semibold">
            Pending Registrations ({pending.length})
          </h2>
        </div>
        {pending.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No pending registrations.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pending.map((r) => (
              <RegistrationRow key={r.id} registration={r} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-semibold">
            Published Clubs ({activeClubs.length})
          </h2>
        </div>
        {activeClubs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No clubs yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activeClubs.map((c) => (
              <ClubRow key={c.id} club={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
