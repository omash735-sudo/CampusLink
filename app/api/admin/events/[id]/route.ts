import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();
  const [event] = await db.select().from(events).where(eq(events.id, params.id));
  return NextResponse.json(event);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  const body = await request.json();
  
  const [event] = await db.update(events).set({
    title: body.title,
    description: body.description,
    location: body.location,
    startDate: new Date(body.startDate),
    endDate: body.endDate ? new Date(body.endDate) : null,
    category: body.category,
    organizer: body.organizer,
    image: body.image,
    status: body.status,
    updatedAt: new Date(),
  }).where(eq(events.id, params.id)).returning();
  
  return NextResponse.json(event);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();
  await db.delete(events).where(eq(events.id, params.id));
  return NextResponse.json({ success: true });
}
