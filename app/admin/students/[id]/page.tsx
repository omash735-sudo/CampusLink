// app/admin/students/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  programme: string;
  year: number;
  bio: string;
  role: string;
  isActive: boolean;
  isMentor: boolean;
  mentorStatus: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, [params.id]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        setError(data.error || 'Failed to load user');
      }
    } catch (err) {
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!user) return;
    if (!confirm(`Change user status to ${user.isActive ? 'Inactive' : 'Active'}?`)) return;
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      });
      if (res.ok) {
        await loadUser();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/students');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{error || 'User not found'}</p>
        <Link href="/admin/students" className="text-primary-green hover:underline text-sm mt-2 inline-block">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/students" className="text-primary-green hover:underline text-sm">
            ← Back to Students
          </Link>
          <h1 className="text-2xl font-bold">Student Details</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/students/${user.id}/edit`} className="bg-primary-green text-white px-4 py-1.5 text-sm hover:bg-deep-green transition-colors">
            Edit
          </Link>
          <button onClick={handleDelete} className="border border-red-300 text-red-600 px-4 py-1.5 text-sm hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl font-semibold text-primary-green flex-shrink-0">
            {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
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
            <p className="text-gray-500">@{user.username}</p>
            <p className="text-gray-500">{user.programme || 'No programme'} • Year {user.year || '?'}</p>
            <p className="text-gray-500">{user.role}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStatusToggle}
              className={`px-4 py-1.5 text-sm ${
                user.isActive 
                  ? 'border border-orange-300 text-orange-600 hover:bg-orange-50' 
                  : 'border border-green-300 text-green-600 hover:bg-green-50'
              } transition-colors`}
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Username</span>
              <span>@{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span>{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Active</span>
              <span>{user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Academic Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Programme</span>
              <span>{user.programme || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Year</span>
              <span>{user.year || 'Not set'}</span>
            </div>
            {user.bio && (
              <div className="mt-2">
                <span className="text-gray-500 block">Bio</span>
                <p className="text-sm mt-1">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
