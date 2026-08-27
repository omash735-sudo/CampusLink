// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  await requireAdmin();
  const allUsers = await db.select().from(users);
  return NextResponse.json(allUsers);
}
