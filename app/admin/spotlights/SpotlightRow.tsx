// app/admin/spotlights/SpotlightRow.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Spotlight {
  id: string;
  studentName: string;
  programme: string | null;
  year: number | null;
  bio: string;
  graphicUrl: string | null;
  tags: string[] | null;
  isPublished: boolean;
  sortOrder: number | null;
}

export function SpotlightRow({ spotlight }: { spotlight: Spotlight }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const togglePublish = async () => {
    setBusy(true);
    try {
      await fetch(`/api/admin/spotlights/${spotlight.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: spotlight.studentName,
          programme: spotlight.programme,
          year: spotlight.year,
          bio: spotlight.bio,
          graphicUrl: spotlight.graphicUrl,
          tags: spotlight.tags || [],
          achievement: null,
          isPublished: !spotlight.isPublished,
          sortOrder: spotlight.sortOrder ?? 0,
        }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete spotlight for ${spotlight.studentName}?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/spotlights/${spotlight.id}`, {
        method: 'DELETE',
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 flex items-center gap-4">
      {spotlight.graphicUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={spotlight.graphicUrl}
          alt={spotlight.studentName}
          className="w-12 h-16 object-cover border border-gray-200 flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-16 bg-primary-green/10 flex items-center justify-center text-xs text-primary-green flex-shrink-0">
          No graphic
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium">{spotlight.studentName}</p>
          {!spotlight.isPublished && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5">
              Draft
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">
          {spotlight.programme || '—'}
          {spotlight.year ? ` · Year ${spotlight.year}` : ''}
        </p>
        {spotlight.tags && spotlight.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {spotlight.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary-green/10 text-primary-green px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={togglePublish}
          disabled={busy}
          className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
        >
          {spotlight.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <Link
          href={`/admin/spotlights/${spotlight.id}/edit`}
          className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={busy}
          className="text-xs border border-red-300 text-red-600 px-3 py-1.5 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
