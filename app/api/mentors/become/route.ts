// app/api/mentors/become/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers, mentors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { sendMentorApplicationReceivedEmail } from '@/lib/services/email.service';
import { notifyMentorApplicationSubmitted } from '@/lib/services/notification.service';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  introduction: z.string().min(20, 'Introduction must be at least 20 characters'),
  expertise: z.array(z.string()).min(1, 'At least one expertise required'),
  subjects: z.array(z.string()).optional().default([]),
  experience: z.string().optional().default(''),
  mentorType: z.enum(['Student', 'Alumni', 'Professional', 'Staff']).default('Student'),
  availability: z.enum(['available', 'limited', 'unavailable']).default('available'),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Mentor Terms' }),
  }),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    if (user.isMentor) {
      return NextResponse.json({ error: 'You are already a mentor' }, { status: 400 });
    }

    if (user.mentorStatus === 'pending') {
      return NextResponse.json(
        { error: 'You already have a pending application' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data = schema.parse(body);

    const [mentor] = await db
      .insert(mentors)
      .values({
        userId: user.id,
        status: 'pending',
        expertise: data.expertise,
        subjects: data.subjects,
        availability: data.availability,
        introduction: data.introduction,
        experience: data.experience || null,
        rating: 0,
        reviewCount: 0,
      })
      .returning();

    await db
      .update(campuslinkUsers)
      .set({
        mentorStatus: 'pending',
        mentorType: data.mentorType,
        updatedAt: new Date(),
      })
      .where(eq(campuslinkUsers.id, user.id));

    try {
      await sendMentorApplicationReceivedEmail(user.email, user.fullName);
    } catch (e) {
      console.error('Mentor application email failed:', e);
    }

    // Notify all admins
    try {
      const admins = await db
        .select()
        .from(campuslinkUsers)
        .where(eq(campuslinkUsers.role, 'admin'));

      for (const admin of admins) {
        await notifyMentorApplicationSubmitted(admin.id, user.id, user.fullName);
      }
    } catch (e) {
      console.error('Admin notification failed:', e);
    }

    return NextResponse.json({ success: true, mentor });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
