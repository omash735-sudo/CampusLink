// app/admin/campus/locations/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { LocationForm, LocationFormData } from '../LocationForm';

export const dynamic = 'force-dynamic';

export default async function EditCampusLocationPage({
  params,
}: {
  params: { id: string };
}) {
  const [location] = await db
    .select()
    .from(campusLocations)
    .where(eq(campusLocations.id, params.id))
    .limit(1);

  if (!location) notFound();

  const initial: LocationFormData = {
    id: location.id,
    name: location.name,
    slug: location.slug,
    category: location.category,
    shortDescription: location.shortDescription ?? '',
    description: location.description ?? '',
    address: location.address ?? '',
    openingHours: location.openingHours ?? '',
    contactInfo: location.contactInfo ?? '',
    accessibilityInfo: location.accessibilityInfo ?? '',
    imageUrl: location.imageUrl ?? '',
    isFeatured: location.isFeatured ?? false,
    isPublished: location.isPublished ?? false,
    sortOrder: location.sortOrder ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campus/locations"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Locations
        </Link>
        <div className="flex items-center justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl font-bold">{location.name}</h1>
            <p className="text-sm text-gray-500 font-mono">
              /campus/locations/{location.slug}
            </p>
          </div>
          {location.isPublished && (
            <a
              href={`/campus/locations/${location.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-green hover:underline"
            >
              View public page →
            </a>
          )}
        </div>
      </div>

      <LocationForm initial={initial} />
    </div>
  );
}
