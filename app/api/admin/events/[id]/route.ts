// app/api/admin/events/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [event] = await db.select().from(events).where(eq(events.id, params.id));
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

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
      .from(events)
      .where(eq(events.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [event] = await db
      .update(events)
      .set({
        title: body.title,
        description: body.description,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        category: body.category,
        organizer: body.organizer,
        image: body.image,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(events.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass ? '[DEV_BYPASS] update_event' : 'update_event',
        entity: 'event',
        entityId: params.id,
        previousValue: { title: existing.title, status: existing.status },
        newValue: { title: event.title, status: event.status },
      });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
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
    .from(events)
    .where(eq(events.id, params.id))
    .limit(1);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(events).where(eq(events.id, params.id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass ? '[DEV_BYPASS] delete_event' : 'delete_event',
      entity: 'event',
      entityId: params.id,
      previousValue: { title: existing.title },
    });
  }

  return NextResponse.json({ success: true });
}
