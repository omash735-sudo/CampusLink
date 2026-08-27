// app/api/student/mentors/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { mentorSchema } from '@/lib/validation';

export async function GET() {
  await requireAuth();
  const all = await db.select().from(mentors)
    .where(eq(mentors.isApproved, true))
    .orderBy(mentors.rating, 'desc');
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const user = await requireAuth();
  const body = await request.json();
  const validated = mentorSchema.parse(body);
  
  const [mentor] = await db.insert(mentors).values({
    userId: user.id,
    ...validated,
    status: 'pending',
  }).returning();
  
  return NextResponse.json(mentor);
}
