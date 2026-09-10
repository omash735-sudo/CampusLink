// app/api/super-access/route.ts
import { NextResponse } from 'next/server';
import {
  getCurrentUser,
  isSuperAccessEnabled,
  verifySuperAccessPassword,
  setSuperAccessCookie,
} from '@/lib/auth';
import { superAccessSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    if (!isSuperAccessEnabled()) {
      return NextResponse.json({ error: 'Super access is disabled' }, { status: 404 });
    }

    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password } = superAccessSchema.parse(body);

    if (!verifySuperAccessPassword(password)) {
      return NextResponse.json({ error: 'Invalid super access password' }, { status: 401 });
    }

    setSuperAccessCookie();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}
