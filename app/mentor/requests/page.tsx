// app/mentor/requests/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockRequests = [
  {
    id: '1',
    student: 'Jane Mwale',
    programme: 'Social Work & Youth Development',
    year: 2,
    topic: 'Academic Support',
    message: 'I need help with my research methods course. I\'m struggling with understanding the concepts and would appreciate guidance.',
    date: '2026-09-05',
    status: 'pending',
    avatar: null
  },
  {
    id: '2',
    student: 'John Banda',
    programme: 'Agricultural Economics',
    year: 3,
    topic: 'Career Guidance',
    message: 'I want to explore career options in agribusiness. Could you share some insights from your experience?',
    date: '2026-09-04',
    status: 'pending',
    avatar: null
  },
  {
    id: '3',
    student: 'Sarah Phiri',
    programme: 'Food Science',
    year: 1,
    topic: 'University Life',
    message: 'I need help adjusting to university life. It\'s been overwhelming and I could use some guidance.',
    date: '2026-09-03',
    status: 'accepted',
    avatar: null
  },
  {
    id: '4',
    student: 'David Nkhoma',
    programme: 'Environmental Science',
    year: 2,
    topic: 'Research Methods',
    message: 'I need help with my research proposal. I\'m not sure if I\'m on the right track.',
    date: '2026-09-01',
    status: 'declined',
    avatar: null
  }
];

export default function MentorRequestsPage() {
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const filteredRequests = mockRequests.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mentorship Requests</h1>
          <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1">
            {mockRequests.filter(r => r.status === 'pending').length} pending
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'accepted', 'declined'].map((status) => (
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
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 p-6 hover:border-primary-green transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                        {request.student.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{request.student}</h3>
                          <span className={`text-xs px-2 py-0.5 ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-text">{request.programme} • Year {request.year}</p>
                        <p className="text-sm text-muted-text mt-1">Topic: {request.topic}</p>
                        {request.message && (
                          <p className="text-sm text-muted-text mt-2 line-clamp-2">{request.message}</p>
                        )}
                        <p className="text-xs text-muted-text mt-1">{new Date(request.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="text-sm text-primary-green hover:underline">View Details</button>
                    {request.status === 'pending' && (
                      <>
                        <button className="bg-green-600 text-white px-4 py-1 text-sm hover:bg-green-700 transition-colors">
                          Accept
                        </button>
                        <button className="border border-gray-300 px-4 py-1 text-sm hover:bg-gray-50 transition-colors">
                          Decline
                        </button>
                      </>
                    )}
                  </div>
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
