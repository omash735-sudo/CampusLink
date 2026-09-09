// app/admin/students/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, FilterIcon } from '@/components/icons';
import { getUsers, updateUser, deleteUser } from '@/lib/services/admin.service';

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  programme: string;
  year: number;
  role: string;
  isActive: boolean;
  isMentor: boolean;
  mentorStatus: string;
  createdAt: string;
  lastActive: string;
}

export default function AdminStudentsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      // Map data to match User interface
      const mappedData = data.map((item: any) => ({
        id: item.id,
        fullName: item.fullName || '',
        username: item.username || '',
        email: item.email || '',
        programme: item.programme || '',
        year: item.year || 0,
        role: item.role || 'student',
        isActive: item.isActive || false,
        isMentor: item.isMentor || false,
        mentorStatus: item.mentorStatus || 'not_applied',
        createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
        lastActive: item.lastActive ? new Date(item.lastActive).toISOString() : '',
      }));
      setUsers(mappedData);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    if (!confirm(`Change user status to ${isActive ? 'Active' : 'Inactive'}?`)) return;
    try {
      await updateUser(id, { isActive });
      await loadUsers();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const programmes = ['All', ...new Set(users.map(u => u.programme).filter(Boolean))];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          user.username.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesProgramme = programmeFilter === 'All' || user.programme === programmeFilter;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Active' && user.isActive) ||
                          (statusFilter === 'Inactive' && !user.isActive);
    return matchesSearch && matchesProgramme && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
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
          <p className="text-sm text-gray-500">{users.length} total users</p>
        </div>
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
                  <option key={p} value={p}>{p || 'None'}</option>
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
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-primary-green/10 flex items-center justify-center text-sm font-semibold text-primary-green flex-shrink-0">
                  {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <span className={`text-xs px-2 py-0.5 ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {user.isMentor && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">Mentor</span>
                    )}
                    {user.mentorStatus === 'pending' && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5">Mentor Pending</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="text-sm text-gray-500">{user.programme || 'No programme'} • Year {user.year || '?'}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    <span>Role: {user.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link href={`/admin/students/${user.id}`} className="text-primary-green hover:underline text-sm">
                  View
                </Link>
                <button
                  onClick={() => handleStatusChange(user.id, !user.isActive)}
                  className={`text-sm ${user.isActive ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'}`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
