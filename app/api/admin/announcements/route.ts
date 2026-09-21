// app/api/admin/announcements/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/dev-auth';
import { announcementSchema } from '@/lib/validation';

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

  // authorId is NOT NULL in the schema. The bypass user may have id=null
  // (no admin exists in the DB). In that case, we can't insert.
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
    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
    }

    const [updated] = await db
      .update(announcements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
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
  if (!id) {
    return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
  }

  await db.delete(announcements).where(eq(announcements.id, id));
  return NextResponse.json({ success: true });
}
