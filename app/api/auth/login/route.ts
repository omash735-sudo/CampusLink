// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { comparePassword, signToken, setAuthCookie, getRedirectPath } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const [user] = await db
      .select()
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.email, validated.email));

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await comparePassword(validated.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isActive === false) {
      return NextResponse.json(
        {
          error:
            'Your account has been suspended. Please contact CampusLink support if you believe this is a mistake.',
          code: 'ACCOUNT_RESTRICTED',
        },
        { status: 403 }
      );
    }

    const token = signToken(user.id, user.role);

    // Next.js 15: setAuthCookie is async
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isMentor: user.isMentor,
        mentorStatus: user.mentorStatus,
        publicationsStatus: user.publicationsStatus,
      },
      redirectTo: getRedirectPath(user),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
