// app/api/public/opportunities/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { opportunities } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const all = await db.select().from(opportunities)
    .where(eq(opportunities.status, 'published'))
    .orderBy(desc(opportunities.createdAt));
  return NextResponse.json(all);
}
