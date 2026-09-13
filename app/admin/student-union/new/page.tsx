// app/admin/student-union/new/page.tsx
import { StudentUnionForm } from '@/components/admin/StudentUnionForm';

export default function NewMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Student Union Member</h1>
        <p className="text-sm text-gray-500">
          Fill in the details. Required fields are marked with *.
        </p>
      </div>
      <StudentUnionForm mode="create" />
    </div>
  );
}
