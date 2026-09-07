// app/admin/students/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminService, Student } from '@/lib/services/admin.service';
import { UserIcon, MailIcon, CalendarIcon, BookOpenIcon, UserGroupIcon } from '@/components/icons';

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudent();
  }, [params.id]);

  const loadStudent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getStudent(params.id as string);
      if (data) {
        setStudent(data);
      } else {
        setError('Student not found');
      }
    } catch (err) {
      setError('Failed to load student');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'Active' | 'Inactive' | 'Suspended') => {
    if (!student) return;
    if (!confirm(`Change student status to ${newStatus}?`)) return;
    try {
      const updated = await adminService.updateStudent(student.id, { status: newStatus });
      setStudent(updated);
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
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="bg-white border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{error || 'Student not found'}</p>
        <Link href="/admin/students" className="text-primary-green hover:underline text-sm mt-2 inline-block">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="text-primary-green hover:underline text-sm">
          ← Back to Students
        </Link>
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl font-semibold text-primary-green flex-shrink-0">
            {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              {student.isDefault && (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5">Default Data</span>
              )}
              <span className={`text-xs px-2 py-0.5 ${
                student.status === 'Active' ? 'bg-green-100 text-green-700' :
                student.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                'bg-red-100 text-red-700'
              }`}>
                {student.status}
              </span>
            </div>
            <p className="text-gray-500">@{student.username}</p>
            <p className="text-gray-500">{student.programme} • Year {student.year}</p>
            <p className="text-gray-500">{student.faculty}</p>
          </div>
          <div className="flex gap-2">
            <button className="border border-gray-300 px-4 py-1.5 text-sm hover:border-primary-green transition-colors">
              Edit
            </button>
            {student.status === 'Active' ? (
              <button
                onClick={() => handleStatusChange('Suspended')}
                className="border border-orange-300 text-orange-600 px-4 py-1.5 text-sm hover:bg-orange-50 transition-colors"
              >
                Suspend
              </button>
            ) : student.status === 'Suspended' ? (
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
              <span>{student.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Username</span>
              <span>@{student.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Joined</span>
              <span>{new Date(student.joinedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Active</span>
              <span>{new Date(student.lastActive).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Is Mentor</span>
              <span>{student.isMentor ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4 text-primary-green" />
            Academic Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Programme</span>
              <span>{student.programme}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Year</span>
              <span>{student.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Faculty</span>
              <span>{student.faculty}</span>
            </div>
            {student.bio && (
              <div className="mt-2">
                <span className="text-gray-500 block">Bio</span>
                <p className="text-sm mt-1">{student.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interests */}
      {student.interests && student.interests.length > 0 && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {student.interests.map((interest) => (
              <span key={interest} className="text-xs bg-gray-100 px-3 py-1">{interest}</span>
            ))}
          </div>
        </div>
      )}

      {/* Account Activity */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">Account Activity</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Account created</span>
            <span>{new Date(student.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span>Last profile update</span>
            <span>{new Date(student.updatedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Account status</span>
            <span>{student.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
