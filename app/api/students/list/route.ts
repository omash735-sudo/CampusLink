// app/api/students/list/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const students = await db
      .select({
        id: campuslinkUsers.id,
        fullName: campuslinkUsers.fullName,
        username: campuslinkUsers.username,
        avatar: campuslinkUsers.avatar,
        programme: campuslinkUsers.programme,
        year: campuslinkUsers.year,
        interests: campuslinkUsers.interests,
        isMentor: campuslinkUsers.isMentor,
      })
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.isActive, true))
      .orderBy(desc(campuslinkUsers.createdAt));

    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
