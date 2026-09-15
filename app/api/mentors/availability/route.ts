// app/api/mentors/availability/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, mentorAvailabilitySlots } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireMentor();
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

    const slots = await db
      .select()
      .from(mentorAvailabilitySlots)
      .where(eq(mentorAvailabilitySlots.mentorId, mentor.id));

    return NextResponse.json(slots);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireMentor();
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    if (
      typeof dayOfWeek !== 'number' ||
      dayOfWeek < 0 ||
      dayOfWeek > 6 ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json({ error: 'Invalid slot' }, { status: 400 });
    }

    const [slot] = await db
      .insert(mentorAvailabilitySlots)
      .values({ mentorId: mentor.id, dayOfWeek, startTime, endTime })
      .returning();

    return NextResponse.json(slot);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireMentor();
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await db
      .delete(mentorAvailabilitySlots)
      .where(
        and(
          eq(mentorAvailabilitySlots.id, id),
          eq(mentorAvailabilitySlots.mentorId, mentor.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
