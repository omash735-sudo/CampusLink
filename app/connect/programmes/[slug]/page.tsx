// app/connect/programmes/[slug]/page.tsx
import { db } from '@/lib/db';
import { programmes, users, cohorts } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StudentGrid } from '@/components/connect/StudentGrid';
import { BookOpenIcon, UserGroupIcon } from '@/components/icons';

export default async function ProgrammeDetailPage({ params }: { params: { slug: string } }) {
  const programme = await db
    .select()
    .from(programmes)
    .where(eq(programmes.slug, params.slug))
    .then(res => res[0]);

  if (!programme) {
    notFound();
  }

  const students = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      username: users.username,
      avatar: users.avatar,
      programme: users.programme,
      year: users.year,
      interests: users.interests,
    })
    .from(users)
    .where(and(
      eq(users.isActive, true),
      eq(users.programme, programme.name)
    ))
    .orderBy(desc(users.createdAt));

  const programmeCohorts = await db
    .select()
    .from(cohorts)
    .where(eq(cohorts.programmeId, programme.id))
    .orderBy(cohorts.year);

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/connect/programmes" className="text-primary-green hover:underline text-sm">
            ← Back to Programmes
          </Link>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            <BookOpenIcon className="h-8 w-8 text-primary-green" />
            {programme.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {programme.faculty && (
              <span className="text-muted-text">{programme.faculty}</span>
            )}
            {programme.degree && (
              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5">
                {programme.degree}
              </span>
            )}
            {programme.duration && (
              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5">
                {programme.duration} years
              </span>
            )}
          </div>
          {programme.description && (
            <p className="text-muted-text mt-2 max-w-2xl">{programme.description}</p>
          )}
        </div>

        {programmeCohorts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserGroupIcon className="h-6 w-6 text-primary-green" />
              Cohorts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {programmeCohorts.map((cohort) => (
                <Link
                  key={cohort.id}
                  href={`/connect/cohorts/${cohort.id}`}
                  className="border border-gray-200 bg-white p-4 hover:border-primary-green transition-colors text-center"
                >
                  <div className="text-2xl font-bold text-primary-green">Year {cohort.year}</div>
                  <div className="text-sm text-muted-text">{cohort.academicYear}</div>
                  <div className="text-sm text-muted-text mt-1">{cohort.studentCount} students</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Students ({students.length})</h2>
          <StudentGrid students={students} />
        </div>
      </div>
    </div>
  );
}
