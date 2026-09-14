// app/admin/clubs/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ClubForm } from '@/components/admin/ClubForm';

export const dynamic = 'force-dynamic';

export default async function EditClubPage({ params }: { params: { id: string } }) {
  const [club] = await db.select().from(clubs).where(eq(clubs.id, params.id));
  if (!club) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Club</h1>
      <ClubForm
        mode="edit"
        initialData={{
          id: club.id,
          name: club.name,
          description: club.description,
          category: club.category || '',
          logoUrl: club.logoUrl || '',
          email: club.email || '',
          whatsapp: club.whatsapp || '',
          instagramUrl: club.instagramUrl || '',
          websiteUrl: club.websiteUrl || '',
          meetingInfo: club.meetingInfo || '',
          membershipInfo: club.membershipInfo || '',
          isActive: club.isActive,
          isFeatured: club.isFeatured,
          sortOrder: club.sortOrder ?? 0,
        }}
      />
    </div>
  );
}
