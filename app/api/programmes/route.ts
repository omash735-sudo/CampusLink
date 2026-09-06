// app/api/programmes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { programmes } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const rows = await db
      .select({
        id: programmes.id,
        name: programmes.name,
        code: programmes.code,
        faculty: programmes.faculty,
        department: programmes.department,
        degree: programmes.degree,
        duration: programmes.duration,
        slug: programmes.slug,
        description: programmes.description,
        campus: programmes.campus,
      })
      .from(programmes)
      .where(eq(programmes.isActive, true))
      .orderBy(asc(programmes.faculty), asc(programmes.name));

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No programmes found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programmes' },
      { status: 500 }
    );
  }
}
