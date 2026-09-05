// app/admin/announcements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAnnouncements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      await fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Announcements</h1>
          <button
            onClick={() => router.push('/admin/announcements/new')}
            className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors"
          >
            New Announcement
          </button>
        </div>

        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((ann: any) => (
                <tr key={ann.id} className="border-b border-gray-100 hover:bg-off-white">
                  <td className="p-4">
                    {ann.imageUrl ? (
                      <img 
                        src={ann.imageUrl} 
                        alt={ann.title}
                        className="w-12 h-12 object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{ann.title}</td>
                  <td className="p-4 text-sm text-muted-text">{ann.type}</td>
                  <td className="p-4">
                    <span className={`text-sm ${ann.isPublished ? 'text-green-600' : 'text-muted-text'}`}>
                      {ann.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-text">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => router.push(`/admin/announcements/${ann.id}`)}
                      className="text-primary-green hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
