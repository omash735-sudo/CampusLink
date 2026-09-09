// app/api/mentors/requests/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorshipRequests, mentorships, campuslinkUsers, mentors } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';
import { notifyMentorshipRequestAccepted, notifyMentorshipRequestDeclined } from '@/lib/services/notification.service';
import { sendMentorshipRequestEmail } from '@/lib/services/email.service';

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
    const mentorUser = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, user.id))
      .then(res => res[0]);

    if (!mentorUser || mentorUser.id !== requestData.mentorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get mentor profile for notifications
    const mentorProfile = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, mentorUser.id))
      .then(res => res[0]);

    // Get student data for notifications
    const student = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, requestData.studentId))
      .then(res => res[0]);

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

      // Send notification to student
      await notifyMentorshipRequestAccepted(requestData.studentId, mentorUser.fullName);
      
      // Send email to student (if email service configured)
      if (student?.email) {
        await sendMentorshipRequestEmail(student.email, student.fullName, mentorUser.fullName);
      }

      return NextResponse.json({ mentorship, status: 'accepted' });
    } else {
      // Decline
      await db.update(mentorshipRequests)
        .set({ status: 'declined', updatedAt: new Date() })
        .where(eq(mentorshipRequests.id, params.id));

      // Send notification to student
      await notifyMentorshipRequestDeclined(requestData.studentId, mentorUser.fullName);

      return NextResponse.json({ status: 'declined' });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
