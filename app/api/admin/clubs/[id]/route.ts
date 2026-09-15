// app/api/admin/clubs/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';

async function requireAdminOrPublications() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'publications') return null;
  return user;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    const [row] = await db
      .update(clubs)
      .set({
        name: body.name,
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
        updatedAt: new Date(),
      })
      .where(eq(clubs.id, params.id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, club: row });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update club' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db.delete(clubs).where(eq(clubs.id, params.id));

  await logAudit({
    adminId: user.id,
    action: 'delete_club',
    entity: 'club',
    entityId: params.id,
  });

  return NextResponse.json({ success: true });
}
