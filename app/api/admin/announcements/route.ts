// app/api/admin/announcements/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/dev-auth';

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

  try {
    const body = await request.json();
    const [announcement] = await db
      .insert(announcements)
      .values({
        title: body.title,
        content: body.content,
        type: body.type || 'general',
        priority: body.priority || 'normal',
        imageUrl: body.imageUrl || null,
        authorId: user.id ?? null,
        isPublished: false,
      })
      .returning();
    return NextResponse.json(announcement);
  } catch (error: any) {
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

    const [updated] = await db
      .update(announcements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();

    if (!updated) return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
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

  await db.delete(announcements).where(eq(announcements.id, id));
  return NextResponse.json({ success: true });
}
