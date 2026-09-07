// app/admin/mentors/applications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminService, MentorApplication } from '@/lib/services/admin.service';

export default function MentorApplicationsPage() {
  const [applications, setApplications] = useState<MentorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMentorApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this mentor application?')) return;
    try {
      await adminService.approveMentorApplication(id);
      await loadApplications();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason !== null && !confirm('Reject this mentor application?')) return;
    try {
      await adminService.rejectMentorApplication(id, reason || undefined);
      await loadApplications();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const filtered = applications.filter((app) => filter === 'All' || app.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
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
          <p className="text-sm text-gray-500">{applications.filter(a => a.status === 'Pending').length} pending applications</p>
        </div>
        {applications.some(a => a.isDefault) && (
          <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-200">
            Contains Default Data
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Approved', 'Rejected', 'Suspended'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 text-sm border transition-colors ${
              filter === status
                ? 'bg-primary-green text-white border-primary-green'
                : 'border-gray-200 hover:border-primary-green'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((app) => (
          <div key={app.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{app.applicant}</h3>
                  {app.isDefault && (
                    <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5">Default</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 ${
                    app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{app.programme} • Year {app.year}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {app.expertise.map((exp) => (
                    <span key={exp} className="text-xs bg-gray-100 px-2 py-0.5">{exp}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
                {app.reviewNotes && (
                  <p className="text-xs text-gray-500 mt-1">Notes: {app.reviewNotes}</p>
                )}
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link href={`/admin/mentors/applications/${app.id}`} className="text-primary-green hover:underline text-sm">
                  Review
                </Link>
                {app.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="bg-green-600 text-white px-3 py-1 text-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="border border-red-300 text-red-600 px-3 py-1 text-sm hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No mentor applications found.</p>
        </div>
      )}
    </div>
  );
}
