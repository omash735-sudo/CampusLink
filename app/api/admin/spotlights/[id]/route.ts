// app/api/admin/spotlights/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentSpotlights } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { spotlightSchema } from '@/lib/validation';
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
    const data = spotlightSchema.parse(body);

    const [existing] = await db
      .select()
      .from(studentSpotlights)
      .where(eq(studentSpotlights.id, params.id));

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const publishJustNow = data.isPublished && !existing.isPublished;

    const [row] = await db
      .update(studentSpotlights)
      .set({
        studentName: data.studentName,
        programme: data.programme || null,
        year: data.year || null,
        bio: data.bio,
        graphicUrl: data.graphicUrl || null,
        tags: data.tags || [],
        achievement: data.achievement || null,
        isPublished: data.isPublished,
        sortOrder: data.sortOrder,
        publishedAt: publishJustNow ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(studentSpotlights.id, params.id))
      .returning();

    await logAudit({
      adminId: user === true ? '' : user.id,
      action: 'update_spotlight',
      entity: 'student_spotlight',
      entityId: params.id,
      previousValue: existing,
      newValue: row,
    });

    return NextResponse.json({ success: true, spotlight: row });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update' },
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

  try {
    await db
      .delete(studentSpotlights)
      .where(eq(studentSpotlights.id, params.id));

    await logAudit({
      adminId: user === true ? '' : user.id,
      action: 'delete_spotlight',
      entity: 'student_spotlight',
      entityId: params.id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}
