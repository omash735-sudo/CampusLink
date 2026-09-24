// app/api/communities/mine/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { groups } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { resolveAuth } from '@/lib/auth/resolve-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await resolveAuth();
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(groups)
    .where(eq(groups.submittedBy, auth.user.id))
    .orderBy(desc(groups.createdAt));

  return NextResponse.json(rows);
}
