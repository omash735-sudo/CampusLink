// lib/resource-categories.ts
import { db } from '@/lib/db';
import { resourceCategories } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function getActiveResourceCategories() {
  return db
    .select()
    .from(resourceCategories)
    .where(eq(resourceCategories.isActive, true))
    .orderBy(asc(resourceCategories.sortOrder), asc(resourceCategories.name));
}

export async function getAllResourceCategories() {
  return db
    .select()
    .from(resourceCategories)
    .orderBy(asc(resourceCategories.sortOrder), asc(resourceCategories.name));
}

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
