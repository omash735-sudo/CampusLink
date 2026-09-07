// app/api/notifications/read-all/route.ts
import { NextResponse } from 'next/server';
import { markAllNotificationsAsRead } from '@/lib/services/notification.service';
import { requireAuth } from '@/lib/auth';

export async function POST() {
  try {
    const user = await requireAuth();
    await markAllNotificationsAsRead(user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to mark all as read' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
