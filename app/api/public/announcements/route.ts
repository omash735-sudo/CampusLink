// app/api/public/announcements/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { and, eq, lte, or } from 'drizzle-orm';

export async function GET() {
  const now = new Date();
  const all = await db.select().from(announcements)
    .where(
      and(
        eq(announcements.isPublished, true),
        or(
          eq(announcements.expiresAt, null),
          lte(announcements.expiresAt, now)
        )
      )
    )
    .orderBy(announcements.publishedAt, 'desc');
  return NextResponse.json(all);
}
