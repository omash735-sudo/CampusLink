// app/api/public/announcements/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { and, eq, lte, or, isNull, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const now = new Date();
    const all = await db.select().from(announcements)
      .where(
        and(
          eq(announcements.isPublished, true),
          or(
            isNull(announcements.expiresAt),
            lte(announcements.expiresAt, now)
          )
        )
      )
      .orderBy(desc(announcements.publishedAt));
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json([]);
  }
}
