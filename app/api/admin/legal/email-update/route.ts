// app/api/admin/legal/email-update/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { sendTermsUpdatedEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== 'admin') {
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
