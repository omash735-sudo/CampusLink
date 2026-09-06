// components/connect/MyCohort.tsx
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import Link from 'next/link';
import { UserGroupIcon, UserIcon } from '@/components/icons';

export async function MyCohort({ 
  programme, 
  year, 
  currentUserId 
}: { 
  programme: string; 
  year: number; 
  currentUserId: string;
}) {
  const cohortStudents = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      username: users.username,
      avatar: users.avatar,
    })
    .from(users)
    .where(and(
      eq(users.isActive, true),
      eq(users.programme, programme),
      eq(users.year, year),
      ne(users.id, currentUserId)
    ))
    .limit(12);

  if (cohortStudents.length === 0) return null;

  return (
    <div className="border border-gray-200 bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-primary-green" />
          My Cohort
        </h2>
        <Link 
          href={`/connect/programmes/${programme.toLowerCase().replace(/\s+/g, '-')}`} 
          className="text-primary-green hover:underline text-sm"
        >
          View all →
        </Link>
      </div>
      <p className="text-muted-text text-sm mb-4">
        {programme} — Year {year}
      </p>
      <div className="flex flex-wrap gap-3">
        {cohortStudents.map((student) => (
          <Link
            key={student.id}
            href={`/profile/${student.username}`}
            className="flex items-center gap-2 border border-gray-200 px-3 py-2 hover:border-primary-green transition-colors"
          >
            <div className="h-8 w-8 border border-gray-200 bg-primary-green text-white flex items-center justify-center text-xs font-semibold">
              {student.avatar ? (
                <img src={student.avatar} alt={student.fullName} className="h-full w-full object-cover" />
              ) : (
                student.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              )}
            </div>
            <span className="text-sm flex items-center gap-1">
              <UserIcon className="h-3 w-3 text-muted-text" />
              {student.fullName}
            </span>
          </Link>
        ))}
        {cohortStudents.length > 12 && (
          <span className="text-sm text-muted-text">+{cohortStudents.length - 12} more</span>
        )}
      </div>
    </div>
  );
}
