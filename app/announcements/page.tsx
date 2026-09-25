// app/announcements/page.tsx
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAnnouncementTypeLabel } from '@/lib/announcement-types';
import { PosterImage } from '@/components/PosterImage';

export const dynamic = 'force-dynamic';

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

        <div className="space-y-6">
          {announcementsList.map((announcement) => (
            <article
              key={announcement.id}
              className={`bg-white border hover:border-primary-green transition-colors ${
                announcement.priority === 'urgent'
                  ? 'border-l-4 border-l-red-600'
                  : announcement.priority === 'high'
                  ? 'border-l-4 border-l-orange-500'
                  : 'border-l-4 border-l-primary-green'
              }`}
            >
              {/* Poster — full graphic, never cropped. Only rendered if present. */}
              {announcement.imageUrl && (
                <PosterImage
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  variant="card"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-gray-100 px-2 py-0.5">
                    {getAnnouncementTypeLabel(announcement.type)}
                  </span>
                  {announcement.priority === 'urgent' && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">
                      Urgent
                    </span>
                  )}
                  {announcement.priority === 'high' && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5">
                      High Priority
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold mt-2">
                  {announcement.title}
                </h2>

                {/* Only show content if it adds something beyond the poster. */}
                {announcement.content && (
                  <p className="text-sm text-muted-text mt-1 whitespace-pre-line">
                    {announcement.content}
                  </p>
                )}

                {announcement.publishedAt && (
                  <p className="text-xs text-muted-text mt-3">
                    {new Date(announcement.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </article>
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
