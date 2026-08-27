// app/api/admin/programmes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programmes } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  await requireAdmin();
  const all = await db.select().from(programmes);
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  
  const [programme] = await db.insert(programmes).values(body).returning();
  return NextResponse.json(programme);
}
