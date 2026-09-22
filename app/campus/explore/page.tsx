// app/campus/explore/page.tsx
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { eq, asc, ilike, or, and } from 'drizzle-orm';
import Link from 'next/link';
import { LocationGrid } from '@/components/campus/LocationGrid';
import { CampusSearch } from '@/components/campus/CampusSearch';

export const dynamic = 'force-dynamic';

export default async function CampusExplorePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const search = searchParams.search || '';
  const category = searchParams.category || '';

  const conditions: any[] = [eq(campusLocations.isPublished, true)];

  if (search) {
    conditions.push(
      or(
        ilike(campusLocations.name, `%${search}%`),
        ilike(campusLocations.description, `%${search}%`),
        ilike(campusLocations.shortDescription, `%${search}%`)
      )!
    );
  }

  if (category) {
    conditions.push(eq(campusLocations.category, category));
  }

  const locations = await db
    .select()
    .from(campusLocations)
    .where(and(...conditions))
    .orderBy(asc(campusLocations.sortOrder), asc(campusLocations.name));

  const categories = await db
    .selectDistinct({ category: campusLocations.category })
    .from(campusLocations)
    .where(eq(campusLocations.isPublished, true))
    .orderBy(campusLocations.category);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore Campus</h1>
          <p className="text-muted-text mt-2">
            Discover important places around City Campus.
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="max-w-2xl">
            <CampusSearch />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/campus/explore"
              className={`px-3 py-1 text-sm border transition-colors ${
                !category
                  ? 'bg-primary-green text-white border-primary-green'
                  : 'border-gray-300 hover:border-primary-green'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.category}
                href={`/campus/explore?category=${cat.category}`}
                className={`px-3 py-1 text-sm border transition-colors capitalize ${
                  category === cat.category
                    ? 'bg-primary-green text-white border-primary-green'
                    : 'border-gray-300 hover:border-primary-green'
                }`}
              >
                {cat.category}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {locations.length} location{locations.length !== 1 ? 's' : ''} found
            </h2>
          </div>
          <LocationGrid locations={locations} />
          {locations.length === 0 && (
            <div className="border border-gray-200 bg-white p-8 text-center">
              <p className="text-muted-text">
                No locations found matching your criteria.
              </p>
              <div className="mt-4">
                <Link
                  href="/campus/explore"
                  className="text-primary-green hover:underline text-sm"
                >
                  Clear Filters
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
