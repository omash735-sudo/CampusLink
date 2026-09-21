// app/api/admin/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdminOrPublications } from '@/lib/dev-auth';

export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_TYPES = [
  'student-union',
  'spotlights',
  'clubs',
  'announcements',
  'events',
  'resource-covers',
  'campus',            // ← added
  'general',
];

const DOCUMENT_TYPES = ['resources'];

const ALLOWED_DOC_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const rawType = (formData.get('type') as string) || 'general';

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isDocumentUpload = DOCUMENT_TYPES.includes(rawType);
    const isImageUpload = IMAGE_TYPES.includes(rawType);

    if (!isDocumentUpload && !isImageUpload) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    if (isDocumentUpload) {
      if (!ALLOWED_DOC_MIMES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only PDF, PPTX, and DOCX files are allowed' },
          { status: 400 }
        );
      }
      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File must be smaller than 20MB' },
          { status: 400 }
        );
      }
    } else {
      if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only JPG, PNG, and WebP images are allowed' },
          { status: 400 }
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image must be smaller than 5MB' },
          { status: 400 }
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `campuslink/${rawType}`,
          resource_type: isDocumentUpload ? 'raw' : 'image',
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      filename: file.name,
      mimetype: file.type,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
