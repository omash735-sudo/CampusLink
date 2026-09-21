// app/admin/campus/locations/LocationRow.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LocationData {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

export function LocationRow({ location }: { location: LocationData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggleField = async (field: 'isPublished' | 'isFeatured') => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/campus/locations/${location.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !location[field] }),
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
    if (
      !confirm(
        `Delete "${location.name}"? This cannot be undone and will remove it from the public site.`
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/campus/locations/${location.id}`, {
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
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {/* Thumbnail */}
          <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
            {location.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={location.imageUrl}
                alt={location.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No img
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{location.name}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 capitalize">
                {location.category}
              </span>
              {location.isPublished ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">
                  Published
                </span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5">
                  Draft
                </span>
              )}
              {location.isFeatured && (
                <span className="text-xs bg-primary-green/10 text-primary-green px-2 py-0.5">
                  Featured
                </span>
              )}
            </div>
            {location.shortDescription && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {location.shortDescription}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1 font-mono">
              /campus/locations/{location.slug}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-col gap-2 md:items-end md:flex-shrink-0">
          <Link
            href={`/admin/campus/locations/${location.id}`}
            className="text-sm text-primary-green hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={() => toggleField('isPublished')}
            disabled={busy}
            className={`text-sm disabled:opacity-50 ${
              location.isPublished
                ? 'text-orange-600 hover:text-orange-800'
                : 'text-green-600 hover:text-green-800'
            }`}
          >
            {location.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => toggleField('isFeatured')}
            disabled={busy}
            className={`text-sm disabled:opacity-50 ${
              location.isFeatured
                ? 'text-gray-500 hover:text-gray-700'
                : 'text-primary-green hover:underline'
            }`}
          >
            {location.isFeatured ? 'Unfeature' : 'Feature'}
          </button>
          <button
            onClick={handleDelete}
            disabled={busy}
            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
