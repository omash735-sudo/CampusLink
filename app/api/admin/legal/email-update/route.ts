// app/api/admin/legal/email-update/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendTermsUpdatedEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

// TEMPORARY: set to false once Terms and Privacy are pasted and verified.
const TEMP_BYPASS = true;

async function requireAdmin() {
  if (TEMP_BYPASS) return true;
  const { getCurrentUser } = await import('@/lib/auth');
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export async function POST() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await db
      .select({
        email: campuslinkUsers.email,
        fullName: campuslinkUsers.fullName,
      })
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.isActive, true));

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await sendTermsUpdatedEmail(user.email, user.fullName);
        sent++;
      } catch (err) {
        console.error(`Failed to email ${user.email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      total: users.length,
      sent,
      failed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send emails' },
      { status: 500 }
    );
  }
}
