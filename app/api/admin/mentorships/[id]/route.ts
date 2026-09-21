// app/api/admin/mentorships/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorships } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
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
    if (body.action !== 'end') {
      return NextResponse.json(
        { error: 'Unsupported action. Only "end" is allowed.' },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(mentorships)
      .where(eq(mentorships.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Mentorship not found' }, { status: 404 });
    }

    if (existing.status !== 'active') {
      return NextResponse.json(
        { error: `Cannot end a mentorship with status "${existing.status}"` },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(mentorships)
      .set({
        status: 'completed',
        endedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(mentorships.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass ? '[DEV_BYPASS] end_mentorship' : 'end_mentorship',
        entity: 'mentorship',
        entityId: params.id,
        previousValue: { status: existing.status },
        newValue: { status: updated.status, endedAt: updated.endedAt },
      });
    }

    return NextResponse.json({ success: true, mentorship: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to end mentorship' },
      { status: 500 }
    );
  }
}
