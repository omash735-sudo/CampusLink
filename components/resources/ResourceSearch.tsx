// components/resources/ResourceSearch.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/icons';

export function ResourceSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/resources?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search resources, courses, programmes, or topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 bg-white px-4 py-3 pr-12 text-primary-text focus:border-primary-green focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 bottom-0 px-4 text-primary-green hover:text-deep-green"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
