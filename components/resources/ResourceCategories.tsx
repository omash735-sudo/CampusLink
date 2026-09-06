// components/resources/ResourceCategories.tsx
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

export function ResourceCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/resources/categories/${category.slug}`}
            className="border border-gray-200 bg-white p-4 hover:border-primary-green transition-colors text-center"
          >
            <div className="text-2xl mb-1">{category.icon || '📚'}</div>
            <h3 className="font-medium text-sm">{category.name}</h3>
            {category.description && (
              <p className="text-xs text-muted-text mt-1">{category.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
