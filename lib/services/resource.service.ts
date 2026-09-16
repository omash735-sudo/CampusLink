// lib/services/resource.service.ts
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function incrementResourceView(id: string) {
  await db
    .update(resources)
    .set({ viewCount: sql`${resources.viewCount} + 1` })
    .where(eq(resources.id, id));
}

export async function incrementResourceDownload(id: string) {
  await db
    .update(resources)
    .set({ downloads: sql`${resources.downloads} + 1` })
    .where(eq(resources.id, id));
}
