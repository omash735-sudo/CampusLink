// app/api/admin/mentors/applications/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const applications = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.mentorStatus, 'pending'))
      .orderBy(desc(campuslinkUsers.createdAt));
    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    let updated;
    if (action === 'approve') {
      [updated] = await db
        .update(campuslinkUsers)
        .set({
          isMentor: true,
          mentorStatus: 'approved',
          updatedAt: new Date(),
        })
        .where(eq(campuslinkUsers.id, id))
        .returning();
    } else if (action === 'reject') {
      [updated] = await db
        .update(campuslinkUsers)
        .set({
          mentorStatus: 'rejected',
          updatedAt: new Date(),
        })
        .where(eq(campuslinkUsers.id, id))
        .returning();
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update application' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
