// app/admin/students/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, FilterIcon } from '@/components/icons';
import { adminService, Student } from '@/lib/services/admin.service';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const programmes = ['All', ...new Set(students.map(s => s.programme))];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                          student.username.toLowerCase().includes(search.toLowerCase()) ||
                          student.email.toLowerCase().includes(search.toLowerCase());
    const matchesProgramme = programmeFilter === 'All' || student.programme === programmeFilter;
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesProgramme && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="bg-white border border-gray-200 p-4">
          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
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
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-sm text-gray-500">{students.length} total students</p>
        </div>
        {students.some(s => s.isDefault) && (
          <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-200">
            Contains Default Data
          </div>
        )}
      </div>

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

      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                  {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{student.name}</h3>
                    {student.isDefault && (
                      <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5">Default</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 ${
                      student.status === 'Active' ? 'bg-green-100 text-green-700' :
                      student.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">@{student.username}</p>
                  <p className="text-sm text-gray-500">{student.programme} • Year {student.year}</p>
                  <p className="text-sm text-gray-500">{student.faculty}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                    <span>Joined: {new Date(student.joinedDate).toLocaleDateString()}</span>
                    <span>Last active: {new Date(student.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link href={`/admin/students/${student.id}`} className="text-primary-green hover:underline text-sm">
                  View Details
                </Link>
                <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
                {student.status === 'Active' ? (
                  <button className="text-sm text-orange-500 hover:text-orange-700">Suspend</button>
                ) : (
                  <button className="text-sm text-green-500 hover:text-green-700">Activate</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No students found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
