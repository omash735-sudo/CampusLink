// app/api/admin/events/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET() {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));
  return NextResponse.json(allEvents);
}

export async function POST(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const [event] = await db
      .insert(events)
      .values({ ...body, status: 'draft' })
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass ? '[DEV_BYPASS] create_event' : 'create_event',
        entity: 'event',
        entityId: event.id,
        newValue: { title: event.title, status: event.status },
      });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });

    const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const [updated] = await db
      .update(events)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass ? '[DEV_BYPASS] update_event' : 'update_event',
        entity: 'event',
        entityId: id,
        previousValue: { title: existing.title, status: existing.status },
        newValue: { title: updated.title, status: updated.status },
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });

  const [existing] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  await db.delete(events).where(eq(events.id, id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass ? '[DEV_BYPASS] delete_event' : 'delete_event',
      entity: 'event',
      entityId: id,
      previousValue: { title: existing.title, status: existing.status },
    });
  }

  return NextResponse.json({ success: true });
}
