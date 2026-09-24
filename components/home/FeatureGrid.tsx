// components/home/FeatureGrid.tsx

const features = [
  {
    icon: UsersIcon,
    title: 'Find Your People',
    description: 'Connect with students in your programme and cohort.',
    href: '/connect',
  },
  {
    icon: AcademicCapIcon,
    title: 'Find a Mentor',
    description: 'Learn from experienced students who have been there.',
    href: '/mentors',
  },
  {
    icon: BookOpenIcon,
    title: 'Academic Resources',
    description: 'Access notes, past papers, and study materials.',
    href: '/resources',
  },
  {
    icon: MapPinIcon,
    title: 'Discover Campus',
    description: 'Learn everything about LUANAR City Campus.',
    href: '/campus',
  },
  {
    icon: CalendarIcon,
    title: 'Events',
    description: 'Stay updated on campus events and activities.',
    href: '/events',
  },
  {
    icon: UserGroupIcon,
    title: 'Communities',
    description: 'Join groups and connect with like-minded students.',
    href: '/groups',
  },
  {
    icon: BriefcaseIcon,
    title: 'Opportunities',
    description: 'Find internships, scholarships, and career opportunities.',
    href: '/opportunities',
  },
  {
    icon: LightBulbIcon,
    title: 'First-Year Guide',
    description: 'Everything you need to know about starting at City Campus.',
    href: '/campus/first-year-guide',
  },
];

export function FeatureGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Your Campus Community, Reimagined</h2>
          <p className="text-muted-text mt-2">
            Everything you need to navigate university life, all in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="group border border-gray-200 bg-white p-6 transition-colors hover:border-primary-green hover:bg-off-white"
            >
              <feature.icon className="mb-4 h-8 w-8 text-primary-green" />
              <h3 className="mb-2 text-lg font-semibold text-primary-text group-hover:text-primary-green">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-text">{feature.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// SVG Icons
function UsersIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
}

function AcademicCapIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>;
}

function BookOpenIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}

function MapPinIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}

function CalendarIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}

function BriefcaseIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}

function UserGroupIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
}

function LightBulbIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
}
