// app/admin/resource-categories/page.tsx
import { getAllResourceCategories } from '@/lib/resource-categories';
import { CategoryManager } from './CategoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminResourceCategoriesPage() {
  const categories = await getAllResourceCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resource Categories</h1>
        <p className="text-sm text-gray-500">
          Categories shown on the Academic Library page and in the resource
          form. Deactivating hides a category from new resources but keeps it
          on existing ones.
        </p>
      </div>

      <CategoryManager initial={categories} />
    </div>
  );
}
