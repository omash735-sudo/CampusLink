// components/resources/RecommendedResources.tsx
import { db } from '@/lib/db';
import { resources, programmes, courses, campuslinkUsers } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { ResourceCard } from './ResourceCard';

export async function RecommendedResources({ currentUserId }: { currentUserId: string }) {
  const user = await db
    .select({
      id: campuslinkUsers.id,
      programme: campuslinkUsers.programme,
      year: campuslinkUsers.year,
    })
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, currentUserId))
    .then(res => res[0]);

  if (!user || !user.programme) return null;

  // Get resources matching user's programme
  const recommended = await db
    .select({
      id: resources.id,
      resourceKind: resources.resourceKind,
      title: resources.title,
      description: resources.description,
      category: resources.category,
      subject: resources.subject,
      fileType: resources.fileType,
      fileUrl: resources.fileUrl,
      coverImageUrl: resources.coverImageUrl,
      author: resources.author,
      source: resources.source,
      featured: resources.featured,
      createdAt: resources.createdAt,
    })
    .from(resources)
    .leftJoin(programmes, eq(resources.programmeId, programmes.id))
    .where(and(
      eq(resources.status, 'published'),
      eq(programmes.name, user.programme)
    ))
    .orderBy(desc(resources.createdAt))
    .limit(6);

  if (recommended.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Recommended for You</h2>
      <p className="text-sm text-muted-text mb-3">
        Based on your programme: {user.programme}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommended.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
          />
        ))}
      </div>
    </div>
  );
}
