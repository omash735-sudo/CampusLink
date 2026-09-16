// app/admin/resources/new/page.tsx
import { ResourceForm } from '@/components/admin/ResourceForm';
import { getActiveResourceCategories } from '@/lib/resource-categories';

export const dynamic = 'force-dynamic';

export default async function NewResourcePage() {
  const cats = await getActiveResourceCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Resource</h1>
        <p className="text-sm text-gray-500">
          Choose a resource type, fill in the details, and save as draft or
          publish.
        </p>
      </div>
      <ResourceForm mode="create" categories={cats.map((c) => c.name)} />
    </div>
  );
}
