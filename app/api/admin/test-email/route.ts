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
          <h1 style="color: #176B3A;">SMTP test</h1>
          <p>If you're reading this, CampusLink can deliver email.</p>
          <p style="color: #64706A; font-size: 14px;">
            Sent: ${new Date().toISOString()}<br>
            From: ${process.env.SMTP_FROM || process.env.SMTP_USER || '(not set)'}<br>
            To: ${to}
          </p>
        </div>
      `,
      text: `CampusLink SMTP test — sent at ${new Date().toISOString()}`,
    });

    const elapsed = Date.now() - started;

    if (!result.success) {
      const err = result.error as any;
      return NextResponse.json(
        {
          success: false,
          error: err?.message || String(err) || 'Email send failed',
          code: err?.code,
          command: err?.command,
          response: err?.response,
          elapsedMs: elapsed,
          hint: buildHint(err),
        },
        { status: 500 }
      );
    }

    // Success: verify the server actually accepted our recipient
    const accepted = result.accepted ?? [];
    const rejected = result.rejected ?? [];
    const recipientAccepted = accepted.includes(to);
    const recipientRejected = rejected.includes(to);

    return NextResponse.json({
      success: true,
      recipientAccepted,
      recipientRejected,
      messageId: result.messageId,
      response: result.response,
      accepted,
      rejected,
      envelope: result.envelope,
      from: process.env.SMTP_FROM || process.env.SMTP_USER || null,
      to,
      elapsedMs: elapsed,
      // If the server accepted the envelope but rejected the recipient,
      // this is a delivery problem, not a config problem.
      warning:
        recipientRejected
          ? 'SMTP server accepted the connection but rejected the recipient address.'
          : !recipientAccepted
          ? 'SMTP server did not confirm the recipient. Message may be silently dropped.'
          : undefined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}

function buildHint(err: any): string {
  const msg = (err?.message || '').toLowerCase();
  const code = err?.code || '';

  if (msg.includes('invalid login') || code === 'EAUTH') {
    return 'Gmail: SMTP_PASS must be a 16-character App Password (not your login password). ' +
           'SMTP_USER and SMTP_FROM should both be your full Gmail address.';
  }
  if (code === 'ECONNECTION' || code === 'ETIMEDOUT' || msg.includes('timeout')) {
    return 'Cannot reach the SMTP server. Check SMTP_HOST and SMTP_PORT. ' +
           'On Vercel, outbound SMTP is often blocked — use a preview deploy or local dev.';
  }
  if (code === 'ESOCKET' || msg.includes('ssl') || msg.includes('tls')) {
    return 'TLS/SSL mismatch. For port 587 use SMTP_SECURE=false. For port 465 use SMTP_SECURE=true.';
  }
  if (msg.includes('sender address rejected') || msg.includes('from')) {
    return 'Sender address rejected. SMTP_FROM must be the same address you authenticate as (SMTP_USER).';
  }
  return 'Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env.local.';
}
