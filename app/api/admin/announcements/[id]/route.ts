// app/api/admin/announcements/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  const body = await request.json();
  
  const [updated] = await db.update(announcements)
    .set({ 
      ...body, 
      imageUrl: body.imageUrl || null, // ADDED
      updatedAt: new Date() 
    })
    .where(eq(announcements.id, params.id))
    .returning();
  
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  await db.delete(announcements).where(eq(announcements.id, params.id));
  return NextResponse.json({ success: true });
}
