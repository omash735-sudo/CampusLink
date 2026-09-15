// app/api/admin/mentors/status/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !['approved', 'pending', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, userId));
    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    await db
      .update(mentors)
      .set({ status, updatedAt: new Date() })
      .where(eq(mentors.userId, userId));

    const userUpdates: any = { updatedAt: new Date() };
    if (status === 'approved') {
      userUpdates.isMentor = true;
      userUpdates.mentorStatus = 'approved';
    } else if (status === 'rejected') {
      userUpdates.isMentor = false;
      userUpdates.mentorStatus = 'rejected';
    } else {
      userUpdates.isMentor = false;
      userUpdates.mentorStatus = 'pending';
    }

    await db
      .update(campuslinkUsers)
      .set(userUpdates)
      .where(eq(campuslinkUsers.id, userId));

    await logAudit({
      adminId: admin.id,
      action: `mentor_${status}`,
      entity: 'mentor',
      entityId: mentor.id,
      newValue: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}
