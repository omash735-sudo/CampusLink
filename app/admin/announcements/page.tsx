// app/admin/announcements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
import { getAnnouncements, publishAnnouncement, deleteAnnouncement } from '@/lib/services/admin.service';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      // Map data to match Announcement interface
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.type || 'general',
        priority: item.priority || 'normal',
        isPublished: item.isPublished || false,
        publishedAt: item.publishedAt || null,
        createdAt: item.createdAt,
      }));
      setAnnouncements(mappedData);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm('Publish this announcement?')) return;
    try {
      await publishAnnouncement(id);
      await loadAnnouncements();
    } catch (error) {
      console.error('Failed to publish:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement? This cannot be undone.')) return;
    try {
      await deleteAnnouncement(id);
      await loadAnnouncements();
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
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
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
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-sm text-gray-500">{announcements.length} total announcements</p>
        </div>
        <Link href="/admin/announcements/new" className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Announcement
        </Link>
      </div>

      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <span className={`text-xs px-2 py-0.5 ${
                    announcement.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {announcement.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 ${
                    announcement.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    announcement.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{announcement.category}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{announcement.content}</p>
                <p className="text-xs text-gray-400 mt-1">Added {new Date(announcement.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link href={`/admin/announcements/${announcement.id}`} className="text-primary-green hover:underline text-sm">
                  Edit
                </Link>
                {!announcement.isPublished && (
                  <button onClick={() => handlePublish(announcement.id)} className="text-sm text-green-600 hover:text-green-700">
                    Publish
                  </button>
                )}
                <button onClick={() => handleDelete(announcement.id)} className="text-sm text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No announcements found.</p>
        </div>
      )}
    </div>
  );
}
