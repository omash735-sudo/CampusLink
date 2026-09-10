// app/api/admin/setup/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campuslinkUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, adminExists } from '@/lib/auth';
import { adminSetupSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Hard block if admin already exists
    if (await adminExists()) {
      return NextResponse.json({ error: 'Admin already configured' }, { status: 403 });
    }

    const body = await request.json();
    const data = adminSetupSchema.parse(body);

    // Check for duplicate email or username
    const existing = await db
      .select({ id: campuslinkUsers.id })
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.email, data.email))
      .then((r) => r[0]);
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const existingUsername = await db
      .select({ id: campuslinkUsers.id })
      .from(campuslinkUsers)
      .where(eq(campuslinkUsers.username, data.username))
      .then((r) => r[0]);
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);

    await db.insert(campuslinkUsers).values({
      email: data.email,
      username: data.username,
      fullName: data.fullName,
      passwordHash,
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Setup failed' },
      { status: 400 }
    );
  }
}
