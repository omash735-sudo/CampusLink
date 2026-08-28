// app/api/admin/events/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import { eventSchema } from '@/lib/validation';

export async function GET() {
  await requireAdmin();
  const all = await db.select().from(events).orderBy(desc(events.startDate));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const validated = eventSchema.parse(body);
  
  const [event] = await db.insert(events).values({
    title: validated.title,
    description: validated.description,
    startDate: new Date(validated.startDate),
    endDate: validated.endDate ? new Date(validated.endDate) : null,
    location: validated.location,
    organizer: validated.organizer,
    category: validated.category,
    maxAttendees: validated.maxAttendees,
    isPublished: validated.isPublished,
  }).returning();
  
  return NextResponse.json(event);
}
