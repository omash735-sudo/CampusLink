// app/admin/spotlights/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { studentSpotlights } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { SpotlightForm } from '@/components/admin/SpotlightForm';

export const dynamic = 'force-dynamic';

export default async function EditSpotlightPage({
  params,
}: {
  params: { id: string };
}) {
  const [row] = await db
    .select()
    .from(studentSpotlights)
    .where(eq(studentSpotlights.id, params.id));

  if (!row) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Spotlight</h1>
        <p className="text-sm text-gray-500">{row.studentName}</p>
      </div>
      <SpotlightForm
        mode="edit"
        initialData={{
          id: row.id,
          studentName: row.studentName,
          programme: row.programme || '',
          year: row.year || 1,
          bio: row.bio,
          graphicUrl: row.graphicUrl || '',
          tags: row.tags || [],
          achievement: row.achievement || '',
          isPublished: row.isPublished,
          sortOrder: row.sortOrder ?? 0,
        }}
      />
    </div>
  );
}
