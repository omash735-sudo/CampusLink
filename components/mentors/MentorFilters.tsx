// components/mentors/MentorFilters.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilterIcon, XIcon } from '@/components/icons';

interface ExpertiseOption {
  name: string;
}

export function MentorFilters({
  expertiseOptions,
  mentorTypes,
}: {
  expertiseOptions: ExpertiseOption[];
  mentorTypes: string[];
}) {
  const router = useRouter();
  const [expertise, setExpertise] = useState('');
  const [type, setType] = useState('');
  const [availability, setAvailability] = useState('');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (expertise) params.set('expertise', expertise);
    if (type) params.set('type', type);
    if (availability) params.set('availability', availability);
    router.push(`/mentors?${params.toString()}`);
  };

  const handleClear = () => {
    setExpertise('');
    setType('');
    setAvailability('');
    router.push('/mentors');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="text-sm font-medium block mb-1">Expertise</label>
        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
        >
          <option value="">All Expertise</option>
          {expertiseOptions.map((exp) => (
            <option key={exp.name} value={exp.name}>{exp.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Mentor Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
        >
          <option value="">All Types</option>
          {mentorTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Availability</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-green focus:outline-none"
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="limited">Limited Availability</option>
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
