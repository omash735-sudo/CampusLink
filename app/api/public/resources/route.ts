// app/api/public/resources/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const all = await db.select().from(resources)
    .where(eq(resources.status, 'approved'))
    .orderBy(desc(resources.createdAt));
  return NextResponse.json(all);
}
