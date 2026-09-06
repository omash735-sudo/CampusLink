// app/api/admin/campus/locations/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campusLocations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  await requireAdmin();
  const locations = await db.select().from(campusLocations).orderBy(desc(campusLocations.createdAt));
  return NextResponse.json(locations);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  
  const [location] = await db.insert(campusLocations).values({
    name: body.name,
    slug: body.slug,
    category: body.category,
    description: body.description,
    shortDescription: body.shortDescription,
    address: body.address,
    coordinates: body.coordinates,
    openingHours: body.openingHours,
    contactInfo: body.contactInfo,
    accessibilityInfo: body.accessibilityInfo,
    imageUrl: body.imageUrl,
    galleryImages: body.galleryImages,
    isFeatured: body.isFeatured || false,
    isPublished: body.isPublished || true,
    sortOrder: body.sortOrder || 0,
  }).returning();
  
  return NextResponse.json(location);
}
