// app/api/admin/clubs/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

async function requireAdminOrPublications() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'publications') return null;
  return user;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db.select().from(clubs).orderBy(desc(clubs.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const slug = slugify(body.name || '');

    const [row] = await db
      .insert(clubs)
      .values({
        name: body.name,
        slug,
        description: body.description,
        category: body.category || null,
        logoUrl: body.logoUrl || null,
        coverUrl: body.coverUrl || null,
        email: body.email || null,
        whatsapp: body.whatsapp || null,
        instagramUrl: body.instagramUrl || null,
        websiteUrl: body.websiteUrl || null,
        meetingInfo: body.meetingInfo || null,
        membershipInfo: body.membershipInfo || null,
        isActive: body.isActive !== false,
        isFeatured: !!body.isFeatured,
        sortOrder: Number(body.sortOrder) || 0,
      })
      .returning();

    await logAudit({
      adminId: user === true ? '' : user.id,
      action: 'create_club',
      entity: 'club',
      entityId: row.id,
      newValue: row,
    });

    return NextResponse.json({ success: true, club: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create club' },
      { status: 500 }
    );
  }
}
