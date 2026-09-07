// app/mentor/schedule/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarIcon, PlusIcon } from '@/components/icons';

const mockAvailability = {
  monday: ['09:00-12:00', '14:00-17:00'],
  tuesday: ['09:00-12:00', '14:00-17:00'],
  wednesday: ['09:00-12:00', '14:00-17:00'],
  thursday: ['09:00-12:00'],
  friday: ['09:00-12:00'],
  saturday: [],
  sunday: []
};

const mockUpcomingSessions = [
  {
    id: '1',
    student: 'Jane Mwale',
    topic: 'Academic Support',
    date: '2026-09-07',
    time: '14:00',
    status: 'upcoming'
  },
  {
    id: '2',
    student: 'John Banda',
    topic: 'Career Guidance',
    date: '2026-09-08',
    time: '10:00',
    status: 'upcoming'
  },
  {
    id: '3',
    student: 'Sarah Phiri',
    topic: 'University Life',
    date: '2026-09-10',
    time: '15:00',
    status: 'upcoming'
  }
];

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function MentorSchedulePage() {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newDay, setNewDay] = useState('monday');
  const [newTime, setNewTime] = useState('09:00-12:00');

  const handleAddSlot = () => {
    // Mock add slot
    setShowAddSlot(false);
  };

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Schedule & Availability</h1>
          <button className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors">
            <PlusIcon className="inline h-4 w-4 mr-1" />
            Add Availability
          </button>
        </div>

        {/* Calendar Preview */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Availability</h2>
          <div className="grid grid-cols-7 gap-2 text-center">
            {days.map((day) => (
              <div key={day} className="border border-gray-200 p-2">
                <div className="font-medium text-xs capitalize">{day.slice(0, 3)}</div>
                {mockAvailability[day as keyof typeof mockAvailability].length > 0 ? (
                  mockAvailability[day as keyof typeof mockAvailability].map((slot: string) => (
                    <div key={slot} className="text-xs text-muted-text mt-1">{slot}</div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 mt-1">—</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Availability Slot */}
        {showAddSlot && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold mb-4">Add Availability Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Day</label>
                <select className="input-field" value={newDay} onChange={(e) => setNewDay(e.target.value)}>
                  {days.map((day) => (
                    <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Time</label>
                <select className="input-field" value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                  <option value="09:00-12:00">09:00 - 12:00</option>
                  <option value="12:00-14:00">12:00 - 14:00</option>
                  <option value="14:00-17:00">14:00 - 17:00</option>
                  <option value="17:00-19:00">17:00 - 19:00</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddSlot} className="bg-primary-green text-white px-4 py-2 text-sm hover:bg-deep-green transition-colors">
                Add Slot
              </button>
              <button onClick={() => setShowAddSlot(false)} className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
          {mockUpcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {mockUpcomingSessions.map((session) => (
                <div key={session.id} className="border border-gray-100 p-4 hover:border-primary-green transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <h4 className="font-semibold">{session.student}</h4>
                      <p className="text-sm text-muted-text">{session.topic}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-text">
                        <span> {new Date(session.date).toLocaleDateString()}</span>
                        <span> {session.time}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">Upcoming</span>
                      <button className="text-sm text-primary-green hover:underline">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-text">No upcoming sessions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
