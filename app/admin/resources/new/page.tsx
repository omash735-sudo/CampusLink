// app/admin/resources/new/page.tsx
import { ResourceForm } from '@/components/admin/ResourceForm';

export default function NewResourcePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Resource</h1>
        <p className="text-sm text-gray-500">
          Choose a resource type, fill in the details, and save as draft or publish.
        </p>
      </div>
      <ResourceForm mode="create" />
    </div>
  );
}
