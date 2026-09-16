// app/publications/[id]/page.tsx
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PublicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [article] = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.id, params.id),
        eq(resources.status, 'published'),
        or(eq(resources.resourceKind, 'article'), eq(resources.resourceKind, 'publication'))!
      )
    );

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/publications" className="text-primary-green hover:underline text-sm">
          ← Back to Publications
        </Link>

        <article className="bg-white border border-gray-200 p-6 md:p-10 mt-4">
          {article.category && (
            <span className="text-xs text-primary-green font-medium">
              {article.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{article.title}</h1>

          {(article.author || article.publicationDate) && (
            <p className="text-sm text-muted-text mt-3">
              {article.author ? `By ${article.author}` : ''}
              {article.publicationDate
                ? ` · ${new Date(article.publicationDate).toLocaleDateString()}`
                : ''}
            </p>
          )}

          {article.coverImageUrl && (
            <div className="relative w-full aspect-video bg-gray-50 my-6 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {article.description && (
            <p className="text-lg text-muted-text italic mb-6">
              {article.description}
            </p>
          )}

          <div className="prose prose-sm md:prose-base max-w-none text-primary-text">
            <ReactMarkdown>{article.body || ''}</ReactMarkdown>
          </div>

          {article.source && (
            <p className="text-xs text-muted-text mt-8 pt-4 border-t border-gray-100">
              Source: {article.source}
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
