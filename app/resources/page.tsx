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

// Debug logger
const debug = {
  log: (step: string, data?: any) => {
    console.log(`[DEBUG RESOURCES] ${step}`, data || '');
  },
  error: (step: string, error: any) => {
    console.error(`[DEBUG RESOURCES ERROR] ${step}:`, error);
    if (error instanceof Error) {
      console.error(`[DEBUG RESOURCES] Message: ${error.message}`);
      console.error(`[DEBUG RESOURCES] Stack: ${error.stack}`);
    }
  },
  table: (step: string, data: any) => {
    console.log(`[DEBUG RESOURCES TABLE] ${step}:`);
    console.table(data);
  }
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { search?: string; type?: string; programme?: string; year?: string; sort?: string }
}) {
  try {
    debug.log('=== STARTING RESOURCES PAGE ===');
    
    const currentUser = await getCurrentUser();
    debug.log('Step 1: Current user', currentUser ? `Logged in: ${currentUser.id}` : 'Not logged in');
    
    const search = searchParams.search || '';
    const programmeFilter = searchParams.programme || '';
    const yearFilter = searchParams.year || '';
    const sort = searchParams.sort || 'recent';
    debug.log('Step 2: Search params', { search, programmeFilter, yearFilter, sort });

    // STEP 3: Check resources table
    debug.log('Step 3: Checking resources table...');
    let totalResources = 0;
    try {
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(resources);
      totalResources = countResult[0]?.count || 0;
      debug.log('Step 3: Total resources in database', totalResources);
    } catch (countError) {
      debug.error('Step 3: Error counting resources', countError);
    }

    // STEP 4: Check what status values exist
    debug.log('Step 4: Checking resource statuses...');
    try {
      const statuses = await db
        .select({ status: resources.status })
        .from(resources)
        .groupBy(resources.status);
      debug.log('Step 4: Available statuses', statuses.map(s => s.status));
    } catch (statusError) {
      debug.error('Step 4: Error fetching statuses', statusError);
    }

    // Build query - using snake_case column names to match database
    debug.log('Step 5: Building main query...');
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

    debug.log('Step 6: Query built successfully');

    if (search) {
      debug.log('Step 7: Adding search filter', search);
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
      debug.log('Step 8: Adding programme filter', programmeFilter);
      query = query.where(eq(resources.programmeId, programmeFilter));
    }
    if (yearFilter) {
      debug.log('Step 9: Adding year filter', yearFilter);
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

    debug.log('Step 10: Executing main query...');
    const resourceList = await query.limit(24);
    debug.log('Step 11: Resources fetched', resourceList.length);

    // Get programmes for filters
    debug.log('Step 12: Fetching programmes...');
    const programmesList = await db.select().from(programmes).where(eq(programmes.isActive, true));
    debug.log('Step 13: Programmes fetched', programmesList.length);

    // Get categories
    debug.log('Step 14: Fetching categories...');
    const categories = await db.select().from(resourceCategories).orderBy(resourceCategories.name);
    debug.log('Step 15: Categories fetched', categories.length);

    // Get popular resources
    debug.log('Step 16: Fetching popular resources...');
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
    debug.log('Step 17: Popular resources fetched', popularResources.length);

    // Get recent resources
    debug.log('Step 18: Fetching recent resources...');
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
    debug.log('Step 19: Recent resources fetched', recentResources.length);

    const resourceTypes = ['Past Paper', 'Lecture Notes', 'Study Guide', 'Handout', 'Course Outline', 'Research', 'Assignment', 'Textbook', 'Other'];

    debug.log('Step 20: Rendering page...');
    debug.log('Step 21: Final summary', {
      totalResources,
      resourceListCount: resourceList.length,
      popularResourcesCount: popularResources.length,
      recentResourcesCount: recentResources.length,
      programmesCount: programmesList.length,
      categoriesCount: categories.length,
    });

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
    debug.error('FATAL: ResourcesPage error', error);
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
