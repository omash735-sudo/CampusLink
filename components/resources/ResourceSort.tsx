// components/resources/ResourceSort.tsx
'use client';

import { useRouter } from 'next/navigation';

interface ResourceSortProps {
  currentSort: string;
  searchParams: Record<string, string>;
}

export function ResourceSort({ currentSort, searchParams }: ResourceSortProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-text">Sort by:</span>
      <select
        className="border border-gray-300 bg-white px-3 py-1 text-sm focus:border-primary-green focus:outline-none"
        onChange={handleSortChange}
        defaultValue={currentSort}
      >
        <option value="recent">Most Recent</option>
        <option value="downloads">Most Downloaded</option>
        <option value="views">Most Viewed</option>
        <option value="title">Alphabetical</option>
      </select>
    </div>
  );
}
