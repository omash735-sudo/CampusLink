// app/api/admin/announcements/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOrPublications } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdminOrPublications();
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

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdminOrPublications();
  await db.delete(announcements).where(eq(announcements.id, params.id));
  return NextResponse.json({ success: true });
}
