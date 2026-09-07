// app/mentor/mentees/page.tsx
import Link from 'next/link';

const mockMentees = [
  {
    id: '1',
    name: 'Jane Mwale',
    programme: 'Social Work & Youth Development',
    year: 2,
    topic: 'Academic Support',
    startDate: '2026-08-15',
    lastSession: '2026-09-04',
    nextSession: '2026-09-07',
    status: 'active',
    avatar: null
  },
  {
    id: '2',
    name: 'John Banda',
    programme: 'Agricultural Economics',
    year: 3,
    topic: 'Career Guidance',
    startDate: '2026-08-20',
    lastSession: '2026-09-03',
    nextSession: '2026-09-08',
    status: 'active',
    avatar: null
  },
  {
    id: '3',
    name: 'Sarah Phiri',
    programme: 'Food Science',
    year: 1,
    topic: 'University Life',
    startDate: '2026-09-01',
    lastSession: '2026-09-02',
    nextSession: '2026-09-10',
    status: 'needs_attention',
    avatar: null
  },
  {
    id: '4',
    name: 'David Nkhoma',
    programme: 'Environmental Science',
    year: 2,
    topic: 'Research Methods',
    startDate: '2026-08-01',
    lastSession: '2026-08-28',
    nextSession: null,
    status: 'inactive',
    avatar: null
  }
];

export default function MentorMenteesPage() {
  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Mentees</h1>
          <span className="text-sm bg-primary-green/10 text-primary-green px-3 py-1">
            {mockMentees.filter(m => m.status === 'active').length} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockMentees.map((mentee) => (
            <Link key={mentee.id} href={`/mentor/mentees/${mentee.id}`}>
              <div className="bg-white border border-gray-200 p-6 hover:border-primary-green transition-colors h-full">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary-green/10 flex items-center justify-center text-lg font-semibold text-primary-green flex-shrink-0">
                    {mentee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{mentee.name}</h3>
                      <span className={`text-xs px-2 py-0.5 ${
                        mentee.status === 'active' ? 'bg-green-100 text-green-700' :
                        mentee.status === 'needs_attention' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {mentee.status === 'active' ? 'Active' :
                         mentee.status === 'needs_attention' ? 'Needs Attention' :
                         'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-text">{mentee.programme} • Year {mentee.year}</p>
                    <p className="text-sm text-muted-text mt-1">Topic: {mentee.topic}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-text">
                      <span>Started: {new Date(mentee.startDate).toLocaleDateString()}</span>
                      {mentee.nextSession && (
                        <span>Next: {new Date(mentee.nextSession).toLocaleDateString()}</span>
                      )}
                    </div>
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
