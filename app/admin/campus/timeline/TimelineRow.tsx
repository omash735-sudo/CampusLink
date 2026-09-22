// app/admin/campus/timeline/TimelineRow.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TimelineData {
  id: string;
  year: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  source: string | null;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

export function TimelineRow({ entry }: { entry: TimelineData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const togglePublished = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/campus/timeline/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !entry.isPublished }),
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
    if (!confirm(`Delete "${entry.title}" (${entry.year})? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/campus/timeline/${entry.id}`, {
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
          {entry.imageUrl ? (
            <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.imageUrl}
                alt={entry.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
              No img
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-primary-green">
                {entry.year}
              </span>
              <h3 className="font-semibold">{entry.title}</h3>
              {entry.isPublished ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">
                  Published
                </span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5">
                  Draft
                </span>
              )}
            </div>
            {entry.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {entry.description}
              </p>
            )}
            {entry.source && (
              <p className="text-xs text-gray-400 mt-1">Source: {entry.source}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-col gap-2 md:items-end md:flex-shrink-0">
          <Link
            href={`/admin/campus/timeline/${entry.id}`}
            className="text-sm text-primary-green hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={togglePublished}
            disabled={busy}
            className={`text-sm disabled:opacity-50 ${
              entry.isPublished
                ? 'text-orange-600 hover:text-orange-800'
                : 'text-green-600 hover:text-green-800'
            }`}
          >
            {entry.isPublished ? 'Unpublish' : 'Publish'}
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
