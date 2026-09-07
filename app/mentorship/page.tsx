// app/mentorship/page.tsx
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

const mockMentorships = [
  {
    id: '1',
    mentor: 'Dr. Jane Mwale',
    programme: 'Social Work',
    topic: 'Career Guidance',
    status: 'active',
    startDate: '2026-08-15',
  },
  {
    id: '2',
    mentor: 'John Banda',
    programme: 'Agricultural Economics',
    topic: 'Academic Support',
    status: 'pending',
    startDate: '2026-09-01',
  },
  {
    id: '3',
    mentor: 'Sarah Phiri',
    programme: 'Food Science',
    topic: 'Research Methods',
    status: 'completed',
    startDate: '2026-06-01',
  },
];

export default async function MentorshipPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Mentorships</h1>
          <Link 
            href="/mentors" 
            className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors"
          >
            Find a Mentor
          </Link>
        </div>

        {/* Active Mentorship */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Active Mentorship</h2>
          {mockMentorships.filter(m => m.status === 'active').length > 0 ? (
            mockMentorships.filter(m => m.status === 'active').map((m) => (
              <div key={m.id} className="border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{m.mentor}</h3>
                    <p className="text-sm text-muted-text">{m.programme} • {m.topic}</p>
                    <p className="text-xs text-muted-text">Started {new Date(m.startDate).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1">Active</span>
                </div>
                <div className="mt-3 flex gap-3">
                  <button className="text-sm text-primary-green hover:underline">Message</button>
                  <button className="text-sm text-primary-green hover:underline">View Profile</button>
                  <button className="text-sm text-red-600 hover:underline">End Mentorship</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-text">No active mentorships.</p>
          )}
        </div>

        {/* Pending Requests */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
          {mockMentorships.filter(m => m.status === 'pending').length > 0 ? (
            mockMentorships.filter(m => m.status === 'pending').map((m) => (
              <div key={m.id} className="border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{m.mentor}</h3>
                    <p className="text-sm text-muted-text">{m.programme} • {m.topic}</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1">Pending</span>
                </div>
                <p className="text-xs text-muted-text mt-2">Request sent • Awaiting response</p>
              </div>
            ))
          ) : (
            <p className="text-muted-text">No pending requests.</p>
          )}
        </div>

        {/* Previous Mentorships */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Previous Mentorships</h2>
          {mockMentorships.filter(m => m.status === 'completed').length > 0 ? (
            mockMentorships.filter(m => m.status === 'completed').map((m) => (
              <div key={m.id} className="border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{m.mentor}</h3>
                    <p className="text-sm text-muted-text">{m.programme} • {m.topic}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1">Completed</span>
                </div>
                <p className="text-xs text-muted-text mt-2">Completed {new Date(m.startDate).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-text">No previous mentorships.</p>
          )}
        </div>
      </div>
    </div>
  );
}
