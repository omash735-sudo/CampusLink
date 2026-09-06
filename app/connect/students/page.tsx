// app/connect/students/page.tsx
import { db } from '@/lib/db';
import { users, programmes } from '@/lib/db/schema';
import { eq, desc, and, sql, like, or } from 'drizzle-orm';
import { StudentGrid } from '@/components/connect/StudentGrid';
import { StudentFilters } from '@/components/connect/StudentFilters';
import { StudentSearch } from '@/components/connect/StudentSearch';
import { AcademicIcon } from '@/components/icons';
import Link from 'next/link';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { search?: string; programme?: string; year?: string }
}) {
  const search = searchParams.search || '';
  const programmeFilter = searchParams.programme || '';
  const yearFilter = searchParams.year || '';

  const programmesList = await db.select().from(programmes).where(eq(programmes.isActive, true));

  // Build conditions array
  const conditions = [];
  
  // Always add active condition
  conditions.push(eq(users.isActive, true));
  
  // Add search conditions if search exists
  if (search) {
    conditions.push(
      or(
        like(users.fullName, `%${search}%`),
        like(users.username, `%${search}%`),
        like(users.programme, `%${search}%`)
      )
    );
  }

  // Add programme filter if exists
  if (programmeFilter) {
    conditions.push(eq(users.programme, programmeFilter));
  }

  // Add year filter if exists
  if (yearFilter) {
    conditions.push(eq(users.year, parseInt(yearFilter)));
  }

  // Execute query with all conditions
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
    .where(and(...conditions))
    .orderBy(desc(users.createdAt));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/connect" className="text-primary-green hover:underline text-sm">
            ← Back to Connect
          </Link>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            <AcademicIcon className="h-8 w-8 text-primary-green" />
            All Students
          </h1>
          <p className="text-muted-text mt-1">Browse and discover students across campus.</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="max-w-2xl">
            <StudentSearch />
          </div>
          <div className="mt-4">
            <StudentFilters programmes={programmesList} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {students.length} student{students.length !== 1 ? 's' : ''} found
            </h2>
          </div>
          <StudentGrid students={students} />
        </div>
      </div>
    </div>
  );
}
