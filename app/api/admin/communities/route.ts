// app/api/admin/communities/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const all = await db
      .select()
      .from(groups)
      .orderBy(desc(groups.createdAt));
    return NextResponse.json(all);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch communities' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    const [community] = await db
      .insert(groups)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description,
        category: body.category,
        type: 'open',
        whatsappLink: body.whatsappLink,
        isActive: body.isActive !== undefined ? body.isActive : true,
        memberCount: 0,

        // Admin-created communities are pre-approved
        status: 'approved',
        reviewedBy: admin.id,
        reviewedAt: new Date(),
      })
      .returning();

    await logAudit({
      adminId: admin.id,
      action: 'create_community',
      entity: 'group',
      entityId: community.id,
      newValue: { name: community.name, status: community.status },
    });

    return NextResponse.json(community);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create community' },
      { status: 500 }
    );
  }
}
