// app/api/admin/resources/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const [resource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, params.id));

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resource' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();

    const [updated] = await db
      .update(resources)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(resources.id, params.id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update resource' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await db.delete(resources).where(eq(resources.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete resource' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
