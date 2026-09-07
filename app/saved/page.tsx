// app/saved/page.tsx
import Link from 'next/link';
import { BookOpenIcon, CalendarIcon } from '@/components/icons';

const mockSavedResources = [
  { id: '1', title: 'Case Management Notes', type: 'resource', course: 'Social Work' },
  { id: '2', title: 'Research Methods Guide', type: 'resource', course: 'Research' },
];

const mockSavedEvents = [
  { id: '3', title: 'Career Fair 2026', type: 'event', date: '2026-09-20' },
];

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Saved Items</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resources */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-primary-green" />
              Resources
            </h2>
            {mockSavedResources.length > 0 ? (
              <div className="space-y-3">
                {mockSavedResources.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/resources/${item.id}`}
                    className="block border-b border-gray-100 pb-3 last:border-0 hover:text-primary-green transition-colors"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-text">{item.course}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-text">No saved resources.</p>
            )}
          </div>

          {/* Events */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary-green" />
              Events
            </h2>
            {mockSavedEvents.length > 0 ? (
              <div className="space-y-3">
                {mockSavedEvents.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/events/${item.id}`}
                    className="block border-b border-gray-100 pb-3 last:border-0 hover:text-primary-green transition-colors"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-text">{new Date(item.date).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-text">No saved events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
