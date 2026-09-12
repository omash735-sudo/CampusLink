// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearAuthCookie, clearSuperAccessCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  clearAuthCookie();
  clearSuperAccessCookie();
  return NextResponse.json({ success: true });
}
