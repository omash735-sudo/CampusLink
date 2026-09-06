// app/resources/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { resources, programmes, courses, resourceCategories } from '@/lib/db/schema';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';
import Link from 'next/link';
import { ResourceSearch } from '@/components/resources/ResourceSearch';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { PopularResources } from '@/components/resources/PopularResources';
import { RecentResources } from '@/components/resources/RecentResources';
import { RecommendedResources } from '@/components/resources/RecommendedResources';
import { ResourceCategories } from '@/components/resources/ResourceCategories';

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { search?: string; type?: string; programme?: string; year?: string; sort?: string }
}) {
  try {
    const currentUser = await getCurrentUser();
    const search = searchParams.search || '';
    const programmeFilter = searchParams.programme || '';
    const yearFilter = searchParams.year || '';
    const sort = searchParams.sort || 'recent';

    // Build query - using snake_case column names to match database
    let query = db
      .select({
        id: resources.id,
        title: resources.title,
        description: resources.description,
        fileUrl: resources.fileUrl,
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
      .where(eq(resources.status, 'approved'));

    if (search) {
      query = query.where(
        or(
          like(resources.title, `%${search}%`),
          like(resources.description, `%${search}%`),
          like(resources.course, `%${search}%`),
          like(programmes.name, `%${search}%`)
        )
      );
    }

    if (programmeFilter) {
      query = query.where(eq(resources.programmeId, programmeFilter));
    }
    if (yearFilter) {
      query = query.where(eq(resources.year, parseInt(yearFilter)));
    }

    if (sort === 'recent') {
      query = query.orderBy(desc(resources.createdAt));
    } else if (sort === 'downloads') {
      query = query.orderBy(desc(resources.downloads));
    } else if (sort === 'views') {
      query = query.orderBy(desc(resources.viewCount));
    } else if (sort === 'title') {
      query = query.orderBy(resources.title);
    }

    const resourceList = await query.limit(24);

    const programmesList = await db.select().from(programmes).where(eq(programmes.isActive, true));
    const categories = await db.select().from(resourceCategories).orderBy(resourceCategories.name);

    const popularResources = await db
      .select({
        id: resources.id,
        title: resources.title,
        description: resources.description,
        downloads: resources.downloads,
        viewCount: resources.viewCount,
        createdAt: resources.createdAt,
        programme: {
          id: programmes.id,
          name: programmes.name,
        },
      })
      .from(resources)
      .leftJoin(programmes, eq(resources.programmeId, programmes.id))
      .where(eq(resources.status, 'approved'))
      .orderBy(desc(resources.downloads))
      .limit(6);

    const recentResources = await db
      .select({
        id: resources.id,
        title: resources.title,
        description: resources.description,
        fileType: resources.fileType,
        createdAt: resources.createdAt,
        programme: {
          id: programmes.id,
          name: programmes.name,
        },
      })
      .from(resources)
      .leftJoin(programmes, eq(resources.programmeId, programmes.id))
      .where(eq(resources.status, 'approved'))
      .orderBy(desc(resources.createdAt))
      .limit(6);

    const resourceTypes = ['Past Paper', 'Lecture Notes', 'Study Guide', 'Handout', 'Course Outline', 'Research', 'Assignment', 'Textbook', 'Other'];

    return (
      <div className="min-h-screen bg-off-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-text">Academic Resources</h1>
            <p className="text-lg text-muted-text mt-2">
              Find the notes, past papers, study materials and academic resources you need to succeed.
            </p>
            <div className="mt-4 max-w-2xl">
              <ResourceSearch />
            </div>
          </div>

          <div className="mb-8">
            <ResourceCategories categories={categories} />
          </div>

          {currentUser && (
            <div className="mb-8">
              <RecommendedResources currentUserId={currentUser.id} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PopularResources resources={popularResources} />
            <RecentResources resources={recentResources} />
          </div>

          <div className="bg-white border border-gray-200 p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-lg font-semibold">Browse Resources</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-text">Sort by:</span>
                <select
                  className="border border-gray-300 bg-white px-3 py-1 text-sm focus:border-primary-green focus:outline-none"
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('sort', e.target.value);
                    window.location.href = `/resources?${params.toString()}`;
                  }}
                  defaultValue={sort}
                >
                  <option value="recent">Most Recent</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="views">Most Viewed</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <ResourceFilters
                programmes={programmesList}
                resourceTypes={resourceTypes}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {resourceList.length} resource{resourceList.length !== 1 ? 's' : ''} found
              </h2>
            </div>
            <ResourceGrid resources={resourceList} currentUserId={currentUser?.id} />
            {resourceList.length === 0 && (
              <div className="border border-gray-200 bg-white p-8 text-center">
                <p className="text-muted-text">No resources found matching your criteria.</p>
                <div className="mt-4">
                  <Link href="/resources" className="text-primary-green hover:underline text-sm">
                    Clear Filters
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ResourcesPage Error:', error);
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="border border-gray-200 bg-white p-8 max-w-md text-center">
          <div className="h-12 w-12 border-2 border-primary-green bg-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-primary-text mb-4">Something went wrong</h2>
          <p className="text-muted-text">Unable to load the resources page. Please try again later.</p>
          <details className="mt-4 text-left text-sm text-muted-text">
            <summary>Error details</summary>
            <pre className="mt-2 p-2 bg-gray-100 overflow-auto whitespace-pre-wrap">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
          <Link href="/" className="text-primary-green hover:underline mt-4 inline-block">
            Return home →
          </Link>
        </div>
      </div>
    );
  }
}
