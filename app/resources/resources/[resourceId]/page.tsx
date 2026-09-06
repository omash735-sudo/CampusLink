// app/resources/[resourceId]/page.tsx
import { db } from '@/lib/db';
import { resources, programmes, courses, savedResources, resourceViews } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getFileSize } from '@/lib/utils';

export default async function ResourceDetailPage({ params }: { params: { resourceId: string } }) {
  const currentUser = await getCurrentUser();
  const resourceId = params.resourceId;

  // Get resource
  const resource = await db
    .select({
      id: resources.id,
      title: resources.title,
      description: resources.description,
      type: resources.type,
      fileUrl: resources.fileUrl,
      fileName: resources.fileName,
      fileType: resources.fileType,
      fileSize: resources.fileSize,
      downloads: resources.downloads,
      viewCount: resources.viewCount,
      year: resources.year,
      semester: resources.semester,
      academicYear: resources.academicYear,
      course: resources.course,
      isVerified: resources.isVerified,
      createdAt: resources.createdAt,
      programme: {
        id: programmes.id,
        name: programmes.name,
        slug: programmes.slug,
      },
      courseInfo: {
        id: courses.id,
        name: courses.name,
        slug: courses.slug,
        code: courses.code,
      },
    })
    .from(resources)
    .leftJoin(programmes, eq(resources.programmeId, programmes.id))
    .leftJoin(courses, eq(resources.courseId, courses.id))
    .where(eq(resources.id, resourceId))
    .then(res => res[0]);

  if (!resource) {
    notFound();
  }

  // Check if saved
  let isSaved = false;
  if (currentUser) {
    const saved = await db
      .select()
      .from(savedResources)
      .where(and(
        eq(savedResources.userId, currentUser.id),
        eq(savedResources.resourceId, resourceId)
      ))
      .then(res => res[0]);
    isSaved = !!saved;
  }

  // Get related resources
  const relatedResources = await db
    .select({
      id: resources.id,
      title: resources.title,
      type: resources.type,
      fileType: resources.fileType,
      downloads: resources.downloads,
      viewCount: resources.viewCount,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .where(and(
      eq(resources.status, 'approved'),
      resource.programme ? eq(resources.programmeId, resource.programme.id) : sql`1=1`,
      sql`id != ${resourceId}`
    ))
    .orderBy(desc(resources.downloads))
    .limit(4);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/resources" className="text-primary-green hover:underline text-sm">
          ← Back to Resources
        </Link>

        {/* Resource Header */}
        <div className="bg-white border border-gray-200 p-6 mt-4">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm bg-gray-100 px-3 py-1">{resource.type}</span>
                {resource.isVerified && (
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1">Verified</span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{resource.title}</h1>
              {resource.courseInfo && (
                <p className="text-muted-text mt-1">{resource.courseInfo.name}</p>
              )}
              {resource.programme && (
                <p className="text-muted-text">{resource.programme.name}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (!currentUser) {
                  window.location.href = '/auth/login';
                  return;
                }
                fetch('/api/resources/save', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ resourceId }),
                });
              }}
              className={`px-4 py-2 border ${
                isSaved ? 'bg-primary-green text-white border-primary-green' : 'border-gray-300 text-muted-text hover:border-primary-green'
              } transition-colors`}
            >
              {isSaved ? 'Saved' : 'Save Resource'}
            </button>
          </div>

          {resource.description && (
            <p className="text-muted-text mt-4">{resource.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-text">
            <span>📄 {resource.fileType.toUpperCase()}</span>
            <span>📊 {getFileSize(resource.fileSize)}</span>
            <span>⬇️ {resource.downloads} downloads</span>
            <span>👁️ {resource.viewCount} views</span>
            {resource.academicYear && <span>📅 {resource.academicYear}</span>}
            <span>📅 Added {new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* File Preview / Download */}
        <div className="bg-white border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-muted-text">Document preview would appear here</p>
            <p className="text-sm text-muted-text mt-2">PDF viewer, Word document viewer, etc.</p>
          </div>
          <div className="mt-4 flex gap-4">
            <a
              href={resource.fileUrl}
              download
              className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors"
            >
              Download
            </a>
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-primary-green text-primary-green px-6 py-2 font-medium hover:bg-primary-green hover:text-white transition-colors"
            >
              Open in New Tab
            </a>
          </div>
        </div>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">More Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedResources.map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.id}`}
                  className="border border-gray-200 bg-white p-4 hover:border-primary-green transition-colors"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-medium text-sm line-clamp-1">{r.title}</h3>
                      <div className="flex gap-3 mt-1 text-xs text-muted-text">
                        <span>{r.type}</span>
                        <span>⬇️ {r.downloads}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-text">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
