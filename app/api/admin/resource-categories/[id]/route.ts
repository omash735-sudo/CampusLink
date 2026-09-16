// app/api/admin/resource-categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resourceCategories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { resourceCategorySchema } from '@/lib/validation';
import { slugifyCategory } from '@/lib/resource-categories';

export const runtime = 'nodejs';

async function requireAdminOrPublications() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'publications') return null;
  return user;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = resourceCategorySchema.parse(body);

    const [row] = await db
      .update(resourceCategories)
      .set({
        name: data.name,
        slug: slugifyCategory(data.name),
        description: data.description || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      })
      .where(eq(resourceCategories.id, params.id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, category: row });
  } catch (error: any) {
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
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db
    .update(resourceCategories)
    .set({ isActive: false })
    .where(eq(resourceCategories.id, params.id));

  return NextResponse.json({ success: true });
}
