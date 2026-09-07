// app/saved/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { savedResources, resources } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { BookOpenIcon, CalendarIcon } from '@/components/icons';

export default async function SavedPage() {
  const user = await requireAuth();

  const saved = await db
    .select({
      id: savedResources.id,
      resourceId: savedResources.resourceId,
      createdAt: savedResources.createdAt,
      resource: {
        id: resources.id,
        title: resources.title,
        description: resources.description,
        course: resources.course,
        fileType: resources.fileType,
      }
    })
    .from(savedResources)
    .leftJoin(resources, eq(savedResources.resourceId, resources.id))
    .where(eq(savedResources.userId, user.id))
    .orderBy(desc(savedResources.createdAt));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Saved Items</h1>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5 text-primary-green" />
            Resources
          </h2>
          {saved.length > 0 ? (
            <div className="space-y-3">
              {saved.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/resources/${item.resourceId}`}
                  className="block border-b border-gray-100 pb-3 last:border-0 hover:text-primary-green transition-colors"
                >
                  <p className="font-medium">{item.resource?.title || 'Deleted resource'}</p>
                  <p className="text-sm text-muted-text">{item.resource?.course || 'No course'}</p>
                  <p className="text-xs text-muted-text">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-text">You haven't saved any resources yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
