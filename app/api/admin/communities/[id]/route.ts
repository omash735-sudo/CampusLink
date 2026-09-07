// app/api/admin/communities/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();

    const [updated] = await db.update(groups)
      .set({
        name: body.name,
        slug: body.slug,
        description: body.description,
        category: body.category,
        whatsappLink: body.whatsappLink,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, params.id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update community' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await db.delete(groups).where(eq(groups.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete community' },
      { status: 500 }
    );
  }
}
