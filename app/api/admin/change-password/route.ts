// app/api/admin/change-password/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser, comparePassword, hashPassword } from '@/lib/auth';
import { changePasswordSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = changePasswordSchema.parse(body);

    // Load fresh row (getCurrentUser doesn't return passwordHash)
    const [fresh] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.id, user.id));

    if (!fresh?.passwordHash) {
      return NextResponse.json({ error: 'Invalid account' }, { status: 400 });
    }

    const valid = await comparePassword(data.currentPassword, fresh.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const newHash = await hashPassword(data.newPassword);

    await db
      .update(campuslinkUsers)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(campuslinkUsers.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status: 400 }
    );
  }
}
