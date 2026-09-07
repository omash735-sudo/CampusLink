// app/events/page.tsx
import Link from 'next/link';
import { CalendarIcon, LocationIcon } from '@/components/icons';

const mockEvents = [
  { 
    id: '1', 
    title: 'Orientation Week', 
    date: '2026-09-15', 
    time: '09:00', 
    location: 'Main Hall',
    description: 'Welcome new students to campus.',
    category: 'Orientation',
    status: 'upcoming'
  },
  { 
    id: '2', 
    title: 'Career Fair 2026', 
    date: '2026-09-20', 
    time: '10:00', 
    location: 'Student Center',
    description: 'Connect with employers and explore career opportunities.',
    category: 'Career',
    status: 'upcoming'
  },
  { 
    id: '3', 
    title: 'Research Symposium', 
    date: '2026-09-25', 
    time: '14:00', 
    location: 'Lecture Hall B',
    description: 'Present your research and learn from others.',
    category: 'Academic',
    status: 'upcoming'
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Events</h1>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search events..."
              className="flex-1 min-w-[200px] border border-gray-300 bg-white px-4 py-2 focus:border-primary-green focus:outline-none"
            />
            <select className="border border-gray-300 bg-white px-4 py-2 focus:border-primary-green focus:outline-none">
              <option value="">All Categories</option>
              <option value="Orientation">Orientation</option>
              <option value="Career">Career</option>
              <option value="Academic">Academic</option>
              <option value="Social">Social</option>
            </select>
            <button className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="border border-gray-200 bg-white hover:border-primary-green transition-colors p-6 h-full">
                <div className="flex items-start justify-between">
                  <span className="text-xs bg-primary-green/10 text-primary-green px-3 py-1">
                    {event.category}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5">Upcoming</span>
                </div>
                <h3 className="text-lg font-semibold mt-3">{event.title}</h3>
                <p className="text-sm text-muted-text mt-1 line-clamp-2">{event.description}</p>
                <div className="mt-3 space-y-1 text-sm text-muted-text">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
