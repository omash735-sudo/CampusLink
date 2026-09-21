// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { resetPasswordSchema } from '@/lib/validation';
import { resolveResetToken, consumeResetToken } from '@/lib/password-reset';
import { hashPassword } from '@/lib/auth';
import { sendPasswordChangedConfirmationEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    const resolved = await resolveResetToken(token);
    if (!resolved.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please start over.' },
        { status: 400 }
      );
    }

    const [user] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, resolved.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(password);

    await db
      .update(campuslinkUsers)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(campuslinkUsers.id, user.id));

    await consumeResetToken(resolved.recordId);

    // Notify user their password was changed
    sendPasswordChangedConfirmationEmail(user.email, user.fullName).catch((err) => {
      console.error('[reset-password] confirmation email failed:', err);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('[reset-password] error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
