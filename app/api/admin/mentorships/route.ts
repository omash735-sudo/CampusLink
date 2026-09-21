// app/api/admin/mentorships/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorships, mentors, campuslinkUsers } from '@/lib/db/schema';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { requireAdminOnly } from '@/lib/dev-auth';

export const runtime = 'nodejs';

const mentorUser = alias(campuslinkUsers, 'mentor_user');
const studentUser = alias(campuslinkUsers, 'student_user');

export async function GET(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || 'all';
  const q = searchParams.get('q') || '';

  const conditions: any[] = [];
  if (statusFilter !== 'all') conditions.push(eq(mentorships.status, statusFilter));
  if (q) {
    conditions.push(
      or(
        ilike(mentorUser.fullName, `%${q}%`),
        ilike(studentUser.fullName, `%${q}%`),
        ilike(mentorUser.username, `%${q}%`),
        ilike(studentUser.username, `%${q}%`)
      )!
    );
  }

  const rows = await db
    .select({
      id: mentorships.id,
      status: mentorships.status,
      startedAt: mentorships.startedAt,
      endedAt: mentorships.endedAt,
      lastInteraction: mentorships.lastInteraction,
      createdAt: mentorships.createdAt,
      mentorId: mentorships.mentorId,
      studentId: mentorships.studentId,
      mentorName: mentorUser.fullName,
      mentorUsername: mentorUser.username,
      mentorEmail: mentorUser.email,
      mentorAvatar: mentorUser.avatar,
      studentName: studentUser.fullName,
      studentUsername: studentUser.username,
      studentEmail: studentUser.email,
      studentAvatar: studentUser.avatar,
      studentProgramme: studentUser.programme,
      studentYear: studentUser.year,
    })
    .from(mentorships)
    .leftJoin(mentors, eq(mentorships.mentorId, mentors.id))
    .leftJoin(mentorUser, eq(mentors.userId, mentorUser.id))
    .leftJoin(studentUser, eq(mentorships.studentId, studentUser.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(mentorships.createdAt));

  return NextResponse.json(rows);
}
