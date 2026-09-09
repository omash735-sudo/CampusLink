// app/announcements/page.tsx
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function AnnouncementsPage() {
  const announcementsList = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Announcements</h1>

        <div className="space-y-4">
          {announcementsList.map((announcement) => (
            <div key={announcement.id} className={`bg-white border p-6 hover:border-primary-green transition-colors ${
              announcement.priority === 'urgent' ? 'border-l-4 border-l-red-600' :
              announcement.priority === 'high' ? 'border-l-4 border-l-orange-500' :
              'border-l-4 border-l-primary-green'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5">{announcement.type || 'General'}</span>
                    {announcement.priority === 'urgent' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">Urgent</span>
                    )}
                    {announcement.priority === 'high' && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5">High Priority</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mt-1">{announcement.title}</h3>
                  <p className="text-sm text-muted-text mt-1">{announcement.content}</p>
                  <p className="text-xs text-muted-text mt-2">
                    {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {announcementsList.length === 0 && (
          <div className="border border-gray-200 bg-white p-8 text-center">
            <p className="text-muted-text">No announcements yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
