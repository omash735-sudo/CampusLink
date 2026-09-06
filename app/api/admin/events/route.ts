import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  const admin = await requireAdmin();
  const body = await request.json();
  
  const [event] = await db.insert(events).values({
    title: body.title,
    description: body.description,
    location: body.location,
    startDate: new Date(body.startDate),
    endDate: body.endDate ? new Date(body.endDate) : null,
    category: body.category,
    organizer: body.organizer,
    image: body.image,
    status: body.status || 'published',
  }).returning();
  
  return NextResponse.json(event);
}
