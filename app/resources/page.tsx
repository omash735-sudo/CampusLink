// app/resources/page.tsx
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq, and, desc, asc, ilike, or } from 'drizzle-orm';
import Link from 'next/link';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { getActiveResourceCategories } from '@/lib/resource-categories';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { q?: string; kind?: string; category?: string };
}) {
  const q = searchParams.q?.trim() || '';
  const kindFilter = searchParams.kind || 'all';
  const categoryFilter = searchParams.category || '';

  const categories = await getActiveResourceCategories();

  const conditions: any[] = [
    eq(resources.status, 'published'),
    or(eq(resources.resourceKind, 'document'), eq(resources.resourceKind, 'video'))!,
  ];

  if (kindFilter !== 'all') {
    conditions.push(eq(resources.resourceKind, kindFilter));
  }
  if (categoryFilter) {
    conditions.push(eq(resources.category, categoryFilter));
  }
  if (q) {
    conditions.push(
      or(
        ilike(resources.title, `%${q}%`),
        ilike(resources.description, `%${q}%`),
        ilike(resources.subject, `%${q}%`)
      )!
    );
  }

  const featured = await db
    .select()
    .from(resources)
    .where(and(...conditions, eq(resources.featured, true)))
    .orderBy(desc(resources.createdAt))
    .limit(3);

  const list = await db
    .select()
    .from(resources)
    .where(and(...conditions))
    .orderBy(asc(resources.title))
    .limit(50);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">
            Academic Library
          </h1>
          <p className="text-lg text-muted-text mt-2">
            Curated learning materials, presentations, documents and educational
            media for students.
          </p>
          <p className="text-sm text-muted-text mt-2">
            Looking for student news and features?{' '}
            <Link href="/publications" className="text-primary-green hover:underline">
              Visit Publications →
            </Link>
          </p>
        </div>

        <form className="bg-white border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label-text">Search</label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              className="input-field"
              placeholder="Search titles, subjects, descriptions..."
            />
          </div>
          <div>
            <label className="label-text">Content Type</label>
            <select name="kind" defaultValue={kindFilter} className="input-field">
              <option value="all">All</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
            </select>
          </div>
          <div>
            <label className="label-text">Category</label>
            <select
              name="category"
              defaultValue={categoryFilter}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
            Search
          </button>
          <Link
            href="/resources"
            className="border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Clear
          </Link>
        </form>

        {featured.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4">
            {list.length} resource{list.length !== 1 ? 's' : ''}
          </h2>
          {list.length === 0 ? (
            <div className="border border-gray-200 bg-white p-8 text-center">
              <p className="text-muted-text">No resources match your filters.</p>
              <Link
                href="/resources"
                className="text-primary-green hover:underline text-sm mt-2 inline-block"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-text mt-12">
          CampusLink is an independent student platform. Materials shown here are
          either publicly available, CampusLink originals, or shared with
          permission.{' '}
          <Link href="/resources/policy" className="hover:underline">
            Learn more
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
