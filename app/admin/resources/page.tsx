// app/admin/resources/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { desc, and, eq, or, ilike } from 'drizzle-orm';
import { ResourceAdminRow } from './ResourceAdminRow';

export const dynamic = 'force-dynamic';

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: { kind?: string; status?: string; q?: string };
}) {
  const conditions: any[] = [];

  if (searchParams.kind && searchParams.kind !== 'all') {
    conditions.push(eq(resources.resourceKind, searchParams.kind));
  }
  if (searchParams.status && searchParams.status !== 'all') {
    conditions.push(eq(resources.status, searchParams.status));
  }
  if (searchParams.q) {
    conditions.push(
      or(
        ilike(resources.title, `%${searchParams.q}%`),
        ilike(resources.description, `%${searchParams.q}%`)
      )!
    );
  }

  const rows = await db
    .select()
    .from(resources)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(resources.createdAt));

  const kindFilter = searchParams.kind || 'all';
  const statusFilter = searchParams.status || 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Academic Library</h1>
          <p className="text-sm text-gray-500">
            {rows.length} item{rows.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
        >
          + Add Resource
        </Link>
      </div>

      <form className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label-text">Search</label>
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q || ''}
            className="input-field"
            placeholder="Title or description"
          />
        </div>
        <div>
          <label className="label-text">Type</label>
          <select name="kind" defaultValue={kindFilter} className="input-field">
            <option value="all">All</option>
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="publication">Publication</option>
          </select>
        </div>
        <div>
          <label className="label-text">Status</label>
          <select name="status" defaultValue={statusFilter} className="input-field">
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
          Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No resources found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rows.map((r) => (
            <ResourceAdminRow key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
