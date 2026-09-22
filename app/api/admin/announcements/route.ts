// app/api/admin/announcements/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { announcementSchema } from '@/lib/validation';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET() {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt));
  return NextResponse.json(allAnnouncements);
}

export async function POST(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!user.id) {
    return NextResponse.json(
      { error: 'Cannot create announcement: no admin account available to attribute it to.' },
      { status: 400 }
    );
  }

  try {
    const raw = await request.json();
    const data = announcementSchema.parse(raw);

    const [announcement] = await db
      .insert(announcements)
      .values({
        title: data.title,
        content: data.content,
        type: data.type,
        priority: data.priority,
        imageUrl: data.imageUrl ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        authorId: user.id,
        isPublished: false,
      })
      .returning();

    await logAudit({
      adminId: user.id,
      action: user.isBypass
        ? '[DEV_BYPASS] create_announcement'
        : 'create_announcement',
      entity: 'announcement',
      entityId: announcement.id,
      newValue: { title: announcement.title, published: announcement.isPublished },
    });

    return NextResponse.json(announcement);
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create announcement' },
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
    if (!id) return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });

    const [existing] = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });

    const [updated] = await db
      .update(announcements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] update_announcement'
          : 'update_announcement',
        entity: 'announcement',
        entityId: id,
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

export async function DELETE(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });

  const [existing] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);
  if (!existing) return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });

  await db.delete(announcements).where(eq(announcements.id, id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass
        ? '[DEV_BYPASS] delete_announcement'
        : 'delete_announcement',
      entity: 'announcement',
      entityId: id,
      previousValue: { title: existing.title },
    });
  }

  return NextResponse.json({ success: true });
}
