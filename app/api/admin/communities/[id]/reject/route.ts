// app/api/admin/communities/[id]/reject/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups, campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { notifyCommunityRejected } from '@/lib/services/notification.service';
import { sendCommunityRejectedEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const reviewNotes = body?.reviewNotes || null;

    const [existing] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, params.id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const [updated] = await db
      .update(groups)
      .set({
        status: 'rejected',
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        reviewNotes,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, params.id))
      .returning();

    if (existing.submittedBy) {
      try {
        await notifyCommunityRejected(existing.submittedBy, existing.name, reviewNotes);
      } catch (e) {
        console.error('[community-reject] notification failed:', e);
      }

      try {
        const [submitter] = await db
          .select()
          .from(campuslinkUsers)
          .where(eq(campuslinkUsers.id, existing.submittedBy))
          .limit(1);
        if (submitter) {
          await sendCommunityRejectedEmail(
            submitter.email,
            submitter.fullName,
            existing.name,
            reviewNotes
          );
        }
      } catch (e) {
        console.error('[community-reject] email failed:', e);
      }
    }

    await logAudit({
      adminId: admin.id,
      action: 'reject_community',
      entity: 'group',
      entityId: params.id,
      previousValue: { status: existing.status },
      newValue: { status: 'rejected', reviewNotes },
    });

    return NextResponse.json({ success: true, group: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}
