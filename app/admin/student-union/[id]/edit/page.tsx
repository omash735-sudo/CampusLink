// app/admin/student-union/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { studentUnionMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { StudentUnionForm } from '@/components/admin/StudentUnionForm';

export const dynamic = 'force-dynamic';

export default async function EditMemberPage({
  params,
}: {
  params: { id: string };
}) {
  const [row] = await db
    .select()
    .from(studentUnionMembers)
    .where(eq(studentUnionMembers.id, params.id));

  if (!row) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Member</h1>
        <p className="text-sm text-gray-500">{row.fullName}</p>
      </div>
      <StudentUnionForm
        mode="edit"
        initialData={{
          id: row.id,
          fullName: row.fullName,
          position: row.position,
          description: row.description || '',
          photoUrl: row.photoUrl || '',
          email: row.email || '',
          whatsapp: row.whatsapp || '',
          academicYear: row.academicYear,
          sortOrder: row.sortOrder ?? 0,
          isActive: row.isActive,
        }}
      />
    </div>
  );
}
