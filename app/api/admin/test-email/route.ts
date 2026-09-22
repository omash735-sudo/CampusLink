// app/api/admin/test-email/route.ts
import { NextResponse } from 'next/server';
import { requireAdminOnly } from '@/lib/dev-auth';
import { sendEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const to = (body?.to || '').trim();

    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return NextResponse.json(
        { error: 'A valid recipient email is required' },
        { status: 400 }
      );
    }

    const started = Date.now();

    const result = await sendEmail({
      to,
      subject: 'CampusLink — SMTP test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
          <h1 style="color: #176B3A;">SMTP Test Successful</h1>
          <p>If you're reading this, CampusLink can deliver email.</p>
          <p style="color: #64706A; font-size: 14px;">
            Sent at: ${new Date().toISOString()}<br>
            From env: ${process.env.SMTP_FROM || '(SMTP_FROM not set)'}
          </p>
        </div>
      `,
      text: `CampusLink SMTP test — sent at ${new Date().toISOString()}`,
    });

    const elapsed = Date.now() - started;

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            (result.error as any)?.message ||
            String(result.error) ||
            'Email send failed',
          elapsedMs: elapsed,
          hint:
            'Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env.local. ' +
            'On Vercel, SMTP is often blocked — switch to an HTTP provider (Resend, SendGrid) if this keeps failing in production.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      elapsedMs: elapsed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}
