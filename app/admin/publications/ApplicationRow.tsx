// app/admin/publications/ApplicationRow.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  programme: string | null;
  year: number | null;
  publicationsMotivation: string | null;
  publicationsAppliedAt: Date | null;
}

interface Props {
  user: User;
  mode: 'pending' | 'approved' | 'rejected';
}

export function ApplicationRow({ user, mode }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (
      action === 'reject' &&
      !confirm(`Reject ${user.fullName}'s application?`)
    ) {
      return;
    }
    if (
      action === 'approve' &&
      !confirm(`Approve ${user.fullName} as a Publications Officer?`)
    ) {
      return;
    }

    setBusy(true);
    try {
      await fetch('/api/admin/publications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm(`Remove ${user.fullName} from the Publications Office?`)) return;
    setBusy(true);
    try {
      await fetch('/api/admin/publications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action: 'revoke' }),
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
          <p className="font-medium">{user.fullName}</p>
          <p className="text-sm text-gray-500">
            {user.email} · @{user.username}
          </p>
          {user.programme && (
            <p className="text-xs text-gray-400 mt-1">
              {user.programme} · Year {user.year || '?'}
            </p>
          )}
          {user.publicationsAppliedAt && (
            <p className="text-xs text-gray-400 mt-1">
              Applied {new Date(user.publicationsAppliedAt).toLocaleDateString()}
            </p>
          )}

          {user.publicationsMotivation && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowMotivation((v) => !v)}
                className="text-xs text-primary-green hover:underline"
              >
                {showMotivation ? 'Hide' : 'Show'} motivation
              </button>
              {showMotivation && (
                <div className="mt-2 border border-gray-200 bg-gray-50 p-3 text-sm whitespace-pre-wrap">
                  {user.publicationsMotivation}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {mode === 'pending' && (
            <>
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
            </>
          )}
          {mode === 'approved' && (
            <button
              onClick={handleRevoke}
              disabled={busy}
              className="border border-red-300 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
