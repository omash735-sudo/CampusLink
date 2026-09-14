// app/api/clubs/register/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clubRegistrations } from '@/lib/db/schema';
import { sendClubRegistrationNotification } from '@/lib/services/email.service';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  clubName: z.string().min(2).max(120),
  category: z.string().max(60).optional().nullable(),
  description: z.string().min(20).max(2000),
  proposedBy: z.string().min(2).max(120),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(30).optional().nullable(),
  membershipInfo: z.string().max(500).optional().nullable(),
  meetingInfo: z.string().max(500).optional().nullable(),
  socialLinks: z.string().max(500).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const [row] = await db
      .insert(clubRegistrations)
      .values({
        clubName: data.clubName,
        category: data.category || null,
        description: data.description,
        proposedBy: data.proposedBy,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        membershipInfo: data.membershipInfo || null,
        meetingInfo: data.meetingInfo || null,
        socialLinks: data.socialLinks || null,
      })
      .returning();

    try {
      await sendClubRegistrationNotification(
        data.clubName,
        data.proposedBy,
        data.contactEmail,
        data.description
      );
    } catch (e) {
      console.error('Club registration notification email failed:', e);
    }

    return NextResponse.json({ success: true, id: row.id });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to submit' },
      { status: 500 }
    );
  }
}
