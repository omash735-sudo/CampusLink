// app/admin/campus/gallery/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { campusGallery, campusLocations } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';
import { GalleryForm, GalleryFormData } from '../GalleryForm';

export const dynamic = 'force-dynamic';

export default async function EditCampusGalleryPage({
  params,
}: {
  params: { id: string };
}) {
  const [image] = await db
    .select()
    .from(campusGallery)
    .where(eq(campusGallery.id, params.id))
    .limit(1);

  if (!image) notFound();

  const locations = await db
    .select({ id: campusLocations.id, name: campusLocations.name })
    .from(campusLocations)
    .where(eq(campusLocations.isPublished, true))
    .orderBy(asc(campusLocations.name));

  const initial: GalleryFormData = {
    id: image.id,
    title: image.title ?? '',
    imageUrl: image.imageUrl,
    category: image.category ?? '',
    description: image.description ?? '',
    locationId: image.locationId ?? '',
    isPublished: image.isPublished ?? true,
    sortOrder: image.sortOrder ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campus/gallery"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Gallery
        </Link>
        <div className="flex items-center justify-between gap-4 mt-1">
          <h1 className="text-2xl font-bold">
            {image.title || 'Untitled image'}
          </h1>
          {image.isPublished && (
            <a
              href="/campus/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-green hover:underline"
            >
              View public page →
            </a>
          )}
        </div>
      </div>

      <GalleryForm initial={initial} locations={locations} />
    </div>
  );
}
