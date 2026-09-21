// app/api/admin/feedback/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedback } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
import { feedbackUpdateSchema } from '@/lib/validation';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = feedbackUpdateSchema.parse(body);

    const [existing] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [updated] = await db
      .update(feedback)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(feedback.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] update_feedback_status'
          : 'update_feedback_status',
        entity: 'feedback',
        entityId: params.id,
        previousValue: { status: existing.status },
        newValue: { status: updated.status },
      });
    }

    return NextResponse.json({ success: true, feedback: updated });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update feedback' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [existing] = await db
    .select()
    .from(feedback)
    .where(eq(feedback.id, params.id))
    .limit(1);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(feedback).where(eq(feedback.id, params.id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass ? '[DEV_BYPASS] delete_feedback' : 'delete_feedback',
      entity: 'feedback',
      entityId: params.id,
      previousValue: { status: existing.status, content: existing.content.slice(0, 80) },
    });
  }

  return NextResponse.json({ success: true });
}
