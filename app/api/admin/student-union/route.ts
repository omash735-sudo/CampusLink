// app/api/admin/student-union/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentUnionMembers } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { studentUnionMemberSchema } from '@/lib/validation';

export const runtime = 'nodejs';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(studentUnionMembers)
    .orderBy(
      desc(studentUnionMembers.academicYear),
      studentUnionMembers.sortOrder
    );

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = studentUnionMemberSchema.parse(body);

    const [row] = await db
      .insert(studentUnionMembers)
      .values({
        fullName: data.fullName,
        position: data.position,
        description: data.description || null,
        photoUrl: data.photoUrl || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        academicYear: data.academicYear,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      })
      .returning();

    return NextResponse.json({ success: true, member: row });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create' },
      { status: 500 }
    );
  }
}
