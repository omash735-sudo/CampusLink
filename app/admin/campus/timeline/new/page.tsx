// app/admin/campus/timeline/new/page.tsx
import Link from 'next/link';
import { TimelineForm } from '../TimelineForm';

export const dynamic = 'force-dynamic';

export default function NewCampusTimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campus/timeline"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Timeline
        </Link>
        <h1 className="text-2xl font-bold mt-1">Add Timeline Entry</h1>
        <p className="text-sm text-gray-500">
          A dated event that forms part of the campus history.
        </p>
      </div>

      <TimelineForm />
    </div>
  );
}
