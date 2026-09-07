// components/NotificationBell.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon } from '@/components/icons';

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/notifications/unread');
      const data = await res.json();
      if (res.ok) {
        setCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-5 w-5 bg-gray-200 animate-pulse rounded"></div>;
  }

  return (
    <Link href="/notifications" className="relative p-2 border border-gray-200 hover:border-primary-green transition-colors">
      <BellIcon className="h-5 w-5 text-muted-text" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
