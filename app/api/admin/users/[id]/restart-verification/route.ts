// app/api/admin/users/[id]/restart-verification/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { passwordResetOtps } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdminOnly();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db
    .update(passwordResetOtps)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(passwordResetOtps.userId, params.id),
        isNull(passwordResetOtps.consumedAt)
      )
    );

  return NextResponse.json({ success: true });
}
