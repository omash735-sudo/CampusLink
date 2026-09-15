// app/api/mentors/notes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentors, mentorNotes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireMentor } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const user = await requireMentor();
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json({ error: 'Not a mentor' }, { status: 403 });

    const body = await request.json();
    const { menteeId, content } = body;
    if (!menteeId || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const [note] = await db
      .insert(mentorNotes)
      .values({ mentorId: mentor.id, menteeId, content })
      .returning();

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireMentor();
    const [mentor] = await db
      .select()
      .from(mentors)
      .where(eq(mentors.userId, user.id));
    if (!mentor) return NextResponse.json({ error: 'Not a mentor' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await db
      .delete(mentorNotes)
      .where(and(eq(mentorNotes.id, id), eq(mentorNotes.mentorId, mentor.id)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
