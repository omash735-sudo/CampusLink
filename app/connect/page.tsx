// app/connect/page.tsx
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, programmes, interests, studentInterests, connections, groups } from '@/lib/db/schema';
import { eq, desc, count, and, not, sql, inArray } from 'drizzle-orm';
import Link from 'next/link';
import { StudentSearch } from '@/components/connect/StudentSearch';
import { PeopleYouMayKnow } from '@/components/connect/PeopleYouMayKnow';
import { MyCohort } from '@/components/connect/MyCohort';
import { StudentFilters } from '@/components/connect/StudentFilters';
import { StudentGrid } from '@/components/connect/StudentGrid';

export default async function ConnectPage() {
  const currentUser = await getCurrentUser();
  
  // Get programmes for filter
  const programmesList = await db.select().from(programmes).where(eq(programmes.isActive, true));
  
  // Get popular interests
  const popularInterests = await db.select({
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

  // Get recent students
  const recentStudents = await db.select({
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

  // Get communities
  const communities = await db.select({
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

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">Find Your People</h1>
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
            className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors"
          >
            <div className="text-2xl mb-1">👥</div>
            <div className="font-medium text-sm">Cohorts</div>
            <div className="text-xs text-muted-text">Find your year</div>
          </Link>
          <Link 
            href="/connect/programmes" 
            className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors"
          >
            <div className="text-2xl mb-1">📚</div>
            <div className="font-medium text-sm">Programmes</div>
            <div className="text-xs text-muted-text">Browse by faculty</div>
          </Link>
          <Link 
            href="/connect/communities" 
            className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors"
          >
            <div className="text-2xl mb-1">🌟</div>
            <div className="font-medium text-sm">Communities</div>
            <div className="text-xs text-muted-text">Join groups</div>
          </Link>
          <Link 
            href="/connect/students" 
            className="border border-gray-200 bg-white p-4 text-center hover:border-primary-green transition-colors"
          >
            <div className="text-2xl mb-1">🎓</div>
            <div className="font-medium text-sm">All Students</div>
            <div className="text-xs text-muted-text">Browse everyone</div>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* People You May Know - Only for logged in users */}
            {currentUser && (
              <PeopleYouMayKnow currentUserId={currentUser.id} />
            )}

            {/* My Cohort - Only for logged in users */}
            {currentUser && currentUser.programme && (
              <MyCohort 
                programme={currentUser.programme} 
                year={currentUser.year} 
                currentUserId={currentUser.id}
              />
            )}

            {/* Student Grid */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recent Students</h2>
                <Link href="/connect/students" className="text-primary-green hover:underline text-sm">
                  View all →
                </Link>
              </div>
              <StudentGrid students={recentStudents} currentUserId={currentUser?.id} />
            </div>

            {/* Communities */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Active Communities</h2>
                <Link href="/connect/communities" className="text-primary-green hover:underline text-sm">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {communities.map((community) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Filters */}
          <div className="space-y-6">
            <div className="border border-gray-200 bg-white p-4">
              <h3 className="font-semibold mb-3">Filter Students</h3>
              <StudentFilters programmes={programmesList} />
            </div>

            {/* Popular Interests */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
