// app/api/mentors/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';

export const runtime = 'nodejs';

const AVAILABILITY_OPTIONS = ['available', 'limited', 'unavailable'];
const MENTOR_TYPES = ['Student', 'Alumni', 'Professional', 'Staff'];

export async function GET() {
  let user;
  try {
    user = await requireMentor();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id))
      .limit(1);
    if (!mentor) {
      return NextResponse.json({ error: 'Not a mentor' }, { status: 404 });
    }

    return NextResponse.json({
      introduction: mentor.introduction,
      expertise: mentor.expertise || [],
      subjects: mentor.subjects || [],
      experience: mentor.experience,
      availability: mentor.availability,
      mentorType: user.mentorType || 'Student',
      // Contact preferences — needed by the mentor profile page
      preferredContactMethod: mentor.preferredContactMethod,
      contactWhatsapp: mentor.contactWhatsapp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  let user;
  try {
    user = await requireMentor();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // --- Validate incoming types ---
    if (body.expertise !== undefined && !Array.isArray(body.expertise)) {
      return NextResponse.json(
        { error: 'expertise must be an array' },
        { status: 400 }
      );
    }
    if (body.subjects !== undefined && !Array.isArray(body.subjects)) {
      return NextResponse.json(
        { error: 'subjects must be an array' },
        { status: 400 }
      );
    }
    if (
      body.availability !== undefined &&
      !AVAILABILITY_OPTIONS.includes(body.availability)
    ) {
      return NextResponse.json(
        { error: `availability must be one of: ${AVAILABILITY_OPTIONS.join(', ')}` },
        { status: 400 }
      );
    }
    if (
      body.mentorType !== undefined &&
      !MENTOR_TYPES.includes(body.mentorType)
    ) {
      return NextResponse.json(
        { error: `mentorType must be one of: ${MENTOR_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // --- Build mentor patch (only fields present in body) ---
    const mentorPatch: any = { updatedAt: new Date() };
    if (body.introduction !== undefined) {
      mentorPatch.introduction = body.introduction || null;
    }
    if (body.expertise !== undefined) {
      mentorPatch.expertise = body.expertise.length > 0 ? body.expertise : null;
    }
    if (body.subjects !== undefined) {
      mentorPatch.subjects = body.subjects.length > 0 ? body.subjects : null;
    }
    if (body.experience !== undefined) {
      mentorPatch.experience = body.experience || null;
    }
    if (body.availability !== undefined) {
      mentorPatch.availability = body.availability;
    }

    await db
      .update(mentors)
      .set(mentorPatch)
      .where(eq(mentors.userId, user.id));

    // --- Update mentorType on the user record if provided ---
    if (body.mentorType !== undefined) {
      await db
        .update(campuslinkUsers)
        .set({ mentorType: body.mentorType, updatedAt: new Date() })
        .where(eq(campuslinkUsers.id, user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: 500 }
    );
  }
}
