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
      programmeId: body.programmeId || null,
      courseId: body.courseId || null,
      year: body.year || null,
      semester: body.semester || null,
      academicYear: body.academicYear || null,
      course: body.course || null,
      uploadedBy: user.id,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: body.fileSize,
      status: 'pending',
      downloads: 0,
      viewCount: 0,
      isVerified: false,
    }).returning();

    return NextResponse.json({ resource });
  } catch (error: any) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create resource' },
      { status: 500 }
    );
  }
}
