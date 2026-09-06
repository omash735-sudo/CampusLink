// components/resources/ResourceGrid.tsx
import { ResourceCard } from './ResourceCard';

interface ResourceGridProps {
  resources: any[];
  currentUserId?: string;
}

export function ResourceGrid({ resources, currentUserId }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="border border-gray-200 bg-white p-8 text-center">
        <p className="text-muted-text">No resources found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
