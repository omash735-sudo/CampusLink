// app/connect/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, programmes, interests, studentInterests, connections, groups } from '@/lib/db/schema';
import { eq, desc, and, not, sql, inArray } from 'drizzle-orm';
import Link from 'next/link';
import { StudentSearch } from '@/components/connect/StudentSearch';
import { PeopleYouMayKnow } from '@/components/connect/PeopleYouMayKnow';
import { MyCohort } from '@/components/connect/MyCohort';
import { StudentFilters } from '@/components/connect/StudentFilters';
import { StudentGrid } from '@/components/connect/StudentGrid';
import { UsersIcon, UserGroupIcon, BookOpenIcon, AcademicIcon, FilterIcon } from '@/components/icons';

interface InterestWithCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Debug logger that will appear in server logs and browser console
const debug = {
  log: (step: string, data?: any) => {
    console.log(`[DEBUG] ${step}`, data || '');
  },
  error: (step: string, error: any) => {
    console.error(`[DEBUG ERROR] ${step}:`, error);
    if (error instanceof Error) {
      console.error(`[DEBUG ERROR] Message: ${error.message}`);
      console.error(`[DEBUG ERROR] Stack: ${error.stack}`);
    }
  },
  table: (step: string, data: any) => {
    console.log(`[DEBUG TABLE] ${step}:`);
    console.table(data);
  }
};

