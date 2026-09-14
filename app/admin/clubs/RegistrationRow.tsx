// app/admin/clubs/RegistrationRow.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Registration {
  id: string;
  clubName: string;
  category: string | null;
  description: string;
  proposedBy: string;
  contactEmail: string;
  contactPhone: string | null;
}

export function RegistrationRow({ registration }: { registration: Registration }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    const confirmMsg =
      action === 'approve'
        ? `Approve ${registration.clubName} and publish it?`
        : `Reject ${registration.clubName}?`;
    if (!confirm(confirmMsg)) return;

    setBusy(true);
    try {
      await fetch('/api/admin/clubs/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: registration.id, action }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium">{registration.clubName}</p>
          <p className="text-sm text-gray-500">
            By {registration.proposedBy} · {registration.contactEmail}
          </p>
          {registration.category && (
            <p className="text-xs text-gray-400 mt-1">{registration.category}</p>
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-primary-green hover:underline mt-2"
          >
            {expanded ? 'Hide' : 'Show'} details
          </button>

          {expanded && (
            <div className="mt-2 border border-gray-200 bg-gray-50 p-3 text-sm whitespace-pre-wrap">
              {registration.description}
              {registration.contactPhone && (
                <>
                  {'\n\nPhone: '}
                  {registration.contactPhone}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleAction('approve')}
            disabled={busy}
            className="bg-primary-green text-white px-3 py-1.5 text-xs font-medium hover:bg-deep-green disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction('reject')}
            disabled={busy}
            className="border border-red-300 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
