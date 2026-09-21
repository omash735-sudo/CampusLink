// app/admin/campus/locations/new/page.tsx
import Link from 'next/link';
import { LocationForm } from '../LocationForm';

export const dynamic = 'force-dynamic';

export default function NewCampusLocationPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campus/locations"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Locations
        </Link>
        <h1 className="text-2xl font-bold mt-1">Add Location</h1>
        <p className="text-sm text-gray-500">
          Create a new campus location. You can save as a draft and publish
          later.
        </p>
      </div>

      <LocationForm />
    </div>
  );
}
