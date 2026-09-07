// app/api/mentors/become/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers, mentors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Check if user already has mentor status
    if (user.isMentor) {
      return NextResponse.json(
        { error: 'You are already a mentor' },
        { status: 400 }
      );
    }

    // Check if user has a pending application
    if (user.mentorStatus === 'pending') {
      return NextResponse.json(
        { error: 'You already have a pending mentor application' },
        { status: 400 }
      );
    }

    // Create mentor profile
    const [mentor] = await db.insert(mentors).values({
      userId: user.id,
      status: 'pending',
      expertise: body.expertise || [],
      subjects: body.subjects || [],
      availability: body.availability || 'available',
      introduction: body.bio || '',
      experience: '',
    }).returning();

    // Update user's mentor status
    await db.update(campuslinkUsers)
      .set({
        mentorStatus: 'pending',
        mentorType: body.mentorType || 'Student',
        updatedAt: new Date(),
      })
      .where(eq(campuslinkUsers.id, user.id));

    return NextResponse.json({ mentor });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
