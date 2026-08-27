// app/api/admin/opportunities/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { opportunities } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth';
import { opportunitySchema } from '@/lib/validation';

export async function GET() {
  await requireAdmin();
  const all = await db.select().from(opportunities).orderBy(opportunities.createdAt, 'desc');
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const validated = opportunitySchema.parse(body);
  
  const [opportunity] = await db.insert(opportunities).values(validated).returning();
  return NextResponse.json(opportunity);
}
