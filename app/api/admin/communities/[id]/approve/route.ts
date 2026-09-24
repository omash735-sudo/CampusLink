// app/api/admin/communities/[id]/approve/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups, campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { notifyCommunityApproved } from '@/lib/services/notification.service';
import { sendCommunityApprovedEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();

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
        status: 'approved',
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        reviewNotes: null,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, params.id))
      .returning();

    // Notify submitter if there is one
    if (existing.submittedBy) {
      try {
        await notifyCommunityApproved(existing.submittedBy, existing.name);
      } catch (e) {
        console.error('[community-approve] notification failed:', e);
      }

      try {
        const [submitter] = await db
          .select()
          .from(campuslinkUsers)
          .where(eq(campuslinkUsers.id, existing.submittedBy))
          .limit(1);
        if (submitter) {
          await sendCommunityApprovedEmail(submitter.email, submitter.fullName, existing.name);
        }
      } catch (e) {
        console.error('[community-approve] email failed:', e);
      }
    }

    await logAudit({
      adminId: admin.id,
      action: 'approve_community',
      entity: 'group',
      entityId: params.id,
      previousValue: { status: existing.status },
      newValue: { status: 'approved' },
    });

    return NextResponse.json({ success: true, group: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}
