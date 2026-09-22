// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { resolveAuth } from '@/lib/auth/resolve-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const auth = await resolveAuth(request);

    if (!auth.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Strip passwordHash before returning.
    // All other user fields are passed through unchanged so existing
    // consumers (Navigation.tsx and any other clients) keep working.
    const { passwordHash, ...safeUser } = auth.user;

    return NextResponse.json({ user: safeUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}
