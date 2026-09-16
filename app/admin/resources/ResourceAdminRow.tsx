// app/admin/resources/ResourceAdminRow.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Resource {
  id: string;
  resourceKind: string;
  title: string;
  category: string | null;
  status: string;
  featured: boolean;
  updatedAt: Date;
  youtubeVideoId: string | null;
  fileName: string | null;
}

const KIND_LABEL: Record<string, string> = {
  document: 'Document',
  video: 'Video',
  article: 'Article',
  publication: 'Publication',
};

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-600',
};

export function ResourceAdminRow({ resource }: { resource: Resource }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const updateStatus = async (status: 'draft' | 'published' | 'archived') => {
    setBusy(true);
    try {
      await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggleFeatured = async () => {
    setBusy(true);
    try {
      await fetch(`/api/admin/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !resource.featured }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${resource.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/resources/${resource.id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-gray-100 px-2 py-0.5">
            {KIND_LABEL[resource.resourceKind] || resource.resourceKind}
          </span>
          <span className={`text-xs px-2 py-0.5 ${STATUS_COLOR[resource.status] || ''}`}>
            {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
          </span>
          {resource.featured && (
            <span className="text-xs bg-primary-green/10 text-primary-green px-2 py-0.5">
              Featured
            </span>
          )}
        </div>
        <p className="font-medium truncate mt-1">{resource.title}</p>
        <p className="text-xs text-gray-400">
          {resource.category || 'No category'} · Updated{' '}
          {new Date(resource.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
        <button
          onClick={toggleFeatured}
          disabled={busy}
          className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
        >
          {resource.featured ? 'Unfeature' : 'Feature'}
        </button>
        {resource.status === 'draft' && (
          <button
            onClick={() => updateStatus('published')}
            disabled={busy}
            className="text-xs bg-green-600 text-white px-3 py-1.5 hover:bg-green-700 disabled:opacity-50"
          >
            Publish
          </button>
        )}
        {resource.status === 'published' && (
          <button
            onClick={() => updateStatus('archived')}
            disabled={busy}
            className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
          >
            Archive
          </button>
        )}
        {resource.status === 'archived' && (
          <button
            onClick={() => updateStatus('published')}
            disabled={busy}
            className="text-xs border border-green-300 text-green-700 px-3 py-1.5 hover:bg-green-50 disabled:opacity-50"
          >
            Republish
          </button>
        )}
        <Link
          href={`/admin/resources/${resource.id}/edit`}
          className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
        >
          Edit
        </Link>
        <Link
          href={`/resources/${resource.id}`}
          target="_blank"
          className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
        >
          Preview
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
