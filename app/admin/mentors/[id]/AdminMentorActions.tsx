// app/admin/mentors/[id]/AdminMentorActions.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  mentorId: string;
  userId: string;
  currentStatus: string;
}

export function AdminMentorActions({ mentorId, userId, currentStatus }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const setStatus = async (status: 'approved' | 'pending' | 'rejected') => {
    const label =
      status === 'approved'
        ? 'reactivate'
        : status === 'rejected'
        ? 'suspend'
        : 'mark as pending';
    if (!confirm(`Are you sure you want to ${label} this mentor?`)) return;

    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/mentors/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        {currentStatus === 'approved' ? (
          <button
            onClick={() => setStatus('rejected')}
            disabled={busy}
            className="border border-red-300 text-red-600 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {busy ? 'Updating...' : 'Suspend'}
          </button>
        ) : currentStatus === 'rejected' ? (
          <button
            onClick={() => setStatus('approved')}
            disabled={busy}
            className="border border-green-300 text-green-700 px-4 py-1.5 text-sm hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            {busy ? 'Updating...' : 'Reactivate'}
          </button>
        ) : null}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}
