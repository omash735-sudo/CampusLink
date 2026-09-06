// app/api/student/mentors/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { mentorSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function GET() {
  await requireAuth();
  const all = await db.select().from(mentors)
    .where(eq(mentors.status, 'verified'))
    .orderBy(desc(mentors.rating));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const user = await requireAuth();
  const body = await request.json();
  const validated = mentorSchema.parse(body);
  
  const [mentor] = await db.insert(mentors).values({
    userId: user.id,
    expertise: validated.expertise || [],
    subjects: validated.subjects || [],
    introduction: validated.introduction || '',
    experience: validated.experience || null,
    availability: 'available', // Set default availability
    status: 'pending',
  }).returning();
  
  return NextResponse.json(mentor);
}
