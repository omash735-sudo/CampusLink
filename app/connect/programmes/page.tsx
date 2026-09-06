// app/connect/programmes/page.tsx
import { db } from '@/lib/db';
import { programmes, users } from '@/lib/db/schema';
import { eq, count, sql } from 'drizzle-orm';
import Link from 'next/link';
import { BookOpenIcon } from '@/components/icons';

export default async function ProgrammesPage() {
  const programmesWithCounts = await db
    .select({
      id: programmes.id,
      name: programmes.name,
      slug: programmes.slug,
      faculty: programmes.faculty,
      department: programmes.department,
      description: programmes.description,
      degree: programmes.degree,
      duration: programmes.duration,
    })
    .from(programmes)
    .where(eq(programmes.isActive, true))
    .orderBy(programmes.faculty, programmes.name);

  const studentCounts = await db
    .select({
      programme: users.programme,
      count: sql<number>`count(*)`,
    })
    .from(users)
    .where(eq(users.isActive, true))
    .groupBy(users.programme);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpenIcon className="h-8 w-8 text-primary-green" />
            Programmes
          </h1>
          <p className="text-muted-text mt-2">
            Explore all programmes offered at LUANAR City Campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programmesWithCounts.map((programme) => {
            const studentCount = studentCounts.find(s => s.programme === programme.name)?.count || 0;
            
            return (
              <Link
                key={programme.id}
                href={`/connect/programmes/${programme.slug}`}
                className="border border-gray-200 bg-white hover:border-primary-green transition-colors p-6"
              >
                <h3 className="text-xl font-semibold text-primary-text">{programme.name}</h3>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {programme.faculty && (
                    <span className="text-sm text-muted-text">{programme.faculty}</span>
                  )}
                  {programme.degree && (
                    <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5">
                      {programme.degree}
                    </span>
                  )}
                </div>

                {programme.description && (
                  <p className="text-sm text-muted-text mt-2 line-clamp-2">
                    {programme.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-muted-text">
                    {studentCount} students
                  </span>
                  {programme.duration && (
                    <span className="text-sm text-muted-text">
                      {programme.duration} years
                    </span>
                  )}
                  {programme.department && (
                    <span className="text-sm text-muted-text">
                      {programme.department}
                    </span>
                  )}
                </div>

                <div className="mt-4 text-sm text-primary-green font-medium">
                  View students →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
