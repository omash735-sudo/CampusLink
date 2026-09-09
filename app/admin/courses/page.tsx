// app/admin/courses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
import { getCourses, deleteCourse } from '@/lib/services/admin.service';

interface Course {
  id: string;
  name: string;
  code: string;
  programme: string;
  year: number;
  semester: number;
  credits: number;
  isActive: boolean;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      // Map data to match Course interface
      const mappedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code || '',
        programme: item.programmeId || '',
        year: item.year || 0,
        semester: item.semester || 0,
        credits: item.credits || 0,
        isActive: item.isActive || false,
      }));
      setCourses(mappedData);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await deleteCourse(id);
      await loadCourses();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="bg-white border border-gray-200 overflow-x-auto">
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-gray-500">{courses.length} total courses</p>
        </div>
        <Link href="/admin/courses/new" className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Course
        </Link>
      </div>

      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr className="text-left">
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Code</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Programme</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Year</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Credits</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="p-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-medium text-sm">{course.name}</td>
                <td className="p-3 text-sm hidden sm:table-cell">{course.code}</td>
                <td className="p-3 text-sm hidden md:table-cell">{course.programme}</td>
                <td className="p-3 text-sm hidden lg:table-cell">Year {course.year}</td>
                <td className="p-3 text-sm hidden lg:table-cell">{course.credits}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 ${
                    course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/courses/${course.id}`} className="text-primary-green hover:underline text-sm">
                      View
                    </Link>
                    <Link href={`/admin/courses/${course.id}/edit`} className="text-sm text-gray-500 hover:text-gray-700">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(course.id)} className="text-sm text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No courses found.</p>
          <Link href="/admin/courses/new" className="text-primary-green hover:underline text-sm mt-2 inline-block">
            Add your first course
          </Link>
        </div>
      )}
    </div>
  );
}
