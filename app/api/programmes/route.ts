// app/api/programmes/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id, 
        name, 
        code, 
        faculty, 
        department,
        degree, 
        duration,
        slug,
        description,
        campus
      FROM programmes 
      WHERE deleted_at IS NULL  -- Only show active programmes
      ORDER BY faculty, name
    `;

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
