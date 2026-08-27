// app/api/public/resources/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const all = await db.select().from(resources)
    .where(eq(resources.isApproved, true))
    .orderBy(resources.createdAt, 'desc');
  return NextResponse.json(all);
}
