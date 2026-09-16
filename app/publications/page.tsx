// app/publications/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function PublicationsPage() {
  const rows = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.status, 'published'),
        or(eq(resources.resourceKind, 'article'), eq(resources.resourceKind, 'publication'))!
      )
    )
    .orderBy(desc(resources.publicationDate), desc(resources.createdAt));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">
            Publications
          </h1>
          <p className="text-lg text-muted-text mt-2">
            Student news, features, interviews, and campus stories from the
            CampusLink community.
          </p>
          <p className="text-sm text-muted-text mt-2">
            Looking for academic resources?{' '}
            <Link href="/resources" className="text-primary-green hover:underline">
              Visit the Academic Library →
            </Link>
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="border border-gray-200 bg-white p-12 text-center">
            <p className="text-muted-text">
              No articles or publications yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((r) => (
              <Link
                key={r.id}
                href={`/publications/${r.id}`}
                className="bg-white border border-gray-200 hover:border-primary-green transition-colors flex flex-col"
              >
                {r.coverImageUrl && (
                  <div className="relative w-full aspect-video bg-gray-50 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.coverImageUrl}
                      alt={r.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  {r.category && (
                    <span className="text-xs text-primary-green font-medium">
                      {r.category}
                    </span>
                  )}
                  <h3 className="font-bold mt-1 line-clamp-2">{r.title}</h3>
                  {r.description && (
                    <p className="text-sm text-muted-text mt-2 line-clamp-3 flex-1">
                      {r.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-text mt-3">
                    {r.author ? `By ${r.author}` : ''}
                    {r.publicationDate
                      ? ` · ${new Date(r.publicationDate).toLocaleDateString()}`
                      : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
