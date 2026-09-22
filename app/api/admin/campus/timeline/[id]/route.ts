// app/api/admin/campus/timeline/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campusTimeline } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [row] = await db
    .select()
    .from(campusTimeline)
    .where(eq(campusTimeline.id, params.id))
    .limit(1);

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    const [existing] = await db
      .select()
      .from(campusTimeline)
      .where(eq(campusTimeline.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 2) {
      return NextResponse.json({ error: 'Title is required (min 2 chars)' }, { status: 400 });
    }
    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 1800 || year > 2200) {
      return NextResponse.json({ error: 'Year must be a 4-digit number (1800–2200)' }, { status: 400 });
    }

    const [row] = await db
      .update(campusTimeline)
      .set({
        year,
        title: body.title.trim(),
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        source: body.source || null,
        isPublished: body.isPublished === true,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
        updatedAt: new Date(),
      })
      .where(eq(campusTimeline.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] update_campus_timeline'
          : 'update_campus_timeline',
        entity: 'campus_timeline',
        entityId: params.id,
        previousValue: { year: existing.year, title: existing.title, published: existing.isPublished },
        newValue: { year: row.year, title: row.title, published: row.isPublished },
      });
    }

    return NextResponse.json({ success: true, entry: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update timeline entry' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const [existing] = await db
      .select()
      .from(campusTimeline)
      .where(eq(campusTimeline.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const patch: any = { updatedAt: new Date() };
    if (typeof body.isPublished === 'boolean') patch.isPublished = body.isPublished;

    const [row] = await db
      .update(campusTimeline)
      .set(patch)
      .where(eq(campusTimeline.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] toggle_campus_timeline'
          : 'toggle_campus_timeline',
        entity: 'campus_timeline',
        entityId: params.id,
        previousValue: { published: existing.isPublished },
        newValue: { published: row.isPublished },
      });
    }

    return NextResponse.json({ success: true, entry: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to toggle timeline entry' },
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
    .from(campusTimeline)
    .where(eq(campusTimeline.id, params.id))
    .limit(1);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(campusTimeline).where(eq(campusTimeline.id, params.id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass
        ? '[DEV_BYPASS] delete_campus_timeline'
        : 'delete_campus_timeline',
      entity: 'campus_timeline',
      entityId: params.id,
      previousValue: { year: existing.year, title: existing.title },
    });
  }

  return NextResponse.json({ success: true });
}
