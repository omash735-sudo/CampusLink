// components/connect/StudentFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilterIcon, XIcon } from '@/components/icons';

interface Programme {
  id: string;
  name: string;
}

export function StudentFilters({ programmes }: { programmes: Programme[] }) {
  const router = useRouter();
  const [programme, setProgramme] = useState('');
  const [year, setYear] = useState('');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (programme) params.set('programme', programme);
    if (year) params.set('year', year);
    router.push(`/connect/students?${params.toString()}`);
  };

  const handleClear = () => {
    setProgramme('');
    setYear('');
    router.push('/connect/students');
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium block mb-1">Programme</label>
        <select
          value={programme}
          onChange={(e) => setProgramme(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
        >
          <option value="">All Programmes</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
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

      <div className="flex gap-2">
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
