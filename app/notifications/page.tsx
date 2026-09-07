// app/notifications/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockNotifications = [
  {
    id: '1',
    type: 'mentorship',
    title: 'Mentorship Request Accepted',
    content: 'Jane accepted your mentorship request.',
    read: false,
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'resource',
    title: 'New Resources Added',
    content: 'New resources have been added to Case Management.',
    read: false,
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'announcement',
    title: 'Campus Announcement',
    content: 'Library will be open 24/7 during exam period.',
    read: true,
    time: '1 day ago',
  },
  {
    id: '4',
    type: 'event',
    title: 'Upcoming Event',
    content: 'Career Fair is happening next week.',
    read: true,
    time: '2 days ago',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary-green hover:underline"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`bg-white border border-gray-200 p-4 hover:border-primary-green transition-colors cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-primary-green' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 ${
                        notification.type === 'mentorship' ? 'bg-purple-100 text-purple-700' :
                        notification.type === 'resource' ? 'bg-blue-100 text-blue-700' :
                        notification.type === 'announcement' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {notification.type}
                      </span>
                      {!notification.read && (
                        <span className="text-xs bg-primary-green text-white px-2 py-0.5">New</span>
                      )}
                    </div>
                    <h3 className="font-semibold mt-1">{notification.title}</h3>
                    <p className="text-sm text-muted-text">{notification.content}</p>
                    <p className="text-xs text-muted-text mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 bg-white p-8 text-center">
            <p className="text-muted-text">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
