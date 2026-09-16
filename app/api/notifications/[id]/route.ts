import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, params.id), eq(notifications.userId, user.id)));

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db
    .delete(notifications)
    .where(and(eq(notifications.id, params.id), eq(notifications.userId, user.id)));

  return NextResponse.json({ success: true });
}
