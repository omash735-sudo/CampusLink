// app/campus/locations/[slug]/page.tsx
import { db } from '@/lib/db';
import { campusLocations, campusLocationNearby, campusGallery } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function CampusLocationPage({ params }: { params: { slug: string } }) {
  const location = await db
    .select()
    .from(campusLocations)
    .where(and(
      eq(campusLocations.slug, params.slug),
      eq(campusLocations.isPublished, true)
    ))
    .then(res => res[0]);

  if (!location) {
    notFound();
  }

  const nearby = await db
    .select({
      nearby: campusLocations,
    })
    .from(campusLocationNearby)
    .leftJoin(campusLocations, eq(campusLocationNearby.nearbyLocationId, campusLocations.id))
    .where(eq(campusLocationNearby.locationId, location.id))
    .then(res => res.map(r => r.nearby));

  const gallery = await db
    .select()
    .from(campusGallery)
    .where(and(
      eq(campusGallery.locationId, location.id),
      eq(campusGallery.isPublished, true)
    ))
    .orderBy(campusGallery.sortOrder);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/campus/explore" className="text-primary-green hover:underline text-sm">
          ← Back to Campus
        </Link>

        <div className="bg-white border border-gray-200 mt-4 overflow-hidden">
          <div className="relative h-80 bg-gray-200">
            {location.imageUrl ? (
              <Image
                src={location.imageUrl}
                alt={location.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-text">
                No image available
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{location.name}</h1>
              <span className="text-sm bg-gray-100 px-3 py-1 capitalize">{location.category}</span>
            </div>

            {location.shortDescription && (
              <p className="text-muted-text text-lg">{location.shortDescription}</p>
            )}

            {location.description && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-muted-text">{location.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {location.address && (
                <div className="border border-gray-200 p-4">
                  <h3 className="font-semibold text-sm">Address</h3>
                  <p className="text-muted-text text-sm">{location.address}</p>
                </div>
              )}
              {location.openingHours && (
                <div className="border border-gray-200 p-4">
                  <h3 className="font-semibold text-sm">Opening Hours</h3>
                  <p className="text-muted-text text-sm">{location.openingHours}</p>
                </div>
              )}
              {location.contactInfo && (
                <div className="border border-gray-200 p-4">
                  <h3 className="font-semibold text-sm">Contact</h3>
                  <p className="text-muted-text text-sm">{location.contactInfo}</p>
                </div>
              )}
              {location.accessibilityInfo && (
                <div className="border border-gray-200 p-4">
                  <h3 className="font-semibold text-sm">Accessibility</h3>
                  <p className="text-muted-text text-sm">{location.accessibilityInfo}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <Link
                href={`/campus/map?location=${location.slug}`}
                className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors"
              >
                Get Directions
              </Link>
            </div>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((image) => (
                <div key={image.id} className="aspect-square border border-gray-200 bg-gray-100 overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title || location.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {nearby.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Nearby Locations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nearby.map((nearbyLocation) => (
                nearbyLocation && (
                  <Link
                    key={nearbyLocation.id}
                    href={`/campus/locations/${nearbyLocation.slug}`}
                    className="border border-gray-200 bg-white p-4 hover:border-primary-green transition-colors"
                  >
                    <h3 className="font-semibold">{nearbyLocation.name}</h3>
                    <p className="text-sm text-muted-text capitalize">{nearbyLocation.category}</p>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
