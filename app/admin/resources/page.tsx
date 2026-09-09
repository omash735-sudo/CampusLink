// app/admin/resources/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
import { getResources, approveResource, rejectResource, deleteResource } from '@/lib/services/admin.service';

interface Resource {
  id: string;
  title: string;
  description: string;
  course: string;
  programme: string;
  fileType: string;
  fileSize: number;
  downloads: number;
  viewCount: number;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources();
      // Map data to match Resource interface
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        course: item.course || '',
        programme: item.programme || '',
        fileType: item.fileType || '',
        fileSize: item.fileSize || 0,
        downloads: item.downloads || 0,
        viewCount: item.viewCount || 0,
        status: item.status || 'pending',
        isVerified: item.isVerified || false,
        createdAt: item.createdAt,
      }));
      setResources(mappedData);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this resource?')) return;
    try {
      await approveResource(id);
      await loadResources();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this resource?')) return;
    try {
      await rejectResource(id);
      await loadResources();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource? This cannot be undone.')) return;
    try {
      await deleteResource(id);
      await loadResources();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const filtered = resources.filter((r) => filter === 'All' || r.status === filter);

  const statusColors: Record<string, string> = {
    'approved': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'rejected': 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-sm text-gray-500">{resources.length} total resources</p>
        </div>
        <Link href="/admin/resources/new" className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Resource
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'approved', 'pending', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 text-sm border transition-colors ${
              filter === status
                ? 'bg-primary-green text-white border-primary-green'
                : 'border-gray-200 hover:border-primary-green'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((resource) => (
          <div key={resource.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{resource.title}</h3>
                  <span className={`text-xs px-2 py-0.5 ${statusColors[resource.status] || 'bg-gray-100 text-gray-600'}`}>
                    {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                  </span>
                  {resource.isVerified && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">Verified</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{resource.course || 'No course'} • {resource.programme || 'No programme'}</p>
                <p className="text-sm text-gray-500">{resource.fileType.toUpperCase()} • {(resource.fileSize / 1024).toFixed(1)} KB</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                  <span>Downloads: {resource.downloads}</span>
                  <span>Views: {resource.viewCount}</span>
                  <span>Added: {new Date(resource.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link href={`/admin/resources/${resource.id}`} className="text-primary-green hover:underline text-sm">
                  View
                </Link>
                <Link href={`/admin/resources/${resource.id}/edit`} className="text-sm text-gray-500 hover:text-gray-700">
                  Edit
                </Link>
                {resource.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(resource.id)} className="text-sm text-green-600 hover:text-green-700">
                      Approve
                    </button>
                    <button onClick={() => handleReject(resource.id)} className="text-sm text-red-600 hover:text-red-700">
                      Reject
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(resource.id)} className="text-sm text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No resources found.</p>
        </div>
      )}
    </div>
  );
}
