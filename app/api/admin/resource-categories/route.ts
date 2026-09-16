// app/api/admin/resource-categories/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resourceCategories } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
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

export async function GET() {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(resourceCategories)
    .orderBy(asc(resourceCategories.sortOrder), asc(resourceCategories.name));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = resourceCategorySchema.parse(body);
    const slug = slugifyCategory(data.name);

    const [row] = await db
      .insert(resourceCategories)
      .values({
        name: data.name,
        slug,
        description: data.description || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      })
      .returning();

    return NextResponse.json({ success: true, category: row });
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
