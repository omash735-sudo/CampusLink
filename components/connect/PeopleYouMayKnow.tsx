// components/connect/PeopleYouMayKnow.tsx
import { db } from '@/lib/db';
import { users, studentInterests, connections } from '@/lib/db/schema';
import { eq, and, ne, not, desc, sql } from 'drizzle-orm';
import { StudentGrid } from './StudentGrid';
import { getCurrentUser } from '@/lib/auth';
import { UsersIcon } from '@/components/icons';

export async function PeopleYouMayKnow({ currentUserId }: { currentUserId: string }) {
  const currentUser = await db.select({
    id: users.id,
    programme: users.programme,
    year: users.year,
  })
  .from(users)
  .where(eq(users.id, currentUserId))
  .then(res => res[0]);

  if (!currentUser) return null;
  
  // Only show recommendations if user has a programme
  if (!currentUser.programme) return null;

  const recommendedStudents = await db
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
      ne(users.id, currentUserId),
      eq(users.programme, currentUser.programme)
    ))
    .orderBy(desc(users.createdAt))
    .limit(6);

  if (recommendedStudents.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <UsersIcon className="h-6 w-6 text-primary-green" />
        People You May Know
      </h2>
      <p className="text-muted-text text-sm mb-4">
        Students in your academic circle — same programme, same interests.
      </p>
      <StudentGrid students={recommendedStudents} />
    </div>
  );
}
