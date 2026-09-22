// app/campus/gallery/page.tsx
import { db } from '@/lib/db';
import { campusGallery } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CampusGalleryPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category || '';

  const conditions: any[] = [eq(campusGallery.isPublished, true)];
  if (category) conditions.push(eq(campusGallery.category, category));

  const images = await db
    .select()
    .from(campusGallery)
    .where(and(...conditions))
    .orderBy(desc(campusGallery.createdAt));

  const categories = await db
    .selectDistinct({ category: campusGallery.category })
    .from(campusGallery)
    .where(eq(campusGallery.isPublished, true))
    .orderBy(campusGallery.category);

  const validCategories = categories
    .map((c) => c.category)
    .filter((c): c is string => !!c);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Campus Gallery</h1>
        <p className="text-muted-text mb-8">
          Explore City Campus through photographs.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/campus/gallery"
            className={`px-3 py-1 text-sm border transition-colors ${
              !category
                ? 'bg-primary-green text-white border-primary-green'
                : 'border-gray-300 hover:border-primary-green'
            }`}
          >
            All
          </Link>
          {validCategories.map((cat) => (
            <Link
              key={cat}
              href={`/campus/gallery?category=${cat}`}
              className={`px-3 py-1 text-sm border transition-colors capitalize ${
                category === cat
                  ? 'bg-primary-green text-white border-primary-green'
                  : 'border-gray-300 hover:border-primary-green'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="border border-gray-200 bg-white overflow-hidden hover:border-primary-green transition-colors"
              >
                <div className="aspect-square relative bg-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Campus image'}
                    className="w-full h-full object-cover"
                  />
                  {image.category && (
                    <span className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 capitalize">
                      {image.category}
                    </span>
                  )}
                </div>
                {image.title && (
                  <div className="p-2">
                    <p className="text-sm font-medium">{image.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 bg-white p-8 text-center">
            <p className="text-muted-text">
              {category
                ? `No images in "${category}" yet.`
                : 'No gallery images available yet.'}
            </p>
            {category && (
              <Link
                href="/campus/gallery"
                className="text-primary-green hover:underline text-sm mt-2 inline-block"
              >
                View all images →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
