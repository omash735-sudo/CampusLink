// app/admin/spotlights/new/page.tsx
import { SpotlightForm } from '@/components/admin/SpotlightForm';

export default function NewSpotlightPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Spotlight</h1>
        <p className="text-sm text-gray-500">
          Create a new student spotlight. You can save as draft or publish immediately.
        </p>
      </div>
      <SpotlightForm mode="create" />
    </div>
  );
}
