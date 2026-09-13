// app/admin/student-union/MemberRow.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Member {
  id: string;
  fullName: string;
  position: string;
  photoUrl: string | null;
  email: string | null;
  whatsapp: string | null;
  academicYear: string;
  sortOrder: number;
  isActive: boolean;
}

export function MemberRow({ member }: { member: Member }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggleActive = async () => {
    setBusy(true);
    try {
      await fetch(`/api/admin/student-union/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: member.fullName,
          position: member.position,
          description: null,
          photoUrl: member.photoUrl,
          email: member.email,
          whatsapp: member.whatsapp,
          academicYear: member.academicYear,
          sortOrder: member.sortOrder,
          isActive: !member.isActive,
        }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${member.fullName}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/student-union/${member.id}`, {
        method: 'DELETE',
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 flex items-center gap-4">
      {member.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.photoUrl}
          alt={member.fullName}
          className="h-14 w-14 rounded-full object-cover border border-gray-200 flex-shrink-0"
        />
      ) : (
        <div className="h-14 w-14 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
          {member.fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium">{member.fullName}</p>
          {!member.isActive && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5">
              Hidden
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{member.position}</p>
        <div className="text-xs text-gray-400 flex gap-3 mt-1">
          {member.email && <span>{member.email}</span>}
          {member.whatsapp && <span>{member.whatsapp}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={toggleActive}
          disabled={busy}
          className="text-xs border border-gray-300 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
        >
          {member.isActive ? 'Hide' : 'Show'}
        </button>
        <Link
          href={`/admin/student-union/${member.id}/edit`}
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
