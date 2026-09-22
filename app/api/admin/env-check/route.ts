// app/api/admin/env-check/route.ts
import { NextResponse } from 'next/server';
import { requireAdminOnly } from '@/lib/dev-auth';

export const runtime = 'nodejs';

export async function GET() {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pass = process.env.SMTP_PASS || '';
  return NextResponse.json({
    SMTP_HOST: process.env.SMTP_HOST ?? null,
    SMTP_PORT: process.env.SMTP_PORT ?? null,
    SMTP_SECURE: process.env.SMTP_SECURE ?? null,
    SMTP_USER: process.env.SMTP_USER ?? null,
    SMTP_FROM: process.env.SMTP_FROM ?? null,
    SMTP_PASS_length: pass.length,
    SMTP_PASS_first_2: pass.slice(0, 2),
    SMTP_PASS_last_2: pass.slice(-2),
    SMTP_PASS_has_spaces: pass.includes(' '),
  });
}
