// app/admin/campus/gallery/new/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';
import { GalleryForm } from '../GalleryForm';

export const dynamic = 'force-dynamic';

export default async function NewCampusGalleryPage() {
  const locations = await db
    .select({ id: campusLocations.id, name: campusLocations.name })
    .from(campusLocations)
    .where(eq(campusLocations.isPublished, true))
    .orderBy(asc(campusLocations.name));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campus/gallery"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Gallery
        </Link>
        <h1 className="text-2xl font-bold mt-1">Add Image</h1>
        <p className="text-sm text-gray-500">
          Upload a photograph. Optionally link it to a campus location.
        </p>
      </div>

      <GalleryForm locations={locations} />
    </div>
  );
}
