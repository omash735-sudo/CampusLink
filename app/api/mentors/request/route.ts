// app/api/mentors/request/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorshipRequests, mentors, campuslinkUsers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { notifyMentorshipRequestReceived } from '@/lib/services/notification.service';
import { sendMentorshipRequestEmail } from '@/lib/services/email.service';

interface RequestBody {
  mentorUsername: string;
  message?: string;
  helpNeeded?: string[];
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body: RequestBody = await request.json();
    const { mentorUsername, message, helpNeeded } = body;

    if (!mentorUsername) {
      return NextResponse.json(
        { error: 'Mentor username is required' },
        { status: 400 }
      );
    }

    // Get the mentor user
    const mentorUser = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.username, mentorUsername))
      .then(res => res[0]);

    if (!mentorUser) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    // Check if mentor exists and is approved
    const mentor = await db
      .select()
      .from(mentors)
      .where(and(
        eq(mentors.userId, mentorUser.id),
        eq(mentors.status, 'approved')
      ))
      .then(res => res[0]);

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    // Check if user already has a pending request
    const existingRequest = await db
      .select()
      .from(mentorshipRequests)
      .where(and(
        eq(mentorshipRequests.studentId, user.id),
        eq(mentorshipRequests.mentorId, mentor.id),
        eq(mentorshipRequests.status, 'pending')
      ))
      .then(res => res[0]);

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending request with this mentor' },
        { status: 400 }
      );
    }

    // Create mentorship request
    const [request] = await db.insert(mentorshipRequests).values({
      mentorId: mentor.id,
      studentId: user.id,
      message: message || '',
      helpNeeded: helpNeeded || [],
      status: 'pending',
    }).returning();

    // Send notifications
    await notifyMentorshipRequestReceived(mentor.id, user.id, user.fullName);
    await sendMentorshipRequestEmail(mentorUser.email, mentorUser.fullName, user.fullName);

    return NextResponse.json({ request });
  } catch (error: any) {
    console.error('Mentorship request error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send request' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
