// app/api/mentors/requests/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorshipRequests, mentorships, mentors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';

export const runtime = 'nodejs';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireMentor();
    const body = await request.json();
    const { action } = body;

    if (!action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "accept" or "decline"' },
        { status: 400 }
      );
    }

    // Get the request
    const [requestData] = await db
      .select()
      .from(mentorshipRequests)
      .where(eq(mentorshipRequests.id, params.id))
      .limit(1);

    if (!requestData) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Look up the mentor profile belonging to this user
    const [mentorProfile] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id))
      .limit(1);

    if (!mentorProfile || mentorProfile.id !== requestData.mentorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (action === 'accept') {
      await db
        .update(mentorshipRequests)
        .set({ status: 'accepted', updatedAt: new Date() })
        .where(eq(mentorshipRequests.id, params.id));

      const [mentorship] = await db
        .insert(mentorships)
        .values({
          mentorId: requestData.mentorId,
          studentId: requestData.studentId,
          requestId: requestData.id,
          status: 'active',
          startedAt: new Date(),
        })
        .returning();

      return NextResponse.json({ mentorship, status: 'accepted' });
    } else {
      await db
        .update(mentorshipRequests)
        .set({ status: 'declined', updatedAt: new Date() })
        .where(eq(mentorshipRequests.id, params.id));

      return NextResponse.json({ status: 'declined' });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: error.status === 401 ? 401 : 500 }
    );
  }
}
