// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { getNotifications, getUnreadCount } from '@/lib/services/notification.service';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const notifications = await getNotifications(user.id, limit);
    const unreadCount = await getUnreadCount(user.id);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
