// app/admin/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
import { getEvents, publishEvent, deleteEvent } from '@/lib/services/admin.service';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  location: string;
  category: string;
  status: string;
  createdAt: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data as Event[]);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm('Publish this event?')) return;
    try {
      await publishEvent(id);
      await loadEvents();
    } catch (error) {
      console.error('Failed to publish:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 p-4">
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-gray-500">{events.length} total events</p>
        </div>
        <Link href="/admin/events/new" className="bg-primary-green text-white px-4 py-2 text-sm font-medium hover:bg-deep-green transition-colors flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Event
        </Link>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{event.title}</h3>
                  <span className={`text-xs px-2 py-0.5 ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{event.category || 'No category'} • {event.location}</p>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} at {event.startTime}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link href={`/admin/events/${event.id}`} className="text-primary-green hover:underline text-sm">
                  Edit
                </Link>
                {event.status === 'draft' && (
                  <button onClick={() => handlePublish(event.id)} className="text-sm text-green-600 hover:text-green-700">
                    Publish
                  </button>
                )}
                <button onClick={() => handleDelete(event.id)} className="text-sm text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No events found.</p>
        </div>
      )}
    </div>
  );
}
