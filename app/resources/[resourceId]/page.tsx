// app/resources/[resourceId]/page.tsx
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { YouTubeEmbed } from '@/components/resources/YouTubeEmbed';
import { youtubeWatchUrl } from '@/lib/youtube';
import { incrementResourceView } from '@/lib/services/resource.service';

export const dynamic = 'force-dynamic';

export default async function ResourceDetailPage({
  params,
}: {
  params: { resourceId: string };
}) {
  const [resource] = await db
    .select()
    .from(resources)
    .where(and(eq(resources.id, params.resourceId), eq(resources.status, 'published')));

  if (!resource) notFound();

  // Best-effort view increment
  try {
    await incrementResourceView(resource.id);
  } catch {
    // ignore
  }

  const related = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.status, 'published'),
        ne(resources.id, resource.id),
        resource.category ? eq(resources.category, resource.category) : undefined
      )
    )
    .orderBy(desc(resources.createdAt))
    .limit(4);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/resources" className="text-primary-green hover:underline text-sm">
          ← Back to Academic Library
        </Link>

        <div className="bg-white border border-gray-200 p-6 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-gray-100 px-2 py-0.5">
              {resource.resourceKind === 'document'
                ? (resource.fileType || 'DOCUMENT').toUpperCase()
                : 'VIDEO'}
            </span>
            {resource.category && (
              <span className="text-xs text-muted-text">{resource.category}</span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">{resource.title}</h1>

          {resource.description && (
            <p className="text-muted-text mt-3">{resource.description}</p>
          )}

          {(resource.author || resource.source || resource.publicationDate) && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-muted-text space-y-1">
              {resource.author && <p><strong>Author:</strong> {resource.author}</p>}
              {resource.source && <p><strong>Source:</strong> {resource.source}</p>}
              {resource.publicationDate && (
                <p>
                  <strong>Publication Date:</strong>{' '}
                  {new Date(resource.publicationDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        {resource.resourceKind === 'video' && resource.youtubeVideoId && (
          <div className="bg-white border border-gray-200 p-6 mt-6">
            {resource.showEmbeddedPlayer && (
              <YouTubeEmbed videoId={resource.youtubeVideoId} title={resource.title} />
            )}
            {resource.showYoutubeButton && (
              <div className="mt-4 text-center">
                <a
                  href={youtubeWatchUrl(resource.youtubeVideoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary-green text-primary-green px-6 py-2 text-sm font-medium hover:bg-primary-green/5 inline-block"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>
        )}

        {resource.resourceKind === 'document' && resource.fileUrl && (
          <div className="bg-white border border-gray-200 p-6 mt-6">
            {resource.fileType === 'application/pdf' && resource.previewable ? (
              <iframe
                src={resource.fileUrl}
                className="w-full h-[600px] border border-gray-200"
                title={resource.title}
              />
            ) : (
              <div className="border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-muted-text">
                  Preview unavailable for {resource.fileType || 'this format'}.
                </p>
                <p className="text-xs text-muted-text mt-1">
                  Download the file to view it in a compatible application.
                </p>
              </div>
            )}

            {resource.downloadable && (
              <div className="mt-4 text-center">
                <a
                  href={resource.fileUrl}
                  download={resource.fileName || undefined}
                  className="bg-primary-green text-white px-6 py-2 text-sm font-medium hover:bg-deep-green inline-block"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">More in {resource.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.id}`}
                  className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors"
                >
                  <h3 className="font-medium text-sm line-clamp-1">{r.title}</h3>
                  <p className="text-xs text-muted-text mt-1">
                    {r.resourceKind === 'video' ? 'Video' : (r.fileType || 'Document').toUpperCase()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
