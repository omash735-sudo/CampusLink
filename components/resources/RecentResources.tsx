// components/resources/RecentResources.tsx
import Link from 'next/link';

export function RecentResources({ resources }: { resources: any[] }) {
  if (resources.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Recently Added</h2>
      <div className="space-y-3">
        {resources.map((resource) => (
          <Link
            key={resource.id}
            href={`/resources/${resource.id}`}
            className="block border border-gray-200 bg-white p-3 hover:border-primary-green transition-colors"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1">{resource.title}</h3>
                {resource.programme && (
                  <p className="text-xs text-muted-text">{resource.programme.name}</p>
                )}
                <div className="flex gap-3 mt-1 text-xs text-muted-text">
                  <span>Added: {new Date(resource.createdAt).toLocaleDateString()}</span>
                  <span>{resource.fileType?.toUpperCase() || 'File'}</span>
                </div>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-0.5 flex-shrink-0">
                New
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
