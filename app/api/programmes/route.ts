// app/api/programmes/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, name, code, faculty, degree, duration
      FROM programmes 
      ORDER BY faculty, name
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching programmes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programmes' },
      { status: 500 }
    );
  }
}
