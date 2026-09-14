// app/admin/clubs/ClubRow.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Club {
  id: string;
  name: string;
  category: string | null;
  description: string;
  logoUrl: string | null;
  isActive: boolean;
}

export function ClubRow({ club }: { club: Club }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${club.name}?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/clubs/${club.id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 flex items-center gap-4">
      {club.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={club.logoUrl}
          alt={club.name}
          className="h-12 w-12 object-cover border border-gray-200 flex-shrink-0"
        />
      ) : (
        <div className="h-12 w-12 bg-primary-green/10 flex items-center justify-center text-primary-green font-bold flex-shrink-0">
          {club.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium">{club.name}</p>
        <p className="text-sm text-gray-500 truncate">
          {club.category || 'No category'}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/admin/clubs/${club.id}/edit`}
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