export default async function ConnectPage() {
  try {
    debug.log('=== STARTING CONNECT PAGE ===');
    
    // STEP 1: Get current user
    debug.log('Step 1: Getting current user...');
    let currentUser = null;
    try {
      currentUser = await getCurrentUser();
      debug.log('Step 1: Current user retrieved', { 
        id: currentUser?.id || 'Not logged in',
        fullName: currentUser?.fullName || 'N/A',
        programme: currentUser?.programme || 'N/A',
        year: currentUser?.year || 'N/A'
      });
    } catch (authError) {
      debug.error('Step 1: Auth error', authError);
      throw new Error(`Authentication failed: ${authError instanceof Error ? authError.message : String(authError)}`);
    }
    
    // STEP 2: Fetch programmes
    debug.log('Step 2: Fetching programmes...');
    let programmesList = [];
    try {
      programmesList = await db.select().from(programmes).where(eq(programmes.isActive, true));
      debug.log('Step 2: Programmes fetched', { count: programmesList.length });
      if (programmesList.length > 0) {
        debug.log('Step 2: Sample programme', programmesList[0]);
      }
    } catch (programmesError) {
      debug.error('Step 2: Programmes fetch error', programmesError);
      throw new Error(`Failed to fetch programmes: ${programmesError instanceof Error ? programmesError.message : String(programmesError)}`);
    }
    
    // STEP 3: Fetch interests
    debug.log('Step 3: Fetching interests...');
    let popularInterests: InterestWithCount[] = [];
    try {
      // Check if interests table exists first
      try {
        const tableCheck = await db.execute(sql`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'interests')`);
        debug.log('Step 3: Interests table exists check', tableCheck);
      } catch (tableError) {
        debug.error('Step 3: Table check error', tableError);
      }
      
      popularInterests = await db.select({
        id: interests.id,
        name: interests.name,
        slug: interests.slug,
        count: sql<number>`count(${studentInterests.studentId})`
      })
      .from(interests)
      .leftJoin(studentInterests, eq(interests.id, studentInterests.interestId))
      .groupBy(interests.id, interests.name, interests.slug)
      .orderBy(sql`count(${studentInterests.studentId}) DESC`)
      .limit(12);
      debug.log('Step 3: Interests fetched', { count: popularInterests.length });
      if (popularInterests.length > 0) {
        debug.log('Step 3: Sample interest', popularInterests[0]);
      }
    } catch (interestsError) {
      debug.error('Step 3: Interests fetch error (non-fatal)', interestsError);
      popularInterests = [];
      debug.log('Step 3: Using empty interests array as fallback');
    }
    
    // STEP 4: Fetch recent students
    debug.log('Step 4: Fetching recent students...');
    let recentStudents = [];
    try {
      // First check if users table exists
      try {
        const userTableCheck = await db.execute(sql`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')`);
        debug.log('Step 4: Users table exists check', userTableCheck);
      } catch (tableError) {
        debug.error('Step 4: Users table check error', tableError);
      }
      
      recentStudents = await db.select({
        id: users.id,
        fullName: users.fullName,
        username: users.username,
        avatar: users.avatar,
        programme: users.programme,
        year: users.year,
        interests: users.interests,
      })
      .from(users)
      .where(eq(users.isActive, true))
      .orderBy(desc(users.createdAt))
      .limit(12);
      debug.log('Step 4: Recent students fetched', { count: recentStudents.length });
      if (recentStudents.length > 0) {
        debug.log('Step 4: Sample student', recentStudents[0]);
      }
    } catch (studentsError) {
      debug.error('Step 4: Students fetch error', studentsError);
      throw new Error(`Failed to fetch students: ${studentsError instanceof Error ? studentsError.message : String(studentsError)}`);
    }
    
    // STEP 5: Fetch communities
    debug.log('Step 5: Fetching communities...');
    let communities = [];
    try {
      communities = await db.select({
        id: groups.id,
        name: groups.name,
        slug: groups.slug,
        description: groups.description,
        memberCount: groups.memberCount,
        category: groups.category,
      })
      .from(groups)
      .where(eq(groups.type, 'open'))
      .orderBy(desc(groups.memberCount))
      .limit(8);
      debug.log('Step 5: Communities fetched', { count: communities.length });
      if (communities.length > 0) {
        debug.log('Step 5: Sample community', communities[0]);
      }
    } catch (communitiesError) {
      debug.error('Step 5: Communities fetch error', communitiesError);
      throw new Error(`Failed to fetch communities: ${communitiesError instanceof Error ? communitiesError.message : String(communitiesError)}`);
    }
    
    // STEP 6: Verify data before rendering
    debug.log('Step 6: Data summary', {
      currentUser: currentUser ? 'Exists' : 'None',
      programmesCount: programmesList.length,
      interestsCount: popularInterests.length,
      studentsCount: recentStudents.length,
      communitiesCount: communities.length
    });
    
    debug.log('Step 7: Rendering page...');
    
    return (
      <div className="min-h-screen bg-off-white">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-text flex items-center gap-2">
              <UsersIcon className="h-8 w-8 text-primary-green" />
              Find Your People
            </h1>
            <p className="text-lg text-muted-text mt-2">
              Connect with students, discover communities, and build your campus network.
            </p>
            <div className="mt-4 max-w-2xl">
              <StudentSearch />
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link 
              href="/connect/cohorts" 
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <UserGroupIcon className="h-8 w-8 text-primary-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">Cohorts</div>
              <div className="text-xs text-muted-text">Find your year</div>
            </Link>
            <Link 
              href="/connect/programmes" 
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <BookOpenIcon className="h-8 w-8 text-primary-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">Programmes</div>
              <div className="text-xs text-muted-text">Browse by faculty</div>
            </Link>
            <Link 
              href="/connect/communities" 
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <UsersIcon className="h-8 w-8 text-primary-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">Communities</div>
              <div className="text-xs text-muted-text">Join groups</div>
            </Link>
            <Link 
              href="/connect/students" 
              className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors group"
            >
              <AcademicIcon className="h-8 w-8 text-primary-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-sm">All Students</div>
              <div className="text-xs text-muted-text">Browse everyone</div>
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {currentUser && (
                <PeopleYouMayKnow currentUserId={currentUser.id} />
              )}

              {currentUser && currentUser.programme && currentUser.year && (
                <MyCohort 
                  programme={currentUser.programme} 
                  year={currentUser.year} 
                  currentUserId={currentUser.id}
                />
              )}

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Recent Students</h2>
                  <Link href="/connect/students" className="text-primary-green hover:underline text-sm">
                    View all →
                  </Link>
                </div>
                <StudentGrid students={recentStudents} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Active Communities</h2>
                  <Link href="/connect/communities" className="text-primary-green hover:underline text-sm">
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {communities.length > 0 ? (
                    communities.map((community) => (
                      <Link
                        key={community.id}
                        href={`/groups/${community.slug}`}
                        className="border border-gray-200 bg-white p-4 hover:border-primary-green transition-colors"
                      >
                        <h3 className="font-semibold">{community.name}</h3>
                        <p className="text-sm text-muted-text line-clamp-1">{community.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-text">{community.memberCount} members</span>
                          {community.category && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5">
                              {community.category}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-muted-text col-span-2">No active communities yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Filters */}
            <div className="space-y-6">
              <div className="border border-gray-200 bg-white p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  Filter Students
                </h3>
                <StudentFilters programmes={programmesList} />
              </div>

              {popularInterests.length > 0 && (
                <div className="border border-gray-200 bg-white p-4">
                  <h3 className="font-semibold mb-3">Popular Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularInterests.map((interest) => (
                      <Link
                        key={interest.id}
                        href={`/connect/interests/${interest.slug}`}
                        className="text-xs bg-gray-100 px-3 py-1.5 hover:bg-primary-green hover:text-white transition-colors"
                      >
                        {interest.name} ({interest.count})
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    debug.error('FATAL: ConnectPage error', error);
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
        <div className="border border-gray-200 bg-white p-8 max-w-md text-center">
          <div className="h-12 w-12 border-2 border-primary-green bg-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-primary-text mb-4">Something went wrong</h2>
          <p className="text-muted-text">Unable to load the connect page. Please try again later.</p>
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
