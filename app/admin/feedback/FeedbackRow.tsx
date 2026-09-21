// app/admin/feedback/FeedbackRow.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FeedbackData {
  id: string;
  content: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userName: string | null;
  userEmail: string | null;
  userUsername: string | null;
  isAnonymous: boolean;
}

const STATUS_OPTIONS = ['new', 'reviewed', 'resolved'] as const;

export function FeedbackRow({ feedback }: { feedback: FeedbackData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const updateStatus = async (status: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/feedback/${feedback.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this feedback? This cannot be undone.')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/feedback/${feedback.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const statusColor =
    feedback.status === 'resolved'
      ? 'bg-green-100 text-green-700'
      : feedback.status === 'reviewed'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-yellow-100 text-yellow-700';

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs px-2 py-0.5 ${statusColor}`}>
              {feedback.status}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5">
              {feedback.category}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(feedback.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
            {feedback.content}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {feedback.isAnonymous ? (
              <span className="italic">Anonymous</span>
            ) : (
              <>
                {feedback.userName || feedback.userUsername || 'Unknown'}{' '}
                {feedback.userEmail && (
                  <span className="text-gray-400">· {feedback.userEmail}</span>
                )}
              </>
            )}
          </p>
        </div>

        <div className="flex md:flex-col flex-wrap gap-2 md:items-end">
          <select
            value={feedback.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={busy}
            className="text-sm border border-gray-300 px-2 py-1 focus:border-primary-green focus:outline-none disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
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
