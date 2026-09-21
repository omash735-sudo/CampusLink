// app/api/admin/announcements/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/dev-auth';

export const runtime = 'nodejs';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    const [updated] = await db
      .update(announcements)
      .set({
        ...body,
        imageUrl: body.imageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, params.id))
      .returning();

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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

  await db.delete(announcements).where(eq(announcements.id, params.id));
  return NextResponse.json({ success: true });
}
