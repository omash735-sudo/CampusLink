import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { resourceUpdateSchema } from '@/lib/validation';
import { extractYouTubeId } from '@/lib/youtube';
import { logAudit } from '@/lib/audit';
import { requireAdminOrPublications } from '@/lib/dev-bypass';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [row] = await db.select().from(resources).where(eq(resources.id, params.id));
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAdminOrPublications();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = resourceUpdateSchema.parse({ ...body, id: params.id });

    const [existing] = await db.select().from(resources).where(eq(resources.id, params.id));
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const patch: any = { updatedAt: new Date() };

    const passthroughKeys = [
      'title','description','category','subject','programmeId','year',
      'author','source','coverImageUrl','body','showEmbeddedPlayer',
      'showYoutubeButton','downloadable','previewable','featured','status',
      'rightsType','rightsConfirmed','fileUrl','fileName','fileType','fileSize',
    ] as const;

    for (const key of passthroughKeys) {
      if (key in data) {
        patch[key] = (data as any)[key] ?? null;
      }
    }

    if ('publicationDate' in data) {
      patch.publicationDate = data.publicationDate ? new Date(data.publicationDate) : null;
    }

    if ('youtubeUrl' in data && data.youtubeUrl) {
      const videoId = extractYouTubeId(data.youtubeUrl);
      if (!videoId) {
        return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
      }
      patch.youtubeUrl = data.youtubeUrl;
      patch.youtubeVideoId = videoId;
    }

    if (patch.status === 'archived') {
      patch.archivedAt = new Date();
    } else if (patch.status && patch.status !== 'archived') {
      patch.archivedAt = null;
    }

    const [row] = await db.update(resources).set(patch).where(eq(resources.id, params.id)).returning();

    if (user.id) {
      await logAudit({
        adminId: user.id,
        action: 'update_resource',
        entity: 'resource',
        entityId: params.id,
        previousValue: { status: existing.status, title: existing.title },
        newValue: { status: row.status, title: row.title },
      });
    }

    return NextResponse.json({ success: true, resource: row });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update resource' },
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

  await db.delete(resources).where(eq(resources.id, params.id));

  if (user.id) {
    await logAudit({
      adminId: user.id,
      action: 'delete_resource',
      entity: 'resource',
      entityId: params.id,
    });
  }

  return NextResponse.json({ success: true });
}
