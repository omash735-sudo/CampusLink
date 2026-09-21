// app/api/admin/campus/locations/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [row] = await db
    .select()
    .from(campusLocations)
    .where(eq(campusLocations.id, params.id))
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
      .from(campusLocations)
      .where(eq(campusLocations.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required (min 2 chars)' }, { status: 400 });
    }
    if (!body.category || typeof body.category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const slug = (body.slug && slugify(body.slug)) || slugify(body.name);

    if (slug !== existing.slug) {
      const [conflict] = await db
        .select({ id: campusLocations.id })
        .from(campusLocations)
        .where(eq(campusLocations.slug, slug))
        .limit(1);
      if (conflict) {
        return NextResponse.json(
          { error: `Slug "${slug}" is already in use` },
          { status: 409 }
        );
      }
    }

    const [row] = await db
      .update(campusLocations)
      .set({
        name: body.name.trim(),
        slug,
        category: body.category,
        shortDescription: body.shortDescription || null,
        description: body.description || null,
        address: body.address || null,
        openingHours: body.openingHours || null,
        contactInfo: body.contactInfo || null,
        accessibilityInfo: body.accessibilityInfo || null,
        imageUrl: body.imageUrl || null,
        isFeatured: body.isFeatured === true,
        isPublished: body.isPublished === true,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
        updatedAt: new Date(),
      })
      .where(eq(campusLocations.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] update_campus_location'
          : 'update_campus_location',
        entity: 'campus_location',
        entityId: params.id,
        previousValue: { name: existing.name, published: existing.isPublished },
        newValue: { name: row.name, published: row.isPublished },
      });
    }

    return NextResponse.json({ success: true, location: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update location' },
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
      .from(campusLocations)
      .where(eq(campusLocations.id, params.id))
      .limit(1);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Only allow toggling isPublished and isFeatured via PATCH
    const patch: any = { updatedAt: new Date() };
    if (typeof body.isPublished === 'boolean') patch.isPublished = body.isPublished;
    if (typeof body.isFeatured === 'boolean') patch.isFeatured = body.isFeatured;

    const [row] = await db
      .update(campusLocations)
      .set(patch)
      .where(eq(campusLocations.id, params.id))
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] toggle_campus_location'
          : 'toggle_campus_location',
        entity: 'campus_location',
        entityId: params.id,
        previousValue: { published: existing.isPublished, featured: existing.isFeatured },
        newValue: { published: row.isPublished, featured: row.isFeatured },
      });
    }

    return NextResponse.json({ success: true, location: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to toggle location' },
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
    .from(campusLocations)
    .where(eq(campusLocations.id, params.id))
    .limit(1);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.delete(campusLocations).where(eq(campusLocations.id, params.id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: user.isBypass
        ? '[DEV_BYPASS] delete_campus_location'
        : 'delete_campus_location',
      entity: 'campus_location',
      entityId: params.id,
      previousValue: { name: existing.name, slug: existing.slug },
    });
  }

  return NextResponse.json({ success: true });
}
