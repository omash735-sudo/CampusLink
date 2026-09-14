// app/api/legal/accept/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { getCurrentVersions } from '@/lib/legal';
import { acceptLegalSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = acceptLegalSchema.parse(body);
    const { termsVersion, privacyVersion } = await getCurrentVersions();

    const now = new Date();
    await db
      .update(campuslinkUsers)
      .set({
        termsVersion,
        termsAcceptedAt: now,
        privacyVersion,
        privacyAcceptedAt: now,
        marketingEmailConsent: data.marketingEmailConsent ?? false,
        whatsappMarketingConsent: data.whatsappMarketingConsent ?? false,
        updatedAt: now,
      })
      .where(eq(campuslinkUsers.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to record acceptance' },
      { status: 500 }
    );
  }
}
