// app/mentor/requests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Request {
  id: string;
  message: string | null;
  introduction: string | null;
  helpNeeded: string[] | null;
  status: string;
  createdAt: string;
  student: {
    id: string;
    fullName: string;
    username: string;
    programme: string | null;
    year: number | null;
    avatar: string | null;
  };
}

export default function MentorRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentors/request');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    if (!confirm(`${action === 'accept' ? 'Accept' : 'Decline'} this request?`)) return;
    setBusyId(id);
    setError('');
    try {
      const res = await fetch('/api/mentors/request', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      await loadRequests();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/mentor" className="text-primary-green hover:underline text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">Mentorship Requests</h1>
          </div>
          {pendingCount > 0 && (
            <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1">
              {pendingCount} pending
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'accepted', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm border transition-colors ${
                filter === status
                  ? 'bg-primary-green text-white border-primary-green'
                  : 'border-gray-200 hover:border-primary-green bg-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-muted-text">Loading requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const initials = request.student.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={request.id}
                  className="bg-white border border-gray-200 p-6 hover:border-primary-green transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{request.student.fullName}</h3>
                            <span
                              className={`text-xs px-2 py-0.5 ${
                                request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : request.status === 'accepted'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-text">
                            {request.student.programme} • Year {request.student.year}
                          </p>
                          {request.message && (
                            <p className="text-sm text-muted-text mt-2">{request.message}</p>
                          )}
                          {request.helpNeeded && request.helpNeeded.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {request.helpNeeded.map((h) => (
                                <span
                                  key={h}
                                  className="text-xs bg-primary-green/10 text-primary-green px-2 py-0.5"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-text mt-2">
                            Received {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAction(request.id, 'accept')}
                          disabled={busyId === request.id}
                          className="bg-green-600 text-white px-4 py-1.5 text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(request.id, 'decline')}
                          disabled={busyId === request.id}
                          className="border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-muted-text">No mentorship requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
