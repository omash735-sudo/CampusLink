// app/admin/mentors/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminService, Mentor } from '@/lib/services/admin.service';
import { UserIcon, BookOpenIcon, UserGroupIcon, CalendarIcon } from '@/components/icons';

export default function MentorDetailsPage() {
  const params = useParams();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMentor();
  }, [params.id]);

  const loadMentor = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getMentor(params.id as string);
      if (data) {
        setMentor(data);
      } else {
        setError('Mentor not found');
      }
    } catch (err) {
      setError('Failed to load mentor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'Active' | 'Inactive' | 'Suspended') => {
    if (!mentor) return;
    if (!confirm(`Change mentor status to ${newStatus}?`)) return;
    try {
      const updated = await adminService.updateMentor(mentor.id, { status: newStatus });
      setMentor(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
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

  if (error || !mentor) {
    return (
      <div className="bg-white border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{error || 'Mentor not found'}</p>
        <Link href="/admin/mentors" className="text-primary-green hover:underline text-sm mt-2 inline-block">
          Back to Mentors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/mentors" className="text-primary-green hover:underline text-sm">
          ← Back to Mentors
        </Link>
        <h1 className="text-2xl font-bold">Mentor Details</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl font-semibold text-primary-green flex-shrink-0">
            {mentor.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold">{mentor.name}</h2>
              {mentor.isDefault && (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5">Default Data</span>
              )}
              <span className={`text-xs px-2 py-0.5 ${
                mentor.status === 'Active' ? 'bg-green-100 text-green-700' :
                mentor.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                'bg-red-100 text-red-700'
              }`}>
                {mentor.status}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">Verified</span>
            </div>
            <p className="text-gray-500">@{mentor.username}</p>
            <p className="text-gray-500">{mentor.programme} • Year {mentor.year}</p>
            <p className="text-gray-500">{mentor.faculty}</p>
          </div>
          <div className="flex gap-2">
            <button className="border border-gray-300 px-4 py-1.5 text-sm hover:border-primary-green transition-colors">
              Edit
            </button>
            {mentor.status === 'Active' ? (
              <button
                onClick={() => handleStatusChange('Suspended')}
                className="border border-orange-300 text-orange-600 px-4 py-1.5 text-sm hover:bg-orange-50 transition-colors"
              >
                Suspend
              </button>
            ) : mentor.status === 'Suspended' ? (
              <button
                onClick={() => handleStatusChange('Active')}
                className="border border-green-300 text-green-600 px-4 py-1.5 text-sm hover:bg-green-50 transition-colors"
              >
                Activate
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-primary-green" />
            Account Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span>{mentor.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Username</span>
              <span>@{mentor.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined</span>
              <span>{new Date(mentor.joinedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rating</span>
              <span>{mentor.rating || 0} / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Availability</span>
              <span className="capitalize">{mentor.availability || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4 text-primary-green" />
            Mentorship Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Active Mentees</span>
              <span>{mentor.mentees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Programme</span>
              <span>{mentor.programme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Year</span>
              <span>{mentor.year}</span>
            </div>
            {mentor.experience && (
              <div className="mt-2">
                <span className="text-gray-500 block">Experience</span>
                <p className="text-sm mt-1">{mentor.experience}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expertise */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">Expertise & Subjects</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Areas of Expertise</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {mentor.expertise.map((exp) => (
                <span key={exp} className="text-sm bg-gray-100 px-3 py-1">{exp}</span>
              ))}
            </div>
          </div>
          {mentor.subjects && mentor.subjects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Subjects</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {mentor.subjects.map((subject) => (
                  <span key={subject} className="text-sm bg-primary-green/10 text-primary-green px-3 py-1">{subject}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Introduction */}
      {mentor.introduction && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Introduction</h3>
          <p className="text-gray-600">{mentor.introduction}</p>
        </div>
      )}
    </div>
  );
}
