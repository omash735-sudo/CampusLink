// app/campus/page.tsx
import { db } from '@/lib/db';
import { campusLocations, campusTimeline, campusGallery } from '@/lib/db/schema';
import { eq, desc, asc, sql } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { CampusSearch } from '@/components/campus/CampusSearch';
import { LocationGrid } from '@/components/campus/LocationGrid';
import { CampusHero } from '@/components/campus/CampusHero';

export default async function CampusPage() {
  const featuredLocations = await db
    .select()
    .from(campusLocations)
    .where(eq(campusLocations.isFeatured, true))
    .orderBy(asc(campusLocations.sortOrder))
    .limit(6);

  const categories = await db
    .select({
      category: campusLocations.category,
      count: sql<number>`count(*)`,
    })
    .from(campusLocations)
    .where(eq(campusLocations.isPublished, true))
    .groupBy(campusLocations.category)
    .orderBy(campusLocations.category);

  const recentTimeline = await db
    .select()
    .from(campusTimeline)
    .where(eq(campusTimeline.isPublished, true))
    .orderBy(desc(campusTimeline.year))
    .limit(3);

  const recentGallery = await db
    .select()
    .from(campusGallery)
    .where(eq(campusGallery.isPublished, true))
    .orderBy(desc(campusGallery.createdAt))
    .limit(6);

  return (
    <div className="min-h-screen bg-off-white">
      <CampusHero />

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">About City Campus</h2>
            <p className="text-muted-text">
              City Campus is the urban hub of the university, offering modern facilities, 
              a vibrant student community, and a conducive learning environment in the heart of the city.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-xs bg-gray-100 px-3 py-1">Located in the city centre</span>
              <span className="text-xs bg-gray-100 px-3 py-1">Urban Campus</span>
              <span className="text-xs bg-gray-100 px-3 py-1">Modern Facilities</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-off-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link
              href="/campus/explore"
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <div className="text-2xl mb-1">Building</div>
              <div className="font-medium text-sm">Explore Campus</div>
              <div className="text-xs text-muted-text">Browse locations</div>
            </Link>
            <Link
              href="/campus/map"
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <div className="text-2xl mb-1">Map</div>
              <div className="font-medium text-sm">Campus Map</div>
              <div className="text-xs text-muted-text">Find your way</div>
            </Link>
            <Link
              href="/campus/gallery"
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <div className="text-2xl mb-1">Gallery</div>
              <div className="font-medium text-sm">Gallery</div>
              <div className="text-xs text-muted-text">Campus photos</div>
            </Link>
            <Link
              href="/campus/history"
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <div className="text-2xl mb-1">History</div>
              <div className="font-medium text-sm">History</div>
              <div className="text-xs text-muted-text">Our story</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-lg font-semibold mb-3 text-center">Looking for something?</h2>
          <CampusSearch />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.category}
                href={`/campus/explore?category=${cat.category}`}
                className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors"
              >
                <h3 className="font-semibold capitalize">{cat.category}</h3>
                <p className="text-sm text-muted-text">{cat.count} locations</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredLocations.length > 0 && (
        <section className="py-12 bg-white border-y border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Locations</h2>
              <Link href="/campus/explore" className="text-primary-green hover:underline text-sm">
                View all →
              </Link>
            </div>
            <LocationGrid locations={featuredLocations} />
          </div>
        </section>
      )}

      {recentGallery.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Campus Gallery</h2>
              <Link href="/campus/gallery" className="text-primary-green hover:underline text-sm">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {recentGallery.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square border border-gray-200 bg-gray-100 overflow-hidden hover:border-primary-green transition-colors"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Campus image'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {recentTimeline.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Campus History</h2>
              <Link href="/campus/history" className="text-primary-green hover:underline text-sm">
                View timeline →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTimeline.map((entry) => (
                <div key={entry.id} className="border border-gray-200 bg-white p-4">
                  <div className="text-2xl font-bold text-primary-green">{entry.year}</div>
                  <h3 className="font-semibold mt-1">{entry.title}</h3>
                  {entry.description && (
                    <p className="text-sm text-muted-text mt-1 line-clamp-2">{entry.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
