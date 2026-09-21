// app/api/admin/feedback/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { feedback, campuslinkUsers } from '@/lib/db/schema';
import { desc, eq, and, inArray, ilike, or } from 'drizzle-orm';
import { requireAdminOnly } from '@/lib/dev-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const user = await requireAdminOnly();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || 'all';
  const categoryFilter = searchParams.get('category') || 'all';
  const q = searchParams.get('q') || '';

  const conditions: any[] = [];
  if (statusFilter !== 'all') conditions.push(eq(feedback.status, statusFilter));
  if (categoryFilter !== 'all') conditions.push(eq(feedback.category, categoryFilter));
  if (q) conditions.push(ilike(feedback.content, `%${q}%`));

  const rows = await db
    .select({
      id: feedback.id,
      content: feedback.content,
      category: feedback.category,
      status: feedback.status,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      userId: feedback.userId,
      user: {
        fullName: campuslinkUsers.fullName,
        email: campuslinkUsers.email,
        username: campuslinkUsers.username,
      },
    })
    .from(feedback)
    .leftJoin(campuslinkUsers, eq(feedback.userId, campuslinkUsers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(feedback.createdAt));

  return NextResponse.json(rows);
}
