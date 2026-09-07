// app/api/profile/update/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { fullName, username, bio, programme, year, interests } = body;

    // Check if username is taken by another user
    if (username && username !== user.username) {
      const existing = await db
        .select()
        .from(campuslinkUsers)
        .where(eq(campuslinkUsers.username, username))
        .then(res => res[0]);

      if (existing) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    const [updated] = await db.update(campuslinkUsers)
      .set({
        fullName: fullName || user.fullName,
        username: username || user.username,
        bio: bio || user.bio,
        programme: programme || user.programme,
        year: year || user.year,
        interests: interests || user.interests,
        updatedAt: new Date(),
      })
      .where(eq(campuslinkUsers.id, user.id))
      .returning();

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
