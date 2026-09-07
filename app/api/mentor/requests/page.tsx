// app/mentor/requests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { requireMentor } from '@/lib/auth';

interface Request {
  id: string;
  message: string;
  createdAt: string;
  student: {
    fullName: string;
    username: string;
    programme: string;
    year: number;
    avatar: string | null;
  };
}

export default function MentorRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mentor/requests?status=${filter}`);
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    
    setProcessing(id);
    try {
      const res = await fetch(`/api/mentors/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (res.ok) {
        await loadRequests();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to process request');
      }
    } catch (error) {
      console.error('Failed to process:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 p-4">
                <div className="flex justify-between">
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mentorship Requests</h1>
          <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1">
            {requests.filter(r => r.status === 'pending').length} pending
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['pending', 'accepted', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm border transition-colors ${
                filter === status
                  ? 'bg-primary-green text-white border-primary-green'
                  : 'border-gray-200 hover:border-primary-green'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Requests */}
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 p-6 hover:border-primary-green transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                        {request.student?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{request.student?.fullName || 'Unknown'}</h3>
                          <span className={`text-xs px-2 py-0.5 ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-text">{request.student?.programme || 'No programme'} • Year {request.student?.year || '?'}</p>
                        {request.message && (
                          <p className="text-sm text-muted-text mt-2">{request.message}</p>
                        )}
                        <p className="text-xs text-muted-text mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(request.id, 'accept')}
                        disabled={processing === request.id}
                        className="bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {processing === request.id ? 'Processing...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleAction(request.id, 'decline')}
                        disabled={processing === request.id}
                        className="border border-red-300 text-red-600 px-4 py-2 text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {processing === request.id ? 'Processing...' : 'Decline'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 p-8 text-center">
              <p className="text-muted-text">No mentorship requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
