// app/admin/campus/timeline/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { campusTimeline } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { TimelineForm, TimelineFormData } from '../TimelineForm';

export const dynamic = 'force-dynamic';

export default async function EditCampusTimelinePage({
  params,
}: {
  params: { id: string };
}) {
  const [entry] = await db
    .select()
    .from(campusTimeline)
    .where(eq(campusTimeline.id, params.id))
    .limit(1);

  if (!entry) notFound();

  const initial: TimelineFormData = {
    id: entry.id,
    year: entry.year,
    title: entry.title,
    description: entry.description ?? '',
    imageUrl: entry.imageUrl ?? '',
    source: entry.source ?? '',
    isPublished: entry.isPublished ?? true,
    sortOrder: entry.sortOrder ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campus/timeline"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Timeline
        </Link>
        <div className="flex items-center justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl font-bold">
              {entry.year} — {entry.title}
            </h1>
          </div>
          {entry.isPublished && (
            <a
              href="/campus/history"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-green hover:underline"
            >
              View public page →
            </a>
          )}
        </div>
      </div>

      <TimelineForm initial={initial} />
    </div>
  );
}
