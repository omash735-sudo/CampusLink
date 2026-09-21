// app/mentorship/EndMentorshipButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function EndMentorshipButton({
  mentorshipId,
}: {
  mentorshipId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/mentorship/${mentorshipId}/end`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to end mentorship');
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
      setBusy(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-muted-text">Are you sure?</span>
        <button
          onClick={handleConfirm}
          disabled={busy}
          className="text-red-600 hover:underline font-medium disabled:opacity-50"
        >
          {busy ? 'Ending…' : 'Yes, end it'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="text-muted-text hover:underline"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-red-600 hover:underline"
    >
      End Mentorship
    </button>
  );
}
