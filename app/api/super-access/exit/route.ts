// app/api/super-access/exit/route.ts
import { NextResponse } from 'next/server';
import { clearSuperAccessCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  clearSuperAccessCookie();
  return NextResponse.json({ success: true });
}
