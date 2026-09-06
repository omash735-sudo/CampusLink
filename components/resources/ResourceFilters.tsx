// components/resources/ResourceFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilterIcon, XIcon } from '@/components/icons';

interface Programme {
  id: string;
  name: string;
}

export function ResourceFilters({
  programmes,
  resourceTypes,
}: {
  programmes: Programme[];
  resourceTypes: string[];
}) {
  const router = useRouter();
  const [type, setType] = useState('');
  const [programme, setProgramme] = useState('');
  const [year, setYear] = useState('');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (programme) params.set('programme', programme);
    if (year) params.set('year', year);
    router.push(`/resources?${params.toString()}`);
  };

  const handleClear = () => {
    setType('');
    setProgramme('');
    setYear('');
    router.push('/resources');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="text-sm font-medium block mb-1">Resource Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
        >
          <option value="">All Types</option>
          {resourceTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Programme</label>
        <select
          value={programme}
          onChange={(e) => setProgramme(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
        >
          <option value="">All Programmes</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Year</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
        >
          <option value="">All Years</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-2">
        <button
          onClick={handleApply}
          className="flex-1 bg-primary-green text-white px-4 py-2 text-sm hover:bg-deep-green transition-colors"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="flex-1 border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
        >
          <XIcon className="h-3 w-3" />
          Clear
        </button>
      </div>
    </div>
  );
}
