// app/api/admin/campus/locations/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { asc, and, eq, ilike } from 'drizzle-orm';
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

export async function GET(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const published = searchParams.get('published') || 'all';

  const conditions: any[] = [];
  if (q) conditions.push(ilike(campusLocations.name, `%${q}%`));
  if (category !== 'all') conditions.push(eq(campusLocations.category, category));
  if (published === 'published') conditions.push(eq(campusLocations.isPublished, true));
  if (published === 'draft') conditions.push(eq(campusLocations.isPublished, false));

  const rows = await db
    .select()
    .from(campusLocations)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(campusLocations.sortOrder), asc(campusLocations.name));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required (min 2 chars)' }, { status: 400 });
    }
    if (!body.category || typeof body.category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const slug = (body.slug && slugify(body.slug)) || slugify(body.name);

    // Check uniqueness
    const [existing] = await db
      .select({ id: campusLocations.id })
      .from(campusLocations)
      .where(eq(campusLocations.slug, slug))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { error: `Slug "${slug}" is already in use` },
        { status: 409 }
      );
    }

    const [row] = await db
      .insert(campusLocations)
      .values({
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
      })
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] create_campus_location'
          : 'create_campus_location',
        entity: 'campus_location',
        entityId: row.id,
        newValue: { name: row.name, slug: row.slug, published: row.isPublished },
      });
    }

    return NextResponse.json({ success: true, location: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create location' },
      { status: 500 }
    );
  }
}
