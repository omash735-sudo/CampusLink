// app/api/student/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const user = await requireAuth();
  const [profile] = await db.select().from(campuslinkUsers).where(eq(campuslinkUsers.id, user.id));
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const user = await requireAuth();
  const body = await request.json();
  
  const [updated] = await db.update(campuslinkUsers)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(campuslinkUsers.id, user.id))
    .returning();
  
  return NextResponse.json(updated);
}
