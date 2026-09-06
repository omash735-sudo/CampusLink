// components/about/WhatIsThis.tsx
import { UsersIcon, AcademicIcon, BookIcon, MapIcon, CalendarIcon, UserGroupIcon, BriefcaseIcon } from '@/components/icons';

export function WhatIsThis() {
  return (
    <section className="py-16 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">More Than a Campus Website</h2>
        <p className="text-muted-text text-lg mb-8">
          CampusLink brings different parts of student life into one digital environment.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 p-4">
            <UsersIcon className="h-6 w-6 text-primary-green mb-2" />
            <h3 className="font-medium text-sm">Connect</h3>
            <p className="text-xs text-muted-text">Find other students</p>
          </div>
          <div className="border border-gray-200 p-4">
            <AcademicIcon className="h-6 w-6 text-primary-green mb-2" />
            <h3 className="font-medium text-sm">Mentors</h3>
            <p className="text-xs text-muted-text">Get guidance</p>
          </div>
          <div className="border border-gray-200 p-4">
            <BookIcon className="h-6 w-6 text-primary-green mb-2" />
            <h3 className="font-medium text-sm">Resources</h3>
            <p className="text-xs text-muted-text">Academic materials</p>
          </div>
          <div className="border border-gray-200 p-4">
            <MapIcon className="h-6 w-6 text-primary-green mb-2" />
            <h3 className="font-medium text-sm">Campus</h3>
            <p className="text-xs text-muted-text">Discover facilities</p>
          </div>
          <div className="border border-gray-200 p-4">
            <CalendarIcon className="h-6 w-6 text-primary-green mb-2" />
            <h3 className="font-medium text-sm">Events</h3>
            <p className="text-xs text-muted-text">Find announcements</p>
          </div>
          <div className="border border-gray-200 p-4">
            <UserGroupIcon className="h-6 w-6 text-primary-green mb-2" />
            <h3 className="font-medium text-sm">Communities</h3>
            <p className="text-xs text-muted-text">Join groups</p>
          </div>
        </div>
      </div>
    </section>
  );
}
