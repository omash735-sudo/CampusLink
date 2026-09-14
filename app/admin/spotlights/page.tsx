// app/admin/spotlights/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { studentSpotlights } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { SpotlightRow } from './SpotlightRow';

export const dynamic = 'force-dynamic';

export default async function SpotlightsAdminPage() {
  const rows = await db
    .select()
    .from(studentSpotlights)
    .orderBy(desc(studentSpotlights.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Spotlight</h1>
          <p className="text-sm text-gray-500">
            Feature students on the public spotlight page.
          </p>
        </div>
        <Link
          href="/admin/spotlights/new"
          className="bg-primary-green text-white px-4 py-2 font-medium hover:bg-deep-green transition-colors"
        >
          + New Spotlight
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No spotlights yet.</p>
          <Link
            href="/admin/spotlights/new"
            className="text-primary-green hover:underline"
          >
            Create the first spotlight →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rows.map((s) => (
            <SpotlightRow key={s.id} spotlight={s} />
          ))}
        </div>
      )}
    </div>
  );
}
