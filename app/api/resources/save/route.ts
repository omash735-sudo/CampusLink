// app/api/resources/save/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { savedResources } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { resourceId } = body;

    // Check if already saved
    const existing = await db
      .select()
      .from(savedResources)
      .where(and(
        eq(savedResources.userId, user.id),
        eq(savedResources.resourceId, resourceId)
      ))
      .then(res => res[0]);

    if (existing) {
      // Unsave
      await db
        .delete(savedResources)
        .where(and(
          eq(savedResources.userId, user.id),
          eq(savedResources.resourceId, resourceId)
        ));
      return NextResponse.json({ saved: false });
    }

    // Save
    await db.insert(savedResources).values({
      userId: user.id,
      resourceId: resourceId,
    });

    return NextResponse.json({ saved: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save resource' },
      { status: 500 }
    );
  }
}
