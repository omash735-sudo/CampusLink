// components/SuperAccessBanner.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAccessBanner({ as }: { as: 'mentor' | 'student' | 'dashboard' }) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleExit = async () => {
    setExiting(true);
    await fetch('/api/super-access/exit', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="bg-yellow-100 border-b-2 border-yellow-400 text-yellow-900 px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold">⚠️ Super Access</span>
        <span>Viewing as {as}. Session expires in under 1 hour.</span>
      </div>
      <button
        onClick={handleExit}
        disabled={exiting}
        className="bg-yellow-900 text-white px-3 py-1 text-xs font-medium hover:bg-yellow-800 disabled:opacity-50"
      >
        {exiting ? 'Exiting...' : 'Exit Super Access'}
      </button>
    </div>
  );
}
