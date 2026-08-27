// app/api/public/opportunities/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { opportunities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const all = await db.select().from(opportunities)
    .where(eq(opportunities.isPublished, true))
    .orderBy(opportunities.createdAt, 'desc');
  return NextResponse.json(all);
}
