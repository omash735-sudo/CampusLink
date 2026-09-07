// app/api/mentor/requests/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorshipRequests, campuslinkUsers, mentors } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await requireMentor();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    // Get mentor profile
    const mentor = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id))
      .then(res => res[0]);

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor profile not found' },
        { status: 404 }
      );
    }

    const requests = await db
      .select({
        id: mentorshipRequests.id,
        message: mentorshipRequests.message,
        createdAt: mentorshipRequests.createdAt,
        student: {
          fullName: campuslinkUsers.fullName,
          username: campuslinkUsers.username,
          programme: campuslinkUsers.programme,
          year: campuslinkUsers.year,
          avatar: campuslinkUsers.avatar,
        }
      })
      .from(mentorshipRequests)
      .leftJoin(campuslinkUsers, eq(mentorshipRequests.studentId, campuslinkUsers.id))
      .where(and(
        eq(mentorshipRequests.mentorId, mentor.id),
        status === 'all' ? undefined : eq(mentorshipRequests.status, status)
      ))
      .orderBy(desc(mentorshipRequests.createdAt));

    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch requests' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
