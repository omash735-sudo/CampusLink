// app/admin/campus/gallery/GalleryRow.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface GalleryData {
  id: string;
  title: string | null;
  imageUrl: string;
  category: string | null;
  description: string | null;
  locationId: string | null;
  locationName: string | null;
  locationSlug: string | null;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

export function GalleryRow({ image }: { image: GalleryData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const togglePublished = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/campus/gallery/${image.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !image.isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/campus/gallery/${image.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden group">
      {/* Image */}
      <div className="aspect-square relative bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.imageUrl}
          alt={image.title || 'Campus image'}
          className="w-full h-full object-cover"
        />

        {/* Status badge */}
        <div className="absolute top-2 left-2 flex gap-1">
          {image.isPublished ? (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">
              Published
            </span>
          ) : (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5">
              Draft
            </span>
          )}
        </div>

        {image.category && (
          <span className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 capitalize">
            {image.category}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-3 space-y-2">
        <div>
          {image.title ? (
            <p className="text-sm font-medium line-clamp-1">{image.title}</p>
          ) : (
            <p className="text-sm italic text-gray-400">Untitled</p>
          )}

          {image.locationName && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              <span className="text-gray-400">Location:</span>{' '}
              {image.locationName}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-sm pt-2 border-t border-gray-100">
          <Link
            href={`/admin/campus/gallery/${image.id}`}
            className="text-primary-green hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={togglePublished}
            disabled={busy}
            className={`disabled:opacity-50 ${
              image.isPublished
                ? 'text-orange-600 hover:text-orange-800'
                : 'text-green-600 hover:text-green-800'
            }`}
          >
            {image.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={handleDelete}
            disabled={busy}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
