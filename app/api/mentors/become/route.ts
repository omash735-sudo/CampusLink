// app/api/mentors/become/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Check if user already has a mentor profile
    const existingMentor = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id))
      .then(res => res[0]);

    if (existingMentor) {
      return NextResponse.json(
        { error: 'You already have a mentor profile' },
        { status: 400 }
      );
    }

    // Create mentor profile
    const [mentor] = await db.insert(mentors).values({
      userId: user.id,
      status: 'pending',
      expertise: body.expertise || [],
      subjects: body.subjects || [],
      introduction: body.introduction,
      experience: body.experience,
    }).returning();

    // Update user to mark as mentor
    await db.update(users)
      .set({ mentorType: body.mentorType || 'Student' })
      .where(eq(users.id, user.id));

    return NextResponse.json({ mentor });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to apply' },
      { status: 500 }
    );
  }
}
