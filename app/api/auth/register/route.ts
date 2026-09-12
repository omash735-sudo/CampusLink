// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers, programmes } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { sendRegistrationReceivedEmail } from '@/lib/services/email.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check duplicate email or username
    const existing = await db
      .select({ id: campuslinkUsers.id, email: campuslinkUsers.email, username: campuslinkUsers.username })
      .from(campuslinkUsers)
      .where(
        or(
          eq(campuslinkUsers.email, validated.email),
          eq(campuslinkUsers.username, validated.username)
        )
      );

    if (existing.length > 0) {
      const dupe = existing[0];
      if (dupe.email === validated.email) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }
      if (dupe.username === validated.username) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }

    // Confirm the programme exists and get its name
    const [programme] = await db
      .select({ id: programmes.id, name: programmes.name })
      .from(programmes)
      .where(eq(programmes.id, validated.programmeId));

    if (!programme) {
      return NextResponse.json({ error: 'Invalid programme selected' }, { status: 400 });
    }

    const passwordHash = await hashPassword(validated.password);

    // Insert user as RESTRICTED (isActive: false)
    const [user] = await db
      .insert(campuslinkUsers)
      .values({
        email: validated.email,
        passwordHash,
        fullName: validated.fullName,
        username: validated.username,
        phone: validated.phone,
        programme: programme.name,
        year: validated.year,
        role: 'student',
        isActive: false,
        isVerified: false,
      })
      .returning();

    // Send confirmation email (non-blocking for the response)
    try {
      await sendRegistrationReceivedEmail(user.email, user.fullName);
    } catch (emailErr) {
      console.error('Registration confirmation email failed:', emailErr);
    }

    // NOTE: We intentionally do NOT sign a token or set a cookie.
    // The user cannot log in until an admin flips is_active to true.

    return NextResponse.json({
      success: true,
      message:
        'Your registration has been received. Check your email for confirmation.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
