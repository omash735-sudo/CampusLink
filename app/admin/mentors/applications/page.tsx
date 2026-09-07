// app/admin/mentors/applications/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const DEMO_APPLICATIONS = [
  { id: '1', applicant: 'Sarah Phiri', programme: 'Environmental Science', year: 3, date: '2026-09-05', expertise: ['Academic Support', 'Research'], status: 'Pending' },
  { id: '2', applicant: 'David Nkhoma', programme: 'Engineering', year: 4, date: '2026-09-03', expertise: ['Career Guidance', 'Study Skills'], status: 'Pending' },
  { id: '3', applicant: 'Mary Chisale', programme: 'Food Science', year: 2, date: '2026-09-01', expertise: ['University Life'], status: 'Pending' },
];

export default function MentorApplicationsPage() {
  const [filter, setFilter] = useState('All');

  const filtered = DEMO_APPLICATIONS.filter((app) => filter === 'All' || app.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentor Applications</h1>
          <p className="text-sm text-gray-500">{DEMO_APPLICATIONS.length} pending applications (demo data)</p>
        </div>
        <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-200">
          Default Data
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
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
                <h3 className="font-semibold">{app.applicant}</h3>
                <p className="text-sm text-gray-500">{app.programme} • Year {app.year}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {app.expertise.map((exp) => (
                    <span key={exp} className="text-xs bg-gray-100 px-2 py-0.5">{exp}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Applied {new Date(app.date).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs px-2 py-0.5 ${
                  app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
                <Link href={`/admin/mentors/applications/${app.id}`} className="text-primary-green hover:underline text-sm">
                  Review
                </Link>
                <button className="bg-green-600 text-white px-3 py-1 text-sm hover:bg-green-700 transition-colors">
                  Approve
                </button>
                <button className="border border-red-300 text-red-600 px-3 py-1 text-sm hover:bg-red-50 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
