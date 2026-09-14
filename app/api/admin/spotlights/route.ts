// app/api/admin/spotlights/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentSpotlights } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
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

export async function GET() {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(studentSpotlights)
    .orderBy(desc(studentSpotlights.createdAt));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = spotlightSchema.parse(body);

    const [row] = await db
      .insert(studentSpotlights)
      .values({
        studentName: data.studentName,
        programme: data.programme || null,
        year: data.year || null,
        bio: data.bio,
        graphicUrl: data.graphicUrl || null,
        tags: data.tags || [],
        achievement: data.achievement || null,
        isPublished: data.isPublished,
        sortOrder: data.sortOrder,
        publishedAt: data.isPublished ? new Date() : null,
        createdBy: user === true ? null : user.id,
      })
      .returning();

    await logAudit({
      adminId: user === true ? '' : user.id,
      action: 'create_spotlight',
      entity: 'student_spotlight',
      entityId: row.id,
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
      { error: error.message || 'Failed to create' },
      { status: 500 }
    );
  }
}
