// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { verifyOtpSchema } from '@/lib/validation';
import { verifyOtpAndIssueResetToken } from '@/lib/password-reset';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = verifyOtpSchema.parse(body);

    const result = await verifyOtpAndIssueResetToken(email.toLowerCase(), otp);

    if (!result.ok) {
      const messages: Record<string, string> = {
        not_found: 'No active reset request found. Please start again.',
        expired: 'Your code has expired. Please request a new one.',
        too_many_attempts: 'Too many incorrect attempts. Please request a new code.',
        invalid: 'Incorrect code. Please try again.',
      };
      return NextResponse.json(
        { error: messages[result.reason] || 'Verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      resetToken: result.resetToken,
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    console.error('[verify-otp] error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
