// app/api/admin/events/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth';
import { eventSchema } from '@/lib/validation';

export async function GET() {
  await requireAdmin();
  const all = await db.select().from(events).orderBy(events.startDate, 'desc');
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const validated = eventSchema.parse(body);
  
  const [event] = await db.insert(events).values(validated).returning();
  return NextResponse.json(event);
}
