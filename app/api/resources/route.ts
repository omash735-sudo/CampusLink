// app/api/resources/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const [resource] = await db.insert(resources).values({
      title: body.title,
      description: body.description,
      type: body.type,
      course: body.course,
      programmeId: body.programmeId,
      year: body.year,
      semester: body.semester,
      academicYear: body.academicYear,
      uploadedBy: user.id,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: body.fileSize,
      status: 'pending',
    }).returning();

    return NextResponse.json({ resource });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create resource' },
      { status: 500 }
    );
  }
}
