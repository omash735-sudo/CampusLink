// app/campus/gallery/page.tsx
import { db } from '@/lib/db';
import { campusGallery } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Image from 'next/image';

export default async function CampusGalleryPage() {
  const images = await db
    .select()
    .from(campusGallery)
    .where(eq(campusGallery.isPublished, true))
    .orderBy(desc(campusGallery.createdAt));

  const categories = await db
    .selectDistinct({
      category: campusGallery.category,
    })
    .from(campusGallery)
    .where(eq(campusGallery.isPublished, true))
    .orderBy(campusGallery.category);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Campus Gallery</h1>
        <p className="text-muted-text mb-8">
          Explore City Campus through photographs.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 text-sm bg-primary-green text-white">All</span>
          {categories.map((cat) => (
            <span key={cat.category} className="px-3 py-1 text-sm border border-gray-300">
              {cat.category}
            </span>
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
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Campus image'}
                    className="w-full h-full object-cover"
                  />
                  {image.category && (
                    <span className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5">
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
            <p className="text-muted-text">No gallery images available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
