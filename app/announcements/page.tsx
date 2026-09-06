// app/announcements/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function AnnouncementsPage() {
  const allAnnouncements = await db.select().from(announcements)
    .where(eq(announcements.isPublished, true))
    .orderBy(desc(announcements.publishedAt));

  return (
    <div className="min-h-screen bg-off-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-primary-green hover:underline text-sm inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mt-4">Announcements</h1>
          <p className="text-muted-text mt-2">Stay updated with the latest news from LUANAR City Campus</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allAnnouncements.length > 0 ? (
            allAnnouncements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {announcement.imageUrl && (
                  <div className="relative h-56 w-full">
                    <Image
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-muted-text">
                      {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString() : ''}
                    </span>
                    {announcement.priority === 'urgent' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Urgent</span>
                    )}
                    {announcement.priority === 'high' && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">High</span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                      {announcement.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mt-1">{announcement.title}</h2>
                  <p className="text-muted-text text-sm mt-3 leading-relaxed">{announcement.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-muted-text">No announcements available.</p>
              <p className="text-sm text-muted-text mt-2">Check back later for updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
