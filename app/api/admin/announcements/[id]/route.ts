// app/api/admin/announcements/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    const [existing] = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [updated] = await db
      .update(announcements)
      .set({
        ...body,
        imageUrl: body.imageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] update_announcement'
          : 'update_announcement',
        entity: 'announcement',
        entityId: params.id,
        previousValue: { title: existing.title, published: existing.isPublished },
        newValue: { title: updated.title, published: updated.isPublished },
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [existing] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, params.id))
    .limit(1);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(announcements).where(eq(announcements.id, params.id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass
        ? '[DEV_BYPASS] delete_announcement'
        : 'delete_announcement',
      entity: 'announcement',
      entityId: params.id,
      previousValue: { title: existing.title },
    });
  }

  return NextResponse.json({ success: true });
}
