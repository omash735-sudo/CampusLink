// components/campus/CampusSearch.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CampusSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/campus/explore?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search buildings, halls, facilities, offices..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 bg-white px-4 py-3 pr-12 text-primary-text focus:border-primary-green focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 bottom-0 px-4 text-primary-green hover:text-deep-green"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
