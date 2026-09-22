// app/api/admin/campus/timeline/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campusTimeline } from '@/lib/db/schema';
import { asc, and, eq, ilike } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const published = searchParams.get('published') || 'all';

  const conditions: any[] = [];
  if (q) conditions.push(ilike(campusTimeline.title, `%${q}%`));
  if (published === 'published') conditions.push(eq(campusTimeline.isPublished, true));
  if (published === 'draft') conditions.push(eq(campusTimeline.isPublished, false));

  const rows = await db
    .select()
    .from(campusTimeline)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(campusTimeline.sortOrder), asc(campusTimeline.year));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 2) {
      return NextResponse.json({ error: 'Title is required (min 2 chars)' }, { status: 400 });
    }
    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 1800 || year > 2200) {
      return NextResponse.json({ error: 'Year must be a 4-digit number (1800–2200)' }, { status: 400 });
    }

    const [row] = await db
      .insert(campusTimeline)
      .values({
        year,
        title: body.title.trim(),
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        source: body.source || null,
        isPublished: body.isPublished === true,
        sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      })
      .returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: user.isBypass
          ? '[DEV_BYPASS] create_campus_timeline'
          : 'create_campus_timeline',
        entity: 'campus_timeline',
        entityId: row.id,
        newValue: { year: row.year, title: row.title, published: row.isPublished },
      });
    }

    return NextResponse.json({ success: true, entry: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create timeline entry' },
      { status: 500 }
    );
  }
}
