// app/admin/campus/timeline/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { campusTimeline } from '@/lib/db/schema';
import { asc, and, eq, ilike } from 'drizzle-orm';
import { TimelineRow } from './TimelineRow';

export const dynamic = 'force-dynamic';

export default async function AdminCampusTimelinePage({
  searchParams,
}: {
  searchParams: { q?: string; published?: string };
}) {
  const q = searchParams.q || '';
  const publishedFilter = searchParams.published || 'all';

  const conditions: any[] = [];
  if (q) conditions.push(ilike(campusTimeline.title, `%${q}%`));
  if (publishedFilter === 'published') conditions.push(eq(campusTimeline.isPublished, true));
  if (publishedFilter === 'draft') conditions.push(eq(campusTimeline.isPublished, false));

  const rawRows = await db
    .select()
    .from(campusTimeline)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(campusTimeline.sortOrder), asc(campusTimeline.year));

  const rows = rawRows.map((r) => ({
    id: r.id,
    year: r.year,
    title: r.title,
    description: r.description,
    imageUrl: r.imageUrl,
    source: r.source,
    isPublished: r.isPublished ?? true,
    sortOrder: r.sortOrder ?? 0,
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            href="/admin/campus"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Campus
          </Link>
          <h1 className="text-2xl font-bold mt-1">History Timeline</h1>
          <p className="text-sm text-gray-500">
            {rows.length} entr{rows.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <Link
          href="/admin/campus/timeline/new"
          className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
        >
          + Add Entry
        </Link>
      </div>

      <form className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label-text">Search</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            className="input-field"
            placeholder="Title"
          />
        </div>
        <div>
          <label className="label-text">Status</label>
          <select name="published" defaultValue={publishedFilter} className="input-field">
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
          Filter
        </button>
        {(q || publishedFilter !== 'all') && (
          <Link
            href="/admin/campus/timeline"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No timeline entries found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rows.map((row) => (
            <TimelineRow key={row.id} entry={row} />
          ))}
        </div>
      )}
    </div>
  );
}
