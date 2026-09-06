// app/campus/map/page.tsx
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import Link from 'next/link';

export default async function CampusMapPage() {
  const locations = await db
    .select()
    .from(campusLocations)
    .where(eq(campusLocations.isPublished, true))
    .orderBy(asc(campusLocations.name));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Campus Map</h1>
        <p className="text-muted-text mb-8">
          Find your way around City Campus. Select a location to view details.
        </p>

        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="aspect-video bg-gray-200 flex items-center justify-center text-muted-text">
            Interactive map placeholder
            <br />
            <span className="text-sm">Map integration coming soon</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Locations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/campus/locations/${location.slug}`}
              className="border border-gray-200 bg-white p-4 hover:border-primary-green transition-colors"
            >
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm text-muted-text capitalize">{location.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
