// app/admin/students/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SearchIcon, FilterIcon, XIcon } from '@/components/icons';

// Demo data clearly labeled
const DEMO_STUDENTS = [
  { id: '1', name: 'Omash Mashiri', username: 'omash.mashiri', email: 'omash@example.com', programme: 'Social Work', year: 3, status: 'Active', joined: '2026-08-15', lastActive: '2026-09-07' },
  { id: '2', name: 'Jane Mwale', username: 'jane.mwale', email: 'jane@example.com', programme: 'Agricultural Economics', year: 2, status: 'Active', joined: '2026-08-20', lastActive: '2026-09-06' },
  { id: '3', name: 'John Banda', username: 'john.banda', email: 'john@example.com', programme: 'Food Science', year: 1, status: 'Inactive', joined: '2026-09-01', lastActive: '2026-09-03' },
  { id: '4', name: 'Sarah Phiri', username: 'sarah.phiri', email: 'sarah@example.com', programme: 'Environmental Science', year: 4, status: 'Active', joined: '2026-08-10', lastActive: '2026-09-07' },
  { id: '5', name: 'David Nkhoma', username: 'david.nkhoma', email: 'david@example.com', programme: 'Engineering', year: 2, status: 'Suspended', joined: '2026-07-15', lastActive: '2026-08-30' },
];

const programmes = ['All', 'Social Work', 'Agricultural Economics', 'Food Science', 'Environmental Science', 'Engineering'];
const years = ['All', '1', '2', '3', '4'];
const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredStudents = DEMO_STUDENTS.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                          student.username.toLowerCase().includes(search.toLowerCase()) ||
                          student.email.toLowerCase().includes(search.toLowerCase());
    const matchesProgramme = programmeFilter === 'All' || student.programme === programmeFilter;
    const matchesYear = yearFilter === 'All' || student.year === parseInt(yearFilter);
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesProgramme && matchesYear && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-gray-500">{DEMO_STUDENTS.length} total students (demo data)</p>
        </div>
        <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-200">
          Default Data
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, username, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 bg-white pl-10 pr-4 py-2 focus:border-primary-green focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 hover:border-primary-green transition-colors"
          >
            <FilterIcon className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
            <div>
              <label className="text-xs font-medium text-gray-600">Programme</label>
              <select
                value={programmeFilter}
                onChange={(e) => setProgrammeFilter(e.target.value)}
                className="w-full border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-green focus:outline-none"
              >
                {programmes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-green focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-green focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr className="text-left">
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Username</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Email</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Programme</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Year</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium text-sm">{student.name}</span>
                  <span className="text-xs text-gray-400 block md:hidden">{student.username}</span>
                </td>
                <td className="p-3 text-sm hidden md:table-cell">{student.username}</td>
                <td className="p-3 text-sm hidden lg:table-cell">{student.email}</td>
                <td className="p-3 text-sm hidden md:table-cell">{student.programme}</td>
                <td className="p-3 text-sm hidden sm:table-cell">{student.year}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 ${
                    student.status === 'Active' ? 'bg-green-100 text-green-700' :
                    student.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/students/${student.id}`} className="text-primary-green hover:underline text-sm">
                      View
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600 text-sm">Actions</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-gray-500">No students found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}
