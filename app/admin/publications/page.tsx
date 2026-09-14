// app/admin/publications/page.tsx
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';
import { ApplicationRow } from './ApplicationRow';

export const dynamic = 'force-dynamic';

export default async function PublicationsAdminPage() {
  const pending = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.publicationsStatus, 'pending'))
    .orderBy(desc(campuslinkUsers.publicationsAppliedAt));

  const approved = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.role, 'publications'))
    .orderBy(desc(campuslinkUsers.updatedAt));

  const rejected = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.publicationsStatus, 'rejected'))
    .orderBy(desc(campuslinkUsers.publicationsAppliedAt))
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Publications Office</h1>
        <p className="text-sm text-gray-500">
          Review applications and manage Publications Officers.
        </p>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-semibold">
            Pending Applications ({pending.length})
          </h2>
        </div>
        {pending.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No pending applications.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pending.map((u) => (
              <ApplicationRow key={u.id} user={u} mode="pending" />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-semibold">
            Current Publications Officers ({approved.length})
          </h2>
        </div>
        {approved.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No Publications Officers yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {approved.map((u) => (
              <ApplicationRow key={u.id} user={u} mode="approved" />
            ))}
          </div>
        )}
      </div>

      {rejected.length > 0 && (
        <div className="bg-white border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="font-semibold">
              Recently Rejected ({rejected.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {rejected.map((u) => (
              <ApplicationRow key={u.id} user={u} mode="rejected" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
