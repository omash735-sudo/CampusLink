// app/api/auth/register/route.ts (updated)
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const existing = await db.select().from(users).where(eq(users.email, validated.email));
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(validated.password);
    
    const [user] = await db.insert(users).values({
      email: validated.email,
      passwordHash,
      fullName: validated.fullName,
      username: validated.username,
      programme: validated.programme,
      year: validated.year,
      role: 'student',
    }).returning();

    const token = signToken(user.id, user.role);
    setAuthCookie(token);

    return NextResponse.json({ 
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
