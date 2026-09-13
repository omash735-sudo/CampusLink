// app/api/admin/student-union/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studentUnionMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { studentUnionMemberSchema } from '@/lib/validation';

export const runtime = 'nodejs';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = studentUnionMemberSchema.parse(body);

    const [row] = await db
      .update(studentUnionMembers)
      .set({
        fullName: data.fullName,
        position: data.position,
        description: data.description || null,
        photoUrl: data.photoUrl || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        academicYear: data.academicYear,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(studentUnionMembers.id, params.id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: row });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await db
      .delete(studentUnionMembers)
      .where(eq(studentUnionMembers.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}
