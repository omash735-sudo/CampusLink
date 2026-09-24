// app/api/admin/users/role/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { sendPublicationsApprovedEmail } from '@/lib/services/email.service';
import { notifyPublicationsApproved } from '@/lib/services/notification.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_ROLES = ['student', 'publications'] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    const userId = body?.userId;
    const newRole = body?.role as AllowedRole;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    if (!ALLOWED_ROLES.includes(newRole)) {
      return NextResponse.json(
        { error: `role must be one of: ${ALLOWED_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    const [user] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot change role for an admin account' },
        { status: 400 }
      );
    }

    if (user.role === newRole) {
      return NextResponse.json(
        { error: `User already has role "${newRole}"` },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(campuslinkUsers)
      .set({
        role: newRole,
        publicationsStatus: newRole === 'publications' ? 'approved' : 'not_applied',
        updatedAt: new Date(),
      })
      .where(eq(campuslinkUsers.id, userId))
      .returning();

    await logAudit({
      adminId: admin.id,
      action: newRole === 'publications' ? 'promote_to_publications' : 'demote_to_student',
      entity: 'user',
      entityId: userId,
      previousValue: { role: user.role },
      newValue: { role: newRole },
    });

    // Send welcome email on promotion
    if (newRole === 'publications') {
      try {
        await sendPublicationsApprovedEmail(user.email, user.fullName);
      } catch (e) {
        console.error('[role-change] email failed:', e);
      }
      try {
        await notifyPublicationsApproved(userId);
      } catch (e) {
        console.error('[role-change] notification failed:', e);
      }
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to change role' },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}
