// app/admin/mentors/applications/ApplicationRow.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  mentorId: string;
  userId: string;
  fullName: string;
  username: string;
  email: string;
  programme: string | null;
  year: number | null;
  mentorType: string | null;
  introduction: string | null;
  experience: string | null;
  expertise: string[];
  subjects: string[];
  createdAt: string;
}

export function ApplicationRow(props: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (action === 'approve' && !confirm(`Approve ${props.fullName} as a mentor?`)) {
      return;
    }

    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/mentors/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: props.userId,
          action,
          reason: action === 'reject' ? rejectReason.trim() || undefined : undefined,
        }),
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

  const initials = props.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">{props.fullName}</h3>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5">
                  Pending
                </span>
                {props.mentorType && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5">
                    {props.mentorType}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {props.programme || 'No programme'}{' '}
                {props.year ? `• Year ${props.year}` : ''}
              </p>
              <p className="text-sm text-gray-500">@{props.username}</p>
              <p className="text-xs text-gray-400 mt-1">
                {props.email} · Applied{' '}
                {new Date(props.createdAt).toLocaleDateString()}
              </p>

              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="text-xs text-primary-green hover:underline mt-2"
              >
                {showDetails ? 'Hide' : 'Show'} full application
              </button>

              {showDetails && (
                <div className="mt-3 space-y-3 border border-gray-100 bg-gray-50 p-3 text-sm">
                  {props.introduction && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Introduction
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{props.introduction}</p>
                    </div>
                  )}
                  {props.experience && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Experience
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{props.experience}</p>
                    </div>
                  )}
                  {props.expertise.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Expertise
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {props.expertise.map((e) => (
                          <span key={e} className="text-xs bg-white border border-gray-200 px-2 py-0.5">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {props.subjects.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Subjects
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {props.subjects.map((s) => (
                          <span key={s} className="text-xs bg-white border border-gray-200 px-2 py-0.5">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          {showRejectInput ? (
            <div className="w-full md:w-64">
              <textarea
                rows={2}
                className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
                placeholder="Reason for rejection (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAction('reject')}
                  disabled={busy}
                  className="bg-red-600 text-white px-3 py-1.5 text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {busy ? 'Sending...' : 'Confirm Reject'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectInput(false);
                    setRejectReason('');
                  }}
                  className="border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAction('approve')}
                disabled={busy}
                className="bg-green-600 text-white px-4 py-1.5 text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={busy}
                className="border border-red-300 text-red-600 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <Link
                href={`/admin/mentors/${props.mentorId}`}
                className="text-primary-green hover:underline text-sm px-2 py-1.5"
              >
                Details
              </Link>
            </div>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
