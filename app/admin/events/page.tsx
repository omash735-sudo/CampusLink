// app/admin/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminEvents() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchEvents();
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Events</h1>
          <button
            onClick={() => router.push('/admin/events/new')}
            className="bg-primary-green text-white px-6 py-2 font-medium hover:bg-deep-green transition-colors"
          >
            New Event
          </button>
        </div>

        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-left">
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: any) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-off-white">
                  <td className="p-4">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-12 h-12 object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{event.title}</td>
                  <td className="p-4 text-sm text-muted-text capitalize">{event.category}</td>
                  <td className="p-4 text-sm text-muted-text">
                    {new Date(event.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`text-sm ${event.status === 'published' ? 'text-green-600' : 'text-muted-text'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => router.push(`/admin/events/${event.id}`)}
                      className="text-primary-green hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
