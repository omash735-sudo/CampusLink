// app/announcements/page.tsx
import Link from 'next/link';

const mockAnnouncements = [
  { 
    id: '1', 
    title: 'Library Extended Hours', 
    content: 'The library will be open until midnight during the exam period. Extended hours begin on November 1st.',
    priority: 'urgent',
    date: '2026-09-01',
    category: 'Academic',
  },
  { 
    id: '2', 
    title: 'Student Union Elections', 
    content: 'Nominations are now open for Student Union positions. Submit your application by September 15th.',
    priority: 'high',
    date: '2026-09-02',
    category: 'Student Life',
  },
  { 
    id: '3', 
    title: 'New Academic Resources', 
    content: 'New resources have been added to the Case Management course. Check them out in Academic Resources.',
    priority: 'normal',
    date: '2026-09-03',
    category: 'Academic',
  },
];

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Announcements</h1>

        <div className="space-y-4">
          {mockAnnouncements.map((announcement) => (
            <Link key={announcement.id} href={`/announcements/${announcement.id}`}>
              <div className={`bg-white border p-6 hover:border-primary-green transition-colors ${
                announcement.priority === 'urgent' ? 'border-l-4 border-l-red-600' :
                announcement.priority === 'high' ? 'border-l-4 border-l-orange-500' :
                'border-l-4 border-l-primary-green'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-0.5">{announcement.category}</span>
                      {announcement.priority === 'urgent' && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5">Urgent</span>
                      )}
                      {announcement.priority === 'high' && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5">High Priority</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mt-1">{announcement.title}</h3>
                    <p className="text-sm text-muted-text mt-1 line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-muted-text mt-2">{new Date(announcement.date).toLocaleDateString()}</p>
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
