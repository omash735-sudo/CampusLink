// app/api/admin/campus/gallery/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campusGallery } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [row] = await db
    .select()
    .from(campusGallery)
    .where(eq(campusGallery.id, params.id))
    .limit(1);

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    const [existing] = await db
      .select()
      .from(campusGallery)
      .where(eq(campusGallery.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!body.imageUrl || typeof body.imageUrl !== 'string') {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const [row] = await db
      .update(campusGallery)
      .set({
        title: body.title || null,
        imageUrl: body.imageUrl,
        category: body.category || null,
        description: body.description || null,
        locationId: body.locationId || null,
        isPublished: body.isPublished === true,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
        updatedAt: new Date(),
      })
      .where(eq(campusGallery.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] update_campus_gallery'
          : 'update_campus_gallery',
        entity: 'campus_gallery',
        entityId: params.id,
        previousValue: { title: existing.title, published: existing.isPublished },
        newValue: { title: row.title, published: row.isPublished },
      });
    }

    return NextResponse.json({ success: true, image: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update gallery image' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const [existing] = await db
      .select()
      .from(campusGallery)
      .where(eq(campusGallery.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const patch: any = { updatedAt: new Date() };
    if (typeof body.isPublished === 'boolean') patch.isPublished = body.isPublished;

    const [row] = await db
      .update(campusGallery)
      .set(patch)
      .where(eq(campusGallery.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] toggle_campus_gallery'
          : 'toggle_campus_gallery',
        entity: 'campus_gallery',
        entityId: params.id,
        previousValue: { published: existing.isPublished },
        newValue: { published: row.isPublished },
      });
    }

    return NextResponse.json({ success: true, image: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to toggle gallery image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [existing] = await db
    .select()
    .from(campusGallery)
    .where(eq(campusGallery.id, params.id))
    .limit(1);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(campusGallery).where(eq(campusGallery.id, params.id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass
        ? '[DEV_BYPASS] delete_campus_gallery'
        : 'delete_campus_gallery',
      entity: 'campus_gallery',
      entityId: params.id,
      previousValue: { title: existing.title, imageUrl: existing.imageUrl },
    });
  }

  return NextResponse.json({ success: true });
}
