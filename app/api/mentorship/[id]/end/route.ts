// app/api/mentorship/[id]/end/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorships } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * Student-initiated end of their own mentorship.
 * Active → completed. Records endedAt.
 *
 * Auth: must be logged in AND be the student on the mentorship.
 * (Different from /api/admin/mentorships/[id], which is admin-only.)
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(mentorships)
    .where(
      and(
        eq(mentorships.id, params.id),
        eq(mentorships.studentId, user.id)
      )
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json(
      { error: 'Mentorship not found' },
      { status: 404 }
    );
  }

  if (existing.status !== 'active') {
    return NextResponse.json(
      { error: `Cannot end a mentorship with status "${existing.status}"` },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(mentorships)
    .set({
      status: 'completed',
      endedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(mentorships.id, params.id))
    .returning();

  return NextResponse.json({ success: true, mentorship: updated });
}
