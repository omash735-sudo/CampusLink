// app/admin/resources/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';

const DEMO_RESOURCES = [
  { id: '1', title: 'Research Methods Guide', course: 'Social Work', programme: 'Social Work', type: 'Study Guide', uploadedBy: 'Jane Mwale', date: '2026-09-05', status: 'Published' },
  { id: '2', title: 'Case Study Notes', course: 'Agricultural Economics', programme: 'Agricultural Economics', type: 'Notes', uploadedBy: 'John Banda', date: '2026-09-03', status: 'Pending Review' },
  { id: '3', title: 'Past Paper 2024', course: 'Environmental Science', programme: 'Environmental Science', type: 'Past Paper', uploadedBy: 'Sarah Phiri', date: '2026-09-01', status: 'Published' },
  { id: '4', title: 'Assignment Template', course: 'Engineering', programme: 'Engineering', type: 'Assignment', uploadedBy: 'David Nkhoma', date: '2026-08-28', status: 'Rejected' },
];

const statusColors: Record<string, string> = {
  'Published': 'bg-green-100 text-green-700',
  'Pending Review': 'bg-yellow-100 text-yellow-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Archived': 'bg-gray-100 text-gray-600',
};

export default function AdminResourcesPage() {
  const [filter, setFilter] = useState('All');

  const filtered = DEMO_RESOURCES.filter((r) => filter === 'All' || r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-sm text-gray-500">{DEMO_RESOURCES.length} total resources (demo data)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-200">
            Default Data
          </span>
          <Link href="/admin/resources/new" className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1">
            <PlusIcon className="h-4 w-4" />
            Add Resource
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Published', 'Pending Review', 'Rejected', 'Archived'].map((status) => (
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

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr className="text-left">
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Course</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Type</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Uploaded</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((resource) => (
              <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium text-sm">{resource.title}</td>
                <td className="p-3 text-sm hidden md:table-cell">{resource.course}</td>
                <td className="p-3 text-sm hidden lg:table-cell">{resource.type}</td>
                <td className="p-3 text-sm hidden sm:table-cell">{new Date(resource.date).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 ${statusColors[resource.status]}`}>
                    {resource.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-primary-green hover:underline text-sm">Preview</button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
                    {resource.status === 'Pending Review' && (
                      <>
                        <button className="text-sm text-green-600 hover:text-green-700">Approve</button>
                        <button className="text-sm text-red-600 hover:text-red-700">Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
