// app/api/profile/update/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export const runtime = 'nodejs';

const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;

export async function PUT(request: Request) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fullName, username, bio, programme, year, interests } = body;

    // --- Validation ---
    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || fullName.trim().length < 2) {
        return NextResponse.json(
          { error: 'Full name must be at least 2 characters' },
          { status: 400 }
        );
      }
      if (fullName.length > 100) {
        return NextResponse.json(
          { error: 'Full name is too long' },
          { status: 400 }
        );
      }
    }

    if (username !== undefined) {
      if (typeof username !== 'string' || username.length < 3 || username.length > 30) {
        return NextResponse.json(
          { error: 'Username must be 3–30 characters' },
          { status: 400 }
        );
      }
      if (!USERNAME_REGEX.test(username)) {
        return NextResponse.json(
          { error: 'Username may only contain letters, numbers, dots and underscores' },
          { status: 400 }
        );
      }
    }

    // --- Username uniqueness (only if it changed) ---
    if (username && username !== user.username) {
      const [existing] = await db
        .select({ id: campuslinkUsers.id })
        .from(campuslinkUsers)
        .where(and(
          eq(campuslinkUsers.username, username),
          ne(campuslinkUsers.id, user.id)
        ))
        .limit(1);

      if (existing) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }
    }

    // --- Build patch: only overwrite fields that were actually sent ---
    // Distinguish "not provided" (undefined → keep) from "cleared" (null/'' → set)
    const patch: any = { updatedAt: new Date() };

    if (fullName !== undefined) patch.fullName = fullName.trim();
    if (username !== undefined) patch.username = username;
    if (bio !== undefined) patch.bio = bio || null;
    if (programme !== undefined) patch.programme = programme || null;
    if (year !== undefined) patch.year = year ?? null;
    if (interests !== undefined) {
      patch.interests = Array.isArray(interests)
        ? interests.filter((i: unknown) => typeof i === 'string' && i.trim().length > 0)
        : null;
    }

    const [updated] = await db
      .update(campuslinkUsers)
      .set(patch)
      .where(eq(campuslinkUsers.id, user.id))
      .returning();

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
