// app/mentor/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function MentorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/mentor" className="text-primary-green hover:underline text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-green hover:underline"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-muted-text">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white border border-gray-200 p-8 text-center">
            <p className="text-muted-text">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors cursor-pointer ${
                  !n.read ? 'border-l-4 border-l-primary-green' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5">{n.type}</span>
                  {!n.read && (
                    <span className="text-xs bg-primary-green text-white px-2 py-0.5">New</span>
                  )}
                </div>
                <h3 className="font-semibold mt-1">{n.title}</h3>
                {n.content && <p className="text-sm text-muted-text">{n.content}</p>}
                <p className="text-xs text-muted-text mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
                {n.link && (
                  <Link
                    href={n.link}
                    className="text-sm text-primary-green hover:underline mt-1 inline-block"
                  >
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
