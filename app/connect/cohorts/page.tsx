// app/connect/cohorts/page.tsx
import { db } from '@/lib/db';
import { programmes, cohorts } from '@/lib/db/schema';
import { eq, desc, count, and, sql } from 'drizzle-orm';
import Link from 'next/link';
import { UserGroupIcon } from '@/components/icons';

export default async function CohortsPage() {
  const programmesWithCohorts = await db
    .select({
      id: programmes.id,
      name: programmes.name,
      slug: programmes.slug,
      faculty: programmes.faculty,
      description: programmes.description,
    })
    .from(programmes)
    .where(eq(programmes.isActive, true))
    .orderBy(programmes.faculty);

  const cohortCounts = await db
    .select({
      programmeId: cohorts.programmeId,
      count: sql<number>`count(*)`,
    })
    .from(cohorts)
    .groupBy(cohorts.programmeId);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserGroupIcon className="h-8 w-8 text-primary-green" />
            Cohorts
          </h1>
          <p className="text-muted-text mt-2">
            Find your academic cohort and connect with students in your programme and year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmesWithCohorts.map((programme) => {
            const cohortCount = cohortCounts.find(c => c.programmeId === programme.id)?.count || 0;
            
            return (
              <Link
                key={programme.id}
                href={`/connect/programmes/${programme.slug}`}
                className="border border-gray-200 bg-white hover:border-primary-green transition-colors overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{programme.name}</h3>
                  {programme.faculty && (
                    <p className="text-sm text-muted-text">{programme.faculty}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-muted-text">
                      {cohortCount} cohorts
                    </span>
                    {programme.description && (
                      <span className="text-sm text-muted-text line-clamp-1">
                        {programme.description}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-primary-green font-medium">
                    View cohorts →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
