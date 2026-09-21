// app/admin/mentorships/MentorshipRow.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MentorshipData {
  id: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  lastInteraction: string | null;
  mentorId: string;
  studentId: string;
  mentorName: string | null;
  mentorUsername: string | null;
  studentName: string | null;
  studentUsername: string | null;
  studentProgramme: string | null;
  studentYear: number | null;
}

function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
}

export function MentorshipRow({ mentorship }: { mentorship: MentorshipData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleEnd = async () => {
    if (!confirm('End this mentorship? The student will still see it under "Previous Mentorships".')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/mentorships/${mentorship.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end' }),
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

  const statusColor =
    mentorship.status === 'active'
      ? 'bg-green-100 text-green-700'
      : mentorship.status === 'completed'
      ? 'bg-gray-100 text-gray-600'
      : 'bg-yellow-100 text-yellow-700';

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Status + timestamps */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={`text-xs px-2 py-0.5 ${statusColor}`}>
              {mentorship.status}
            </span>
            <span className="text-xs text-gray-400">
              Started {new Date(mentorship.startedAt).toLocaleDateString()}
            </span>
            {mentorship.endedAt && (
              <span className="text-xs text-gray-400">
                · Ended {new Date(mentorship.endedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Mentor → Student relationship */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {/* Mentor */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 flex-shrink-0">
                {initials(mentorship.mentorName)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {mentorship.mentorName || 'Unknown mentor'}
                </p>
                {mentorship.mentorUsername && (
                  <Link
                    href={`/profile/${mentorship.mentorUsername}`}
                    className="text-xs text-primary-green hover:underline"
                  >
                    @{mentorship.mentorUsername}
                  </Link>
                )}
              </div>
            </div>

            <span className="text-gray-400 text-sm hidden sm:inline">→</span>

            {/* Student */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-primary-green/10 flex items-center justify-center text-xs font-semibold text-primary-green flex-shrink-0">
                {initials(mentorship.studentName)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {mentorship.studentName || 'Unknown student'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {mentorship.studentProgramme || 'No programme'}
                  {mentorship.studentYear ? ` • Year ${mentorship.studentYear}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex md:flex-col gap-2 md:items-end shrink-0">
          {mentorship.studentUsername && (
            <Link
              href={`/profile/${mentorship.studentUsername}`}
              className="text-sm text-primary-green hover:underline"
            >
              View student
            </Link>
          )}
          {mentorship.status === 'active' && (
            <button
              onClick={handleEnd}
              disabled={busy}
              className="text-sm text-orange-600 hover:text-orange-800 disabled:opacity-50"
            >
              {busy ? 'Ending…' : 'End'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
