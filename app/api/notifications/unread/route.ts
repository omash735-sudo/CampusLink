// app/api/notifications/unread/route.ts
import { NextResponse } from 'next/server';
import { getUnreadCount } from '@/lib/services/notification.service';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    const count = await getUnreadCount(user.id);
    return NextResponse.json({ count });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get unread count' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
