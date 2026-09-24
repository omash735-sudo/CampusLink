// app/api/admin/communities/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    const [existing] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      category: body.category,
      isActive: body.isActive !== undefined ? body.isActive : true,
      updatedAt: new Date(),
    };

    if (body.whatsappLink !== undefined) {
      updateData.whatsappLink = body.whatsappLink;
    }

    const [updated] = await db
      .update(groups)
      .set(updateData)
      .where(eq(groups.id, params.id))
      .returning();

    await logAudit({
      adminId: admin.id,
      action: 'update_community',
      entity: 'group',
      entityId: params.id,
      previousValue: { name: existing.name, isActive: existing.isActive },
      newValue: { name: updated.name, isActive: updated.isActive },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Update community error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update community' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();

    const [existing] = await db
      .select()
      .from(groups)
      .where(eq(groups.id, params.id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }

    await db.delete(groups).where(eq(groups.id, params.id));

    await logAudit({
      adminId: admin.id,
      action: 'delete_community',
      entity: 'group',
      entityId: params.id,
      previousValue: { name: existing.name, status: existing.status },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete community error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete community' },
      { status: 500 }
    );
  }
}
