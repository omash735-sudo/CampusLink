// app/admin/mentors/applications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMentorApplications, approveMentorApplication, rejectMentorApplication } from '@/lib/services/admin.service';

interface MentorApplication {
  id: string;
  fullName: string;
  username: string;
  email: string;
  programme: string;
  year: number;
  bio: string;
  mentorStatus: string;
  createdAt: string;
}

export default function MentorApplicationsPage() {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getMentorApplications();
      // Map the data to match MentorApplication interface
      const mappedData = data.map((item: any) => ({
        id: item.id,
        fullName: item.fullName || '',
        username: item.username || '',
        email: item.email || '',
        programme: item.programme || '',
        year: item.year || 0,
        bio: item.bio || '',
        mentorStatus: item.mentorStatus || 'pending',
        createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
      }));
      setApplications(mappedData);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this mentor application?')) return;
    try {
      await approveMentorApplication(id);
      await loadApplications();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this mentor application?')) return;
    try {
      await rejectMentorApplication(id);
      await loadApplications();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-3">
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentor Applications</h1>
          <p className="text-sm text-gray-500">{applications.length} pending applications</p>
        </div>
      </div>

      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{app.fullName}</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5">Pending</span>
                </div>
                <p className="text-sm text-gray-500">{app.programme || 'No programme'} • Year {app.year || '?'}</p>
                <p className="text-sm text-gray-500">@{app.username}</p>
                <p className="text-sm text-gray-500 mt-1">{app.bio || 'No bio provided'}</p>
                <p className="text-xs text-gray-400 mt-1">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <button
                  onClick={() => handleApprove(app.id)}
                  className="bg-green-600 text-white px-4 py-1.5 text-sm hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="border border-red-300 text-red-600 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
                <Link href={`/admin/students/${app.id}`} className="text-primary-green hover:underline text-sm">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No pending mentor applications.</p>
        </div>
      )}
    </div>
  );
}
