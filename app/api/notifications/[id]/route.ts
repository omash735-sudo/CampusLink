// app/api/notifications/[id]/route.ts
import { NextResponse } from 'next/server';
import { markNotificationAsRead, deleteNotification } from '@/lib/services/notification.service';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const notification = await markNotificationAsRead(params.id, user.id);
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ notification });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to mark notification as read' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    await deleteNotification(params.id, user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete notification' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
