// components/connect/PeopleYouMayKnow.tsx
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { StudentGrid } from './StudentGrid';
import { UsersIcon } from '@/components/icons';

export async function PeopleYouMayKnow({ currentUserId }: { currentUserId: string }) {
  const currentUser = await db.select({
    id: campuslinkUsers.id,
    programme: campuslinkUsers.programme,
    year: campuslinkUsers.year,
  })
  .from(campuslinkUsers)
  .where(eq(campuslinkUsers.id, currentUserId))
  .then(res => res[0]);

  if (!currentUser) return null;
  if (!currentUser.programme) return null;

  const recommendedStudents = await db
    .select({
      id: campuslinkUsers.id,
      fullName: campuslinkUsers.fullName,
      username: campuslinkUsers.username,
      avatar: campuslinkUsers.avatar,
      programme: campuslinkUsers.programme,
      year: campuslinkUsers.year,
      interests: campuslinkUsers.interests,
    })
    .from(campuslinkUsers)
    .where(and(
      eq(campuslinkUsers.isActive, true),
      ne(campuslinkUsers.id, currentUserId),
      eq(campuslinkUsers.programme, currentUser.programme)
    ))
    .orderBy(desc(campuslinkUsers.createdAt))
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
