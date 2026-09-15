// app/api/mentors/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireMentor();
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json({ error: 'Not a mentor' }, { status: 404 });

    return NextResponse.json({
      introduction: mentor.introduction,
      expertise: mentor.expertise || [],
      subjects: mentor.subjects || [],
      experience: mentor.experience,
      availability: mentor.availability,
      mentorType: user.mentorType || 'Student',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireMentor();
    const body = await request.json();

    await db
      .update(mentors)
      .set({
        introduction: body.introduction || null,
        expertise: body.expertise || [],
        subjects: body.subjects || [],
        experience: body.experience || null,
        availability: body.availability || 'available',
        updatedAt: new Date(),
      })
      .where(eq(mentors.userId, user.id));

    await db
      .update(campuslinkUsers)
      .set({ mentorType: body.mentorType || 'Student', updatedAt: new Date() })
      .where(eq(campuslinkUsers.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
