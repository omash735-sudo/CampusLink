// app/admin/student-union/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { studentUnionMembers } from '@/lib/db/schema';
import { desc, asc } from 'drizzle-orm';
import { MemberRow } from './MemberRow';

export const dynamic = 'force-dynamic';

export default async function StudentUnionAdminPage() {
  const rows = await db
    .select()
    .from(studentUnionMembers)
    .orderBy(desc(studentUnionMembers.academicYear), asc(studentUnionMembers.sortOrder));

  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.academicYear]) acc[row.academicYear] = [];
    acc[row.academicYear].push(row);
    return acc;
  }, {} as Record<string, typeof rows>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Union</h1>
          <p className="text-sm text-gray-500">
            Manage the union members shown on the public homepage.
          </p>
        </div>
        <Link
          href="/admin/student-union/new"
          className="bg-primary-green text-white px-4 py-2 font-medium hover:bg-deep-green transition-colors"
        >
          + Add Member
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No union members yet.</p>
          <Link
            href="/admin/student-union/new"
            className="text-primary-green hover:underline"
          >
            Add the first member →
          </Link>
        </div>
      ) : (
        Object.entries(grouped).map(([year, members]) => (
          <div key={year} className="bg-white border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold">Academic Year {year}</h2>
              <p className="text-xs text-gray-500">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {members.map((m) => (
                <MemberRow key={m.id} member={m} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
