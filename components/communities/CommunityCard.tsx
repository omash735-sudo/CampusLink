// components/communities/CommunityCard.tsx
import Link from 'next/link';

export function CommunityCard({
  community,
}: {
  community: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    whatsappLink: string | null;
    memberCount: number | null;
  };
}) {
  const whatsappHref = community.whatsappLink
    ? community.whatsappLink
    : null;

  return (
    <div className="bg-white border border-gray-200 p-5 flex flex-col hover:border-primary-green transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-primary-text">{community.name}</h3>
        {community.category && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 whitespace-nowrap">
            {community.category}
          </span>
        )}
      </div>

      {community.description && (
        <p className="text-sm text-muted-text line-clamp-3 flex-1">
          {community.description}
        </p>
      )}

      <p className="text-xs text-muted-text mt-2">
        {community.memberCount ?? 0} members
      </p>

      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 bg-primary-green text-white text-sm font-medium py-2 text-center hover:bg-deep-green transition-colors"
        >
          Join on WhatsApp →
        </a>
      )}
    </div>
  );
}
