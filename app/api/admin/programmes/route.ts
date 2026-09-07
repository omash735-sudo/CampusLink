// app/api/admin/programmes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programmes } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const all = await db.select().from(programmes).where(eq(programmes.isActive, true)).orderBy(programmes.name);
    return NextResponse.json(all);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch programmes' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    const [programme] = await db.insert(programmes).values({
      ...body,
      isActive: true,
    }).returning();

    return NextResponse.json(programme);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create programme' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Programme ID is required' }, { status: 400 });
    }

    await db.delete(programmes).where(eq(programmes.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete programme' },
      { status: 500 }
    );
  }
}
