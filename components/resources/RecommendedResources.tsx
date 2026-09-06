// components/resources/RecommendedResources.tsx
import { db } from '@/lib/db';
import { resources, programmes, courses, users } from '@/lib/db/schema';
import { eq, and, desc, or } from 'drizzle-orm';
import { ResourceCard } from './ResourceCard';

export async function RecommendedResources({ currentUserId }: { currentUserId: string }) {
  const user = await db
    .select({
      id: users.id,
      programme: users.programme,
      year: users.year,
    })
    .from(users)
    .where(eq(users.id, currentUserId))
    .then(res => res[0]);

  if (!user || !user.programme) return null;

  // Get resources matching user's programme
  const recommended = await db
    .select({
      id: resources.id,
      title: resources.title,
      description: resources.description,
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
    .where(and(
      eq(resources.status, 'approved'),
      eq(programmes.name, user.programme)
    ))
    .orderBy(desc(resources.createdAt))
    .limit(6);

  if (recommended.length === 0) return null;

  // Map resources to ensure non-null values for ResourceCard
  const mappedResources = recommended.map((resource) => ({
    ...resource,
    downloads: resource.downloads ?? 0,
    viewCount: resource.viewCount ?? 0,
  }));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Recommended for You</h2>
      <p className="text-sm text-muted-text mb-3">
        Based on your programme: {user.programme}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mappedResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
