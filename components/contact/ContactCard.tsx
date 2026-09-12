// components/contact/ContactCard.tsx
import { ReactNode } from 'react';

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  external?: boolean;
}

export function ContactCard({
  icon,
  title,
  description,
  buttonLabel,
  href,
  external = false,
}: ContactCardProps) {
  return (
    <div className="bg-white border border-gray-200 p-8 flex flex-col h-full hover:border-primary-green transition-colors">
      <div className="mb-4 flex justify-center">
        <div className="h-14 w-14 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">
          {icon}
        </div>
      </div>

      <h2 className="text-xl font-bold text-center mb-3">{title}</h2>

      <p className="text-sm text-muted-text text-center mb-6 flex-1">
        {description}
      </p>

      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="bg-primary-green text-white font-medium px-6 py-3 text-center hover:bg-deep-green transition-colors block w-full"
      >
        {buttonLabel}
      </a>
    </div>
  );
}
