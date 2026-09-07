// components/about/WhatWeAreBuilding.tsx
import Link from 'next/link';
import { UsersIcon, AcademicIcon, BookOpenIcon, MapPinIcon, UserGroupIcon } from '@/components/icons';

export function WhatWeAreBuilding() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">One Place for Campus Life</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/connect" className="border border-gray-200 p-6 hover:border-primary-green transition-colors group">
            <UsersIcon className="h-8 w-8 text-primary-green mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Connect</h3>
            <p className="text-muted-text text-sm">Find people, cohorts, and communities.</p>
          </Link>
          <Link href="/resources" className="border border-gray-200 p-6 hover:border-primary-green transition-colors group">
            <BookOpenIcon className="h-8 w-8 text-primary-green mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Learn</h3>
            <p className="text-muted-text text-sm">Access academic resources and find mentors.</p>
          </Link>
          <Link href="/campus" className="border border-gray-200 p-6 hover:border-primary-green transition-colors group">
            <MapPinIcon className="h-8 w-8 text-primary-green mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Discover</h3>
            <p className="text-muted-text text-sm">Explore campus, events, announcements, and opportunities.</p>
          </Link>
          <Link href="/connect" className="border border-gray-200 p-6 hover:border-primary-green transition-colors group">
            <UserGroupIcon className="h-8 w-8 text-primary-green mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Belong</h3>
            <p className="text-muted-text text-sm">Build relationships and participate in the wider student community.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
