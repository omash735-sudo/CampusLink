// app/api/admin/mentors/applications/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers, mentors } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import {
  sendMentorApprovalEmail,
  sendMentorRejectionEmail,
} from '@/lib/services/email.service';
import {
  notifyMentorApplicationApproved,
  notifyMentorApplicationRejected,
} from '@/lib/services/notification.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAdmin();
    const applications = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.mentorStatus, 'pending'))
      .orderBy(desc(campuslinkUsers.createdAt));
    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { userId, action, reason } = body;

    if (!userId || (action !== 'approve' && action !== 'reject')) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, userId));
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'approve') {
      await db
        .update(campuslinkUsers)
        .set({
          isMentor: true,
          mentorStatus: 'approved',
          updatedAt: new Date(),
        })
        .where(eq(campuslinkUsers.id, userId));

      await db
        .update(mentors)
        .set({ status: 'approved', updatedAt: new Date() })
        .where(eq(mentors.userId, userId));

      try {
        await sendMentorApprovalEmail(user.email, user.fullName);
      } catch (e) {
        console.error('Approval email failed:', e);
      }

      try {
        await notifyMentorApplicationApproved(userId, user.fullName);
      } catch (e) {
        console.error('Approval notification failed:', e);
      }

      await logAudit({
        adminId: admin.id,
        action: 'mentor_application_approved',
        entity: 'campuslink_user',
        entityId: userId,
        newValue: { mentorStatus: 'approved' },
      });
    } else {
      await db
        .update(campuslinkUsers)
        .set({
          isMentor: false,
          mentorStatus: 'rejected',
          updatedAt: new Date(),
        })
        .where(eq(campuslinkUsers.id, userId));

      await db
        .update(mentors)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(eq(mentors.userId, userId));

      try {
        await sendMentorRejectionEmail(user.email, user.fullName, reason);
      } catch (e) {
        console.error('Rejection email failed:', e);
      }

      try {
        await notifyMentorApplicationRejected(userId, reason);
      } catch (e) {
        console.error('Rejection notification failed:', e);
      }

      await logAudit({
        adminId: admin.id,
        action: 'mentor_application_rejected',
        entity: 'campuslink_user',
        entityId: userId,
        newValue: { mentorStatus: 'rejected', reason },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}
