// app/admin/programmes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
import { getProgrammes, deleteProgramme } from '@/lib/services/admin.service';

interface Programme {
  id: string;
  name: string;
  code: string;
  faculty: string;
  degree: string;
  duration: number;
  status: string;
  isActive: boolean;
}

export default function AdminProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgrammes();
  }, []);

  const loadProgrammes = async () => {
    setLoading(true);
    try {
      const data = await getProgrammes();
      setProgrammes(data as Programme[]);
    } catch (error) {
      console.error('Failed to load programmes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this programme? This cannot be undone.')) return;
    try {
      await deleteProgramme(id);
      await loadProgrammes();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 p-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
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
          <h1 className="text-2xl font-bold">Programmes</h1>
          <p className="text-sm text-gray-500">{programmes.length} total programmes</p>
        </div>
        <Link href="/admin/programmes/new" className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Programme
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programmes.map((programme) => (
          <div key={programme.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{programme.name}</h3>
                <p className="text-sm text-gray-500">{programme.code} • {programme.faculty}</p>
                <p className="text-sm text-gray-500">{programme.degree} • {programme.duration} years</p>
              </div>
              <span className={`text-xs px-2 py-0.5 ${
                programme.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {programme.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/programmes/${programme.id}`} className="text-primary-green hover:underline text-sm">
                View
              </Link>
              <Link href={`/admin/programmes/${programme.id}/edit`} className="text-sm text-gray-500 hover:text-gray-700">
                Edit
              </Link>
              <button onClick={() => handleDelete(programme.id)} className="text-sm text-red-500 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {programmes.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No programmes found.</p>
          <Link href="/admin/programmes/new" className="text-primary-green hover:underline text-sm mt-2 inline-block">
            Add your first programme
          </Link>
        </div>
      )}
    </div>
  );
}
