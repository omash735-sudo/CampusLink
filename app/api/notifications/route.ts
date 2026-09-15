// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireAuth();
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await db
        .update(notifications)
        .set({ read: true })
        .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));
    } else {
      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.userId, user.id));
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
