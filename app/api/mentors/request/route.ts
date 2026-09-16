// app/api/mentors/request/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  mentors,
  mentorshipRequests,
  mentorships,
  campuslinkUsers,
} from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireMentor, requireAuth } from '@/lib/auth';
import {
  sendMentorshipRequestEmail,
  sendMentorshipRequestAcceptedEmail,
  sendMentorshipRequestDeclinedEmail,
} from '@/lib/services/email.service';
import {
  notifyMentorshipRequestReceived,
  notifyMentorshipRequestAccepted,
  notifyMentorshipRequestDeclined,
} from '@/lib/services/notification.service';

export const runtime = 'nodejs';

// GET — mentor fetches their incoming requests
export async function GET() {
  try {
    const user = await requireMentor();
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json([]);

    const rows = await db
      .select({
        id: mentorshipRequests.id,
        message: mentorshipRequests.message,
        introduction: mentorshipRequests.introduction,
        helpNeeded: mentorshipRequests.helpNeeded,
        status: mentorshipRequests.status,
        createdAt: mentorshipRequests.createdAt,
        student: {
          id: campuslinkUsers.id,
          fullName: campuslinkUsers.fullName,
          username: campuslinkUsers.username,
          programme: campuslinkUsers.programme,
          year: campuslinkUsers.year,
          avatar: campuslinkUsers.avatar,
        },
      })
      .from(mentorshipRequests)
      .leftJoin(campuslinkUsers, eq(mentorshipRequests.studentId, campuslinkUsers.id))
      .where(eq(mentorshipRequests.mentorId, mentor.id))
      .orderBy(desc(mentorshipRequests.createdAt));

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST — student sends a new request
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { mentorUsername, message, helpNeeded } = body;

    if (!mentorUsername || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const [mentorUser] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.username, mentorUsername));
    if (!mentorUser) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    const [mentor] = await db
      .select()
      .from(mentors)
      .where(and(eq(mentors.userId, mentorUser.id), eq(mentors.status, 'approved')));
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not approved' }, { status: 404 });
    }

    if (mentorUser.id === user.id) {
      return NextResponse.json({ error: 'Cannot request yourself' }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(mentorshipRequests)
      .where(
        and(
          eq(mentorshipRequests.mentorId, mentor.id),
          eq(mentorshipRequests.studentId, user.id),
          eq(mentorshipRequests.status, 'pending')
        )
      );
    if (existing) {
      return NextResponse.json(
        { error: 'You already have a pending request to this mentor' },
        { status: 400 }
      );
    }

    const [row] = await db
      .insert(mentorshipRequests)
      .values({
        mentorId: mentor.id,
        studentId: user.id,
        message,
        helpNeeded: helpNeeded || [],
        status: 'pending',
      })
      .returning();

    try {
      await sendMentorshipRequestEmail(mentorUser.email, mentorUser.fullName, user.fullName);
    } catch (e) {
      console.error('Mentorship request email failed:', e);
    }

    try {
      await notifyMentorshipRequestReceived(mentorUser.id, user.id, user.fullName);
    } catch (e) {
      console.error('Mentorship request notification failed:', e);
    }

    return NextResponse.json({ success: true, request: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PUT — mentor accepts or declines
export async function PUT(request: Request) {
  try {
    const user = await requireMentor();
    const body = await request.json();
    const { id, action } = body;

    if (!id || (action !== 'accept' && action !== 'decline')) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json({ error: 'Not a mentor' }, { status: 403 });

    const [req] = await db
      .select()
      .from(mentorshipRequests)
      .where(
        and(
          eq(mentorshipRequests.id, id),
          eq(mentorshipRequests.mentorId, mentor.id)
        )
      );
    if (!req) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

    const newStatus = action === 'accept' ? 'accepted' : 'declined';

    await db
      .update(mentorshipRequests)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(mentorshipRequests.id, id));

    if (action === 'accept') {
      await db.insert(mentorships).values({
        mentorId: mentor.id,
        studentId: req.studentId,
        requestId: req.id,
        status: 'active',
      });
    }

    const [student] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, req.studentId));

    if (student) {
      try {
        if (action === 'accept') {
          await sendMentorshipRequestAcceptedEmail(student.email, student.fullName, user.fullName);
        } else {
          await sendMentorshipRequestDeclinedEmail(student.email, student.fullName, user.fullName);
        }
      } catch (e) {
        console.error('Notification email failed:', e);
      }

      try {
        if (action === 'accept') {
          await notifyMentorshipRequestAccepted(req.studentId, user.fullName);
        } else {
          await notifyMentorshipRequestDeclined(req.studentId, user.fullName);
        }
      } catch (e) {
        console.error('In-app notification failed:', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
