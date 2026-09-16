// app/api/admin/resources/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { resourceCreateSchema } from '@/lib/validation';
import { extractYouTubeId } from '@/lib/youtube';
import { logAudit } from '@/lib/audit';

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
    .from(resources)
    .orderBy(desc(resources.createdAt));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = resourceCreateSchema.parse(body) as any;

    const base: any = {
      resourceKind: data.resourceKind,
      title: data.title,
      description: data.description || null,
      category: data.category || null,
      subject: data.subject || null,
      programmeId: data.programmeId || null,
      year: data.year || null,
      author: data.author || null,
      source: data.source || null,
      publicationDate:
        data.publicationDate && data.publicationDate !== ''
          ? new Date(data.publicationDate)
          : null,
      coverImageUrl: data.coverImageUrl || null,
      featured: data.featured ?? false,
      status: data.status || 'draft',
      uploadedBy: user.id,
    };

    if (data.resourceKind === 'document') {
      Object.assign(base, {
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        downloadable: data.downloadable,
        previewable: data.previewable,
        rightsType: data.rightsType,
        rightsConfirmed: true,
      });
    } else if (data.resourceKind === 'video') {
      const videoId = extractYouTubeId(data.youtubeUrl);
      if (!videoId) {
        return NextResponse.json(
          { error: 'Could not extract YouTube video ID' },
          { status: 400 }
        );
      }
      Object.assign(base, {
        youtubeUrl: data.youtubeUrl,
        youtubeVideoId: videoId,
        showEmbeddedPlayer: data.showEmbeddedPlayer,
        showYoutubeButton: data.showYoutubeButton,
      });
    } else {
      Object.assign(base, {
        body: data.body,
      });
    }

    const [row] = await db.insert(resources).values(base).returning();

    await logAudit({
      adminId: user.id,
      action: `create_resource_${data.resourceKind}`,
      entity: 'resource',
      entityId: row.id,
      newValue: { title: row.title, status: row.status },
    });

    return NextResponse.json({ success: true, resource: row });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create resource' },
      { status: 500 }
    );
  }
}
