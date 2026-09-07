// lib/services/notification.service.ts
import { db } from '@/lib/db';
import { notifications, campuslinkUsers } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

interface NotificationData {
  userId: string;
  type: string;
  title: string;
  content?: string;
  link?: string;
  metadata?: any;
}

export async function createNotification(data: NotificationData) {
  const [notification] = await db.insert(notifications)
    .values({
      userId: data.userId,
      type: data.type,
      title: data.title,
      content: data.content || '',
      link: data.link || '',
      metadata: data.metadata || null,
      read: false,
    })
    .returning();
  return notification;
}

export async function getNotifications(userId: string, limit: number = 20) {
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(userId: string) {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.read, false)
    ));
  return result[0]?.count || 0;
}

export async function markNotificationAsRead(id: string, userId: string) {
  const [updated] = await db
    .update(notifications)
    .set({ read: true })
    .where(and(
      eq(notifications.id, id),
      eq(notifications.userId, userId)
    ))
    .returning();
  return updated;
}

export async function markAllNotificationsAsRead(userId: string) {
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, userId));
}

export async function deleteNotification(id: string, userId: string) {
  await db
    .delete(notifications)
    .where(and(
      eq(notifications.id, id),
      eq(notifications.userId, userId)
    ));
}

// ==================== NOTIFICATION HELPERS ====================

export async function notifyMentorApplicationSubmitted(adminId: string, applicantId: string, applicantName: string) {
  await createNotification({
    userId: adminId,
    type: 'mentor_application',
    title: 'New Mentor Application',
    content: `${applicantName} has applied to become a mentor.`,
    link: '/admin/mentors/applications',
    metadata: { applicantId },
  });
}

export async function notifyMentorApplicationApproved(userId: string, mentorName: string) {
  await createNotification({
    userId,
    type: 'mentor_approved',
    title: 'Mentor Application Approved!',
    content: `Congratulations! Your mentor application has been approved. You can now access the mentor dashboard.`,
    link: '/mentor',
    metadata: { mentorName },
  });
}

export async function notifyMentorApplicationRejected(userId: string, reason?: string) {
  await createNotification({
    userId,
    type: 'mentor_rejected',
    title: 'Mentor Application Update',
    content: reason ? `Your mentor application was rejected. Reason: ${reason}` : 'Your mentor application was rejected.',
    link: '/student/dashboard',
  });
}

export async function notifyMentorshipRequestReceived(mentorId: string, studentId: string, studentName: string) {
  await createNotification({
    userId: mentorId,
    type: 'mentorship_request',
    title: 'New Mentorship Request',
    content: `${studentName} has requested mentorship from you.`,
    link: '/mentor/requests',
    metadata: { studentId },
  });
}

export async function notifyMentorshipRequestAccepted(studentId: string, mentorName: string) {
  await createNotification({
    userId: studentId,
    type: 'mentorship_accepted',
    title: 'Mentorship Request Accepted!',
    content: `${mentorName} has accepted your mentorship request.`,
    link: '/student/dashboard',
    metadata: { mentorName },
  });
}

export async function notifyMentorshipRequestDeclined(studentId: string, mentorName: string) {
  await createNotification({
    userId: studentId,
    type: 'mentorship_declined',
    title: 'Mentorship Request Update',
    content: `${mentorName} has declined your mentorship request.`,
    link: '/student/dashboard',
    metadata: { mentorName },
  });
}

export async function notifyNewAnnouncement(userId: string, announcementTitle: string, announcementId: string) {
  await createNotification({
    userId,
    type: 'announcement',
    title: 'New Announcement',
    content: announcementTitle,
    link: `/announcements/${announcementId}`,
  });
}

export async function notifyNewEvent(userId: string, eventTitle: string, eventId: string) {
  await createNotification({
    userId,
    type: 'event',
    title: 'New Event',
    content: eventTitle,
    link: `/events/${eventId}`,
  });
}

export async function notifyNewResource(userId: string, resourceTitle: string, resourceId: string) {
  await createNotification({
    userId,
    type: 'resource',
    title: 'New Resource Available',
    content: resourceTitle,
    link: `/resources/${resourceId}`,
  });
}
