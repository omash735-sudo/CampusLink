// components/events/EventFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EVENT_CATEGORIES } from '@/lib/event-categories';

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    router.push(`/events${params.toString() ? '?' + params.toString() : ''}`);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    router.push('/events');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters();
      }}
      className="flex flex-wrap gap-4"
    >
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] border border-gray-300 bg-white px-4 py-2 focus:border-primary-green focus:outline-none"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 bg-white px-4 py-2 focus:border-primary-green focus:outline-none"
      >
        <option value="">All Categories</option>
        {EVENT_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors"
      >
        Search
      </button>
      {(search || category) && (
        <button
          type="button"
          onClick={clearFilters}
          className="border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
