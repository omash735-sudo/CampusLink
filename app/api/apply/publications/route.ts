// app/api/apply/publications/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { sendPublicationsApplicationReceivedEmail } from '@/lib/services/email.service';
import { z } from 'zod';

export const runtime = 'nodejs';

const applySchema = z.object({
  motivation: z.string().min(50).max(1000),
  experience: z.string().max(500).optional().default(''),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    if (user.role === 'publications' || user.role === 'admin') {
      return NextResponse.json({ error: 'You already have access' }, { status: 400 });
    }

    if (user.publicationsStatus === 'pending') {
      return NextResponse.json({ error: 'You already have a pending application' }, { status: 400 });
    }

    const body = await request.json();
    const data = applySchema.parse(body);

    const combinedMotivation = data.experience
      ? `${data.motivation}\n\n--- Experience ---\n${data.experience}`
      : data.motivation;

    await db
      .update(campuslinkUsers)
      .set({
        publicationsStatus: 'pending',
        publicationsMotivation: combinedMotivation,
        publicationsAppliedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(campuslinkUsers.id, user.id));

    try {
      await sendPublicationsApplicationReceivedEmail(user.email, user.fullName);
    } catch (emailErr) {
      console.error('Publications application email failed:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}
