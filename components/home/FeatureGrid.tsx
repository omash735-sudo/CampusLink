// components/home/FeatureGrid.tsx
import { 
  UsersIcon, 
  AcademicCapIcon, 
  BookOpenIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

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
    <section className="section-padding">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="section-title">Your Campus Community, Reimagined</h2>
          <p className="section-subtitle">
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
