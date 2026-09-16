// app/admin/resources/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { getActiveResourceCategories } from '@/lib/resource-categories';

export const dynamic = 'force-dynamic';

export default async function EditResourcePage({
  params,
}: {
  params: { id: string };
}) {
  const [row] = await db
    .select()
    .from(resources)
    .where(eq(resources.id, params.id));
  if (!row) notFound();

  const cats = await getActiveResourceCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Resource</h1>
        <p className="text-sm text-gray-500">{row.title}</p>
      </div>
      <ResourceForm
        mode="edit"
        categories={cats.map((c) => c.name)}
        initialData={{
          id: row.id,
          resourceKind: row.resourceKind as any,
          title: row.title,
          description: row.description || '',
          category: row.category || '',
          subject: row.subject || '',
          programmeId: row.programmeId || '',
          year: row.year || 0,
          author: row.author || '',
          source: row.source || '',
          publicationDate: row.publicationDate
            ? row.publicationDate.toISOString().split('T')[0]
            : '',
          coverImageUrl: row.coverImageUrl || '',
          body: row.body || '',
          youtubeUrl: row.youtubeUrl || '',
          youtubeVideoId: row.youtubeVideoId || '',
          showEmbeddedPlayer: row.showEmbeddedPlayer,
          showYoutubeButton: row.showYoutubeButton,
          downloadable: row.downloadable,
          previewable: row.previewable,
          featured: row.featured,
          status: row.status as any,
          rightsType: row.rightsType || '',
          rightsConfirmed: row.rightsConfirmed,
          fileUrl: row.fileUrl || '',
          fileName: row.fileName || '',
          fileType: row.fileType || '',
          fileSize: row.fileSize || 0,
        }}
      />
    </div>
  );
}
