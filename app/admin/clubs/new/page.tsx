// app/admin/clubs/new/page.tsx
import { ClubForm } from '@/components/admin/ClubForm';

export default function NewClubPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Club</h1>
      <ClubForm mode="create" />
    </div>
  );
}
