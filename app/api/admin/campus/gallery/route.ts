// app/api/admin/campus/gallery/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campusGallery, campusLocations } from '@/lib/db/schema';
import { asc, and, eq, ilike, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { requireAdminOnly } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const published = searchParams.get('published') || 'all';

  const conditions: any[] = [];
  if (q) conditions.push(ilike(campusGallery.title, `%${q}%`));
  if (category !== 'all') conditions.push(eq(campusGallery.category, category));
  if (published === 'published') conditions.push(eq(campusGallery.isPublished, true));
  if (published === 'draft') conditions.push(eq(campusGallery.isPublished, false));

  const rows = await db
    .select({
      id: campusGallery.id,
      title: campusGallery.title,
      imageUrl: campusGallery.imageUrl,
      category: campusGallery.category,
      description: campusGallery.description,
      locationId: campusGallery.locationId,
      locationName: campusLocations.name,
      locationSlug: campusLocations.slug,
      isPublished: campusGallery.isPublished,
      sortOrder: campusGallery.sortOrder,
      createdAt: campusGallery.createdAt,
      updatedAt: campusGallery.updatedAt,
    })
    .from(campusGallery)
    .leftJoin(campusLocations, eq(campusGallery.locationId, campusLocations.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(campusGallery.sortOrder), asc(campusGallery.createdAt));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    if (!body.imageUrl || typeof body.imageUrl !== 'string') {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const [row] = await db
      .insert(campusGallery)
      .values({
        title: body.title || null,
        imageUrl: body.imageUrl,
        category: body.category || null,
        description: body.description || null,
        locationId: body.locationId || null,
        isPublished: body.isPublished === true,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      })
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] create_campus_gallery'
          : 'create_campus_gallery',
        entity: 'campus_gallery',
        entityId: row.id,
        newValue: {
          title: row.title,
          category: row.category,
          published: row.isPublished,
        },
      });
    }

    return NextResponse.json({ success: true, image: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create gallery image' },
      { status: 500 }
    );
  }
}
