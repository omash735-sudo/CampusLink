// app/api/public/events/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const all = await db.select().from(events)
    .where(eq(events.status, 'published'))
    .orderBy(asc(events.startDate));
  return NextResponse.json(all);
}
