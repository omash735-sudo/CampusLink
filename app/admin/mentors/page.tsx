// app/admin/mentors/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const DEMO_MENTORS = [
  { id: '1', name: 'Omash Mashiri', programme: 'Social Work', year: 3, expertise: ['Academic Support', 'Career Guidance'], status: 'Active', mentees: 4, joined: '2026-08-15' },
  { id: '2', name: 'Jane Mwale', programme: 'Agricultural Economics', year: 4, expertise: ['Research', 'Study Skills'], status: 'Active', mentees: 2, joined: '2026-08-20' },
  { id: '3', name: 'John Banda', programme: 'Food Science', year: 2, expertise: ['University Life'], status: 'Inactive', mentees: 0, joined: '2026-09-01' },
];

export default function AdminMentorsPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentors</h1>
          <p className="text-sm text-gray-500">{DEMO_MENTORS.length} approved mentors (demo data)</p>
        </div>
        <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-200">
          Default Data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_MENTORS.map((mentor) => (
          <div key={mentor.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{mentor.name}</h3>
                <p className="text-sm text-gray-500">{mentor.programme} • Year {mentor.year}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mentor.expertise.map((exp) => (
                    <span key={exp} className="text-xs bg-gray-100 px-2 py-0.5">{exp}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{mentor.mentees} mentees</span>
                  <span>Joined {new Date(mentor.joined).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 ${
                mentor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {mentor.status}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/mentors/${mentor.id}`} className="text-primary-green hover:underline text-sm">
                View
              </Link>
              <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
              <button className="text-sm text-red-500 hover:text-red-700">Suspend</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
