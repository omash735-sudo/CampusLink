// app/admin/campus/gallery/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { campusGallery, campusLocations } from '@/lib/db/schema';
import { asc, and, eq, ilike } from 'drizzle-orm';
import { GalleryRow } from './GalleryRow';

export const dynamic = 'force-dynamic';

export default async function AdminCampusGalleryPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; published?: string };
}) {
  const q = searchParams.q || '';
  const categoryFilter = searchParams.category || 'all';
  const publishedFilter = searchParams.published || 'all';

  const conditions: any[] = [];
  if (q) conditions.push(ilike(campusGallery.title, `%${q}%`));
  if (categoryFilter !== 'all') conditions.push(eq(campusGallery.category, categoryFilter));
  if (publishedFilter === 'published') conditions.push(eq(campusGallery.isPublished, true));
  if (publishedFilter === 'draft') conditions.push(eq(campusGallery.isPublished, false));

  const rawRows = await db
    .select({
      id: campusGallery.id,
      title: campusGallery.title,
      imageUrl: campusGallery.imageUrl,
      category: campusGallery.category,
      description: campusGallery.description,
      locationId: campusGallery.locationId,
      locationName: campusLocations.name,
      locationSlug: campusLocations.slug,
      isPublished: campusGallery.isPublished,
      sortOrder: campusGallery.sortOrder,
      createdAt: campusGallery.createdAt,
      updatedAt: campusGallery.updatedAt,
    })
    .from(campusGallery)
    .leftJoin(campusLocations, eq(campusGallery.locationId, campusLocations.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(campusGallery.sortOrder), asc(campusGallery.createdAt));

  const rows = rawRows.map((r) => ({
    id: r.id,
    title: r.title,
    imageUrl: r.imageUrl,
    category: r.category,
    description: r.description,
    locationId: r.locationId,
    locationName: r.locationName,
    locationSlug: r.locationSlug,
    isPublished: r.isPublished ?? true,
    sortOrder: r.sortOrder ?? 0,
    updatedAt: r.updatedAt.toISOString(),
  }));

  const categories = await db
    .selectDistinct({ category: campusGallery.category })
    .from(campusGallery)
    .orderBy(campusGallery.category);

  const validCategories = categories
    .map((c) => c.category)
    .filter((c): c is string => !!c);

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
          <h1 className="text-2xl font-bold mt-1">Gallery</h1>
          <p className="text-sm text-gray-500">
            {rows.length} image{rows.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/campus/gallery/new"
          className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
        >
          + Add Image
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
          <label className="label-text">Category</label>
          <select name="category" defaultValue={categoryFilter} className="input-field">
            <option value="all">All</option>
            {validCategories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
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
            href="/admin/campus/gallery"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No gallery images found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((row) => (
            <GalleryRow key={row.id} image={row} />
          ))}
        </div>
      )}
    </div>
  );
}
