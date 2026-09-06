// app/campus/history/page.tsx
import { db } from '@/lib/db';
import { campusTimeline } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Image from 'next/image';

export default async function CampusHistoryPage() {
  const timeline = await db
    .select()
    .from(campusTimeline)
    .where(eq(campusTimeline.isPublished, true))
    .orderBy(desc(campusTimeline.year));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Campus History</h1>
        <p className="text-muted-text mb-8">
          The story of City Campus through the years.
        </p>

        <div className="space-y-8">
          {timeline.length > 0 ? (
            timeline.map((entry) => (
              <div key={entry.id} className="border border-gray-200 bg-white p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl font-bold text-primary-green w-16">
                    {entry.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{entry.title}</h3>
                    {entry.description && (
                      <p className="text-muted-text mt-2">{entry.description}</p>
                    )}
                    {entry.imageUrl && (
                      <div className="mt-4 relative h-64 bg-gray-200">
                        <Image
                          src={entry.imageUrl}
                          alt={entry.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {entry.source && (
                      <p className="text-xs text-muted-text mt-2">Source: {entry.source}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-gray-200 bg-white p-8 text-center">
              <p className="text-muted-text">History timeline coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
