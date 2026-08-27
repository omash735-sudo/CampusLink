// app/api/public/events/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const all = await db.select().from(events)
    .where(eq(events.isPublished, true))
    .orderBy(events.startDate, 'asc');
  return NextResponse.json(all);
}
