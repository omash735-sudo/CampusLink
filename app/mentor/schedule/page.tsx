// app/mentor/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Slot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export default function MentorSchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const res = await fetch('/api/mentors/availability');
      if (res.ok) {
        const data = await res.json();
        setSlots(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSlot = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/mentors/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      await loadSlots();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeSlot = async (id: string) => {
    if (!confirm('Remove this availability slot?')) return;
    try {
      await fetch(`/api/mentors/availability?id=${id}`, { method: 'DELETE' });
      await loadSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const slotsByDay = DAYS.map((_, i) => slots.filter((s) => s.dayOfWeek === i));

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Schedule & Availability</h1>
          <Link href="/mentor" className="text-primary-green hover:underline text-sm">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="label-text">Day</label>
              <select
                className="input-field"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
              >
                {DAYS.map((d, i) => (
                  <option key={d} value={i}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Start Time</label>
              <input
                type="time"
                className="input-field"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="label-text">End Time</label>
              <input
                type="time"
                className="input-field"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <button
              onClick={addSlot}
              disabled={saving}
              className="bg-primary-green text-white px-4 py-2 font-medium hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Slot'}
            </button>
          </div>
          {error && (
            <div className="border border-red-400 bg-red-50 p-3 text-sm text-red-700 mt-4">
              {error}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Your Weekly Availability</h2>
          {loading ? (
            <p className="text-muted-text">Loading...</p>
          ) : (
            <div className="space-y-4">
              {DAYS.map((day, i) => (
                <div key={day} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-24 font-medium text-sm">{day}</div>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {slotsByDay[i].length === 0 ? (
                        <span className="text-xs text-muted-text italic">Not available</span>
                      ) : (
                        slotsByDay[i].map((slot) => (
                          <span
                            key={slot.id}
                            className="text-xs bg-primary-green/10 text-primary-green px-3 py-1 flex items-center gap-2"
                          >
                            {slot.startTime} – {slot.endTime}
                            <button
                              onClick={() => removeSlot(slot.id)}
                              className="text-primary-green hover:text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
