// app/admin/campus/locations/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { asc, and, eq, ilike } from 'drizzle-orm';
import { LocationRow } from './LocationRow';

export const dynamic = 'force-dynamic';

export default async function AdminCampusLocationsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; published?: string };
}) {
  const q = searchParams.q || '';
  const categoryFilter = searchParams.category || 'all';
  const publishedFilter = searchParams.published || 'all';

  const conditions: any[] = [];
  if (q) conditions.push(ilike(campusLocations.name, `%${q}%`));
  if (categoryFilter !== 'all') conditions.push(eq(campusLocations.category, categoryFilter));
  if (publishedFilter === 'published') conditions.push(eq(campusLocations.isPublished, true));
  if (publishedFilter === 'draft') conditions.push(eq(campusLocations.isPublished, false));

  const rawRows = await db
    .select()
    .from(campusLocations)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(campusLocations.sortOrder), asc(campusLocations.name));

  // Coalesce nullable DB columns + serialize dates for the client component
  const rows = rawRows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    category: r.category,
    shortDescription: r.shortDescription,
    imageUrl: r.imageUrl,
    isFeatured: r.isFeatured ?? false,
    isPublished: r.isPublished ?? false,
    sortOrder: r.sortOrder ?? 0,
    updatedAt: r.updatedAt.toISOString(),
  }));

  const categories = await db
    .selectDistinct({ category: campusLocations.category })
    .from(campusLocations)
    .orderBy(campusLocations.category);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, category: categoryFilter, published: publishedFilter, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== '') p.set(k, v);
    });
    const s = p.toString();
    return `/admin/campus/locations${s ? `?${s}` : ''}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/campus"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Campus
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-1">Locations</h1>
          <p className="text-sm text-gray-500">
            {rows.length} location{rows.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/campus/locations/new"
          className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
        >
          + Add Location
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
            placeholder="Location name"
          />
        </div>
        <div>
          <label className="label-text">Category</label>
          <select name="category" defaultValue={categoryFilter} className="input-field">
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category.charAt(0).toUpperCase() + c.category.slice(1)}
              </option>
            ))}
          </select>
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
        {(q || categoryFilter !== 'all' || publishedFilter !== 'all') && (
          <Link
            href="/admin/campus/locations"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No locations found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {rows.map((row) => (
            <LocationRow key={row.id} location={row} />
          ))}
        </div>
      )}
    </div>
  );
}
