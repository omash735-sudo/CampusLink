// app/mentor/mentees/[id]/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const mockMenteeData = {
  id: '1',
  name: 'Jane Mwale',
  programme: 'Social Work & Youth Development',
  year: 2,
  bio: 'Second-year student passionate about community development and social justice.',
  topic: 'Academic Support',
  startDate: '2026-08-15',
  status: 'active',
  goal: 'Improve research methods understanding and academic performance.',
  lastSession: '2026-09-04',
  nextSession: '2026-09-07',
  progress: 65,
  sessions: [
    { id: '1', date: '2026-09-04', topic: 'Research Methods Introduction', status: 'completed' },
    { id: '2', date: '2026-08-28', topic: 'Literature Review', status: 'completed' },
    { id: '3', date: '2026-08-21', topic: 'Understanding Assignment Requirements', status: 'completed' },
    { id: '4', date: '2026-09-07', topic: 'Data Analysis Techniques', status: 'upcoming' },
  ],
  resources: [
    { id: '1', title: 'Research Methods Guide', type: 'PDF', shared: '2026-08-20' },
    { id: '2', title: 'Literature Review Template', type: 'DOC', shared: '2026-08-27' },
  ],
  notes: [
    { id: '1', content: 'Jane is making good progress. She needs more practice with qualitative analysis.', date: '2026-09-04' },
    { id: '2', content: 'Work on literature review structure next session.', date: '2026-08-28' },
  ]
};

export default function IndividualMenteePage() {
  const params = useParams();
  const [notes, setNotes] = useState(mockMenteeData.notes);
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        { id: String(Date.now()), content: newNote, date: new Date().toISOString() }
      ]);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/mentor/mentees" className="text-primary-green hover:underline text-sm">
          ← Back to Mentees
        </Link>

        {/* Student Header */}
        <div className="bg-white border border-gray-200 p-6 mt-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl font-semibold text-primary-green flex-shrink-0">
              {mockMenteeData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{mockMenteeData.name}</h1>
              <p className="text-muted-text">{mockMenteeData.programme} • Year {mockMenteeData.year}</p>
              <p className="text-sm text-muted-text mt-1">{mockMenteeData.bio}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1">Active</span>
              <Link href="/mentor/schedule" className="bg-primary-green text-white px-4 py-2 text-sm hover:bg-deep-green transition-colors">
                Schedule Session
              </Link>
            </div>
          </div>
        </div>

        {/* Mentorship Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="font-semibold mb-2">Mentorship Overview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-text">Started</span>
                <span>{new Date(mockMenteeData.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Status</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Main Goal</span>
                <span className="text-right">{mockMenteeData.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Last Session</span>
                <span>{new Date(mockMenteeData.lastSession).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Next Session</span>
                <span>{new Date(mockMenteeData.nextSession).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h3 className="font-semibold mb-2">Progress</h3>
            <div className="mb-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{mockMenteeData.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 mt-1">
                <div className="h-full bg-primary-green" style={{ width: `${mockMenteeData.progress}%` }} />
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-text">Sessions Completed</span>
                <span>{mockMenteeData
