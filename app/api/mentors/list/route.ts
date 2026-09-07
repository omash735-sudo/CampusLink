// app/api/mentors/list/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, campuslinkUsers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const mentorsList = await db
      .select({
        id: mentors.id,
        userId: mentors.userId,
        expertise: mentors.expertise,
        subjects: mentors.subjects,
        availability: mentors.availability,
        introduction: mentors.introduction,
        rating: mentors.rating,
        reviewCount: mentors.reviewCount,
        user: {
          fullName: campuslinkUsers.fullName,
          username: campuslinkUsers.username,
          programme: campuslinkUsers.programme,
          year: campuslinkUsers.year,
          avatar: campuslinkUsers.avatar,
        }
      })
      .from(mentors)
      .leftJoin(campuslinkUsers, eq(mentors.userId, campuslinkUsers.id))
      .where(eq(mentors.status, 'approved'))
      .orderBy(desc(mentors.rating));

    return NextResponse.json(mentorsList);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
}
