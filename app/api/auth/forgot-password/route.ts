// app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { forgotPasswordSchema } from '@/lib/validation';
import { createOtpRecord } from '@/lib/password-reset';
import { sendPasswordResetOtpEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Always return 200 — do not leak whether the email exists.
    const [user] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      // Silently succeed
      return NextResponse.json({ success: true });
    }

    if (user.isActive === false) {
      // Inactive accounts can't reset — but still don't leak. Log internally.
      console.warn(`[forgot-password] inactive account attempted reset: ${email}`);
      return NextResponse.json({ success: true });
    }

    const { otp } = await createOtpRecord(user.id, user.email);

    // Fire-and-forget; don't block the response on email delivery
    sendPasswordResetOtpEmail(user.email, user.fullName, otp).catch((err) => {
      console.error('[forgot-password] email send failed:', err);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('[forgot-password] error:', error);
    // Still return 200 to avoid leaking
    return NextResponse.json({ success: true });
  }
}
