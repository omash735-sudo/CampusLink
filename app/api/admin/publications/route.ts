// app/api/admin/publications/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import {
  sendPublicationsApprovedEmail,
  sendPublicationsRejectedEmail,
} from '@/lib/services/email.service';
import { z } from 'zod';

export const runtime = 'nodejs';

const actionSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'revoke']),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db.select().from(campuslinkUsers);
  return NextResponse.json(rows);
}

export async function PUT(request: Request) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, action } = actionSchema.parse(body);

    const [target] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, userId));

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();

    if (action === 'approve') {
      await db
        .update(campuslinkUsers)
        .set({
          role: 'publications',
          publicationsStatus: 'approved',
          updatedAt: now,
        })
        .where(eq(campuslinkUsers.id, userId));

      try {
        await sendPublicationsApprovedEmail(target.email, target.fullName);
      } catch (e) {
        console.error('Approval email failed:', e);
      }

      await logAudit({
        adminId: admin.id,
        action: 'approve_publications',
        entity: 'campuslink_user',
        entityId: userId,
        previousValue: { role: target.role, publicationsStatus: target.publicationsStatus },
        newValue: { role: 'publications', publicationsStatus: 'approved' },
      });
    } else if (action === 'reject') {
      await db
        .update(campuslinkUsers)
        .set({
          publicationsStatus: 'rejected',
          updatedAt: now,
        })
        .where(eq(campuslinkUsers.id, userId));

      try {
        await sendPublicationsRejectedEmail(target.email, target.fullName);
      } catch (e) {
        console.error('Rejection email failed:', e);
      }

      await logAudit({
        adminId: admin.id,
        action: 'reject_publications',
        entity: 'campuslink_user',
        entityId: userId,
        previousValue: { publicationsStatus: target.publicationsStatus },
        newValue: { publicationsStatus: 'rejected' },
      });
    } else if (action === 'revoke') {
      await db
        .update(campuslinkUsers)
        .set({
          role: 'student',
          publicationsStatus: 'not_applied',
          updatedAt: now,
        })
        .where(eq(campuslinkUsers.id, userId));

      await logAudit({
        adminId: admin.id,
        action: 'revoke_publications',
        entity: 'campuslink_user',
        entityId: userId,
        previousValue: { role: target.role, publicationsStatus: target.publicationsStatus },
        newValue: { role: 'student', publicationsStatus: 'not_applied' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update' },
      { status: 500 }
    );
  }
}
