// components/resources/ResourceCard.tsx
import Link from 'next/link';

interface ResourceCardProps {
  resource: {
    id: string;
    resourceKind: string;
    title: string;
    description: string | null;
    category: string | null;
    subject: string | null;
    fileType: string | null;
    fileUrl: string | null;
    youtubeVideoId: string | null;
    coverImageUrl: string | null;
    author: string | null;
    source: string | null;
    featured: boolean;
  };
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const kind = resource.resourceKind;
  const href = `/resources/${resource.id}`;

  return (
    <Link
      href={href}
      className="bg-white border border-gray-200 hover:border-primary-green transition-colors flex flex-col"
    >
      {resource.coverImageUrl && (
        <div className="relative w-full aspect-video bg-gray-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resource.coverImageUrl}
            alt={resource.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-gray-100 px-2 py-0.5">
            {kind === 'document' ? (resource.fileType?.toUpperCase() || 'DOC') : 'VIDEO'}
          </span>
          {resource.category && (
            <span className="text-xs text-muted-text">{resource.category}</span>
          )}
          {resource.featured && (
            <span className="text-xs bg-primary-green/10 text-primary-green px-2 py-0.5">
              Featured
            </span>
          )}
        </div>

        <h3 className="font-semibold text-primary-text line-clamp-2">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="text-sm text-muted-text mt-2 line-clamp-3 flex-1">
            {resource.description}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-muted-text">
          <span>{resource.author || resource.source || ''}</span>
          <span className="text-primary-green font-medium">
            {kind === 'document' ? 'View →' : 'Watch →'}
          </span>
        </div>
      </div>
    </Link>
  );
}
