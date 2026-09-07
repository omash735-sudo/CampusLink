// app/api/mentors/requests/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorshipRequests, mentorships, campuslinkUsers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';

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
    const requestData = await db
      .select()
      .from(mentorshipRequests)
      .where(eq(mentorshipRequests.id, params.id))
      .then(res => res[0]);

    if (!requestData) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Verify the mentor owns this request
    const mentor = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, user.id))
      .then(res => res[0]);

    if (!mentor || mentor.id !== requestData.mentorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (action === 'accept') {
      // Update request status
      await db.update(mentorshipRequests)
        .set({ status: 'accepted', updatedAt: new Date() })
        .where(eq(mentorshipRequests.id, params.id));

      // Create mentorship record
      const [mentorship] = await db.insert(mentorships).values({
        mentorId: requestData.mentorId,
        studentId: requestData.studentId,
        requestId: requestData.id,
        status: 'active',
        startedAt: new Date(),
      }).returning();

      return NextResponse.json({ mentorship, status: 'accepted' });
    } else {
      // Decline
      await db.update(mentorshipRequests)
        .set({ status: 'declined', updatedAt: new Date() })
        .where(eq(mentorshipRequests.id, params.id));

      return NextResponse.json({ status: 'declined' });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
