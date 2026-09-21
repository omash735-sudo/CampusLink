// app/api/admin/users/[id]/resend-otp/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';
import { createOtpRecord } from '@/lib/password-reset';
import { sendPasswordResetOtpEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdminOnly();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user] = await db
    .select()
    .from(campuslinkUsers)
    .where(eq(campuslinkUsers.id, params.id))
    .limit(1);

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const { otp } = await createOtpRecord(user.id, user.email);
  await sendPasswordResetOtpEmail(user.email, user.fullName, otp);

  return NextResponse.json({ success: true });
}
