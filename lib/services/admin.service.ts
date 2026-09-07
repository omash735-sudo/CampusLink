// lib/services/admin.service.ts
import { db } from '@/lib/db';
import { 
  campuslinkUsers, 
  programmes, 
  courses, 
  mentors, 
  mentorshipRequests, 
  mentorships,
  resources,
  events,
  announcements,
  campusLocations,
  reports,
  feedback,
  auditLogs,
  faculties,
  cohorts,
  interests,
  studentInterests,
  connections,
  mentorExpertise,
  mentorReviews,
  savedResources,
  resourceDownloads,
  resourceViews,
  resourceReports,
  groups,
  groupMembers,
  userCommunities,
  notifications,
  conversations,
  conversationMembers,
  messages,
  campusLocationNearby,
  campusTimeline,
  campusGallery
} from '@/lib/db/schema';
import { eq, desc, asc, and, or, like, count, sql } from 'drizzle-orm';

// ==================== USERS ====================
export async function getUsers() {
  return await db.select().from(campuslinkUsers).orderBy(desc(campuslinkUsers.createdAt));
}

export async function getUserById(id: string) {
  return await db.select().from(campuslinkUsers).where(eq(campuslinkUsers.id, id)).then(res => res[0]);
}

export async function getUserByEmail(email: string) {
  return await db.select().from(campuslinkUsers).where(eq(campuslinkUsers.email, email)).then(res => res[0]);
}

export async function getUserByUsername(username: string) {
  return await db.select().from(campuslinkUsers).where(eq(campuslinkUsers.username, username)).then(res => res[0]);
}

export async function createUser(data: any) {
  const [user] = await db.insert(campuslinkUsers).values(data).returning();
  return user;
}

export async function updateUser(id: string, data: any) {
  const [updated] = await db.update(campuslinkUsers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(campuslinkUsers.id, id))
    .returning();
  return updated;
}

export async function deleteUser(id: string) {
  await db.delete(campuslinkUsers).where(eq(campuslinkUsers.id, id));
}

export async function getUserStats() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(campuslinkUsers);
  const active = await db.select({ count: sql<number>`count(*)` }).from(campuslinkUsers).where(eq(campuslinkUsers.isActive, true));
  const mentors = await db.select({ count: sql<number>`count(*)` }).from(campuslinkUsers).where(eq(campuslinkUsers.isMentor, true));
  const pendingMentors = await db.select({ count: sql<number>`count(*)` }).from(campuslinkUsers).where(eq(campuslinkUsers.mentorStatus, 'pending'));
  
  return {
    total: total[0]?.count || 0,
    active: active[0]?.count || 0,
    mentors: mentors[0]?.count || 0,
    pendingMentors: pendingMentors[0]?.count || 0,
  };
}

// ==================== PROGRAMMES ====================
export async function getProgrammes() {
  return await db.select().from(programmes).where(eq(programmes.isActive, true)).orderBy(programmes.name);
}

export async function getProgrammeById(id: string) {
  return await db.select().from(programmes).where(eq(programmes.id, id)).then(res => res[0]);
}

export async function createProgramme(data: any) {
  const [programme] = await db.insert(programmes).values(data).returning();
  return programme;
}

export async function updateProgramme(id: string, data: any) {
  const [updated] = await db.update(programmes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(programmes.id, id))
    .returning();
  return updated;
}

export async function deleteProgramme(id: string) {
  await db.delete(programmes).where(eq(programmes.id, id));
}

// ==================== COURSES ====================
export async function getCourses() {
  return await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(courses.name);
}

export async function getCourseById(id: string) {
  return await db.select().from(courses).where(eq(courses.id, id)).then(res => res[0]);
}

export async function createCourse(data: any) {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function updateCourse(id: string, data: any) {
  const [updated] = await db.update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();
  return updated;
}

export async function deleteCourse(id: string) {
  await db.delete(courses).where(eq(courses.id, id));
}

// ==================== MENTORS ====================
export async function getMentors() {
  return await db.select().from(mentors).orderBy(desc(mentors.createdAt));
}

export async function getMentorById(id: string) {
  return await db.select().from(mentors).where(eq(mentors.id, id)).then(res => res[0]);
}

export async function getMentorByUserId(userId: string) {
  return await db.select().from(mentors).where(eq(mentors.userId, userId)).then(res => res[0]);
}

export async function createMentor(data: any) {
  const [mentor] = await db.insert(mentors).values(data).returning();
  return mentor;
}

export async function updateMentor(id: string, data: any) {
  const [updated] = await db.update(mentors)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(mentors.id, id))
    .returning();
  return updated;
}

export async function deleteMentor(id: string) {
  await db.delete(mentors).where(eq(mentors.id, id));
}

export async function getMentorStats() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(mentors);
  const approved = await db.select({ count: sql<number>`count(*)` }).from(mentors).where(eq(mentors.status, 'approved'));
  const pending = await db.select({ count: sql<number>`count(*)` }).from(mentors).where(eq(mentors.status, 'pending'));
  const rejected = await db.select({ count: sql<number>`count(*)` }).from(mentors).where(eq(mentors.status, 'rejected'));
  
  return {
    total: total[0]?.count || 0,
    approved: approved[0]?.count || 0,
    pending: pending[0]?.count || 0,
    rejected: rejected[0]?.count || 0,
  };
}

// ==================== MENTOR APPLICATIONS ====================
export async function getMentorApplications() {
  return await db.select().from(campuslinkUsers).where(eq(campuslinkUsers.mentorStatus, 'pending')).orderBy(desc(campuslinkUsers.createdAt));
}

export async function getMentorApplicationById(id: string) {
  return await db.select().from(campuslinkUsers).where(eq(campuslinkUsers.id, id)).then(res => res[0]);
}

export async function approveMentorApplication(id: string) {
  const [updated] = await db.update(campuslinkUsers)
    .set({ 
      isMentor: true, 
      mentorStatus: 'approved',
      updatedAt: new Date()
    })
    .where(eq(campuslinkUsers.id, id))
    .returning();
  return updated;
}

export async function rejectMentorApplication(id: string) {
  const [updated] = await db.update(campuslinkUsers)
    .set({ 
      mentorStatus: 'rejected',
      updatedAt: new Date()
    })
    .where(eq(campuslinkUsers.id, id))
    .returning();
  return updated;
}

// ==================== MENTORSHIPS ====================
export async function getMentorships() {
  return await db.select().from(mentorships).orderBy(desc(mentorships.createdAt));
}

export async function getMentorshipById(id: string) {
  return await db.select().from(mentorships).where(eq(mentorships.id, id)).then(res => res[0]);
}

export async function createMentorship(data: any) {
  const [mentorship] = await db.insert(mentorships).values(data).returning();
  return mentorship;
}

export async function updateMentorship(id: string, data: any) {
  const [updated] = await db.update(mentorships)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(mentorships.id, id))
    .returning();
  return updated;
}

export async function deleteMentorship(id: string) {
  await db.delete(mentorships).where(eq(mentorships.id, id));
}

export async function getMentorshipStats() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(mentorships);
  const active = await db.select({ count: sql<number>`count(*)` }).from(mentorships).where(eq(mentorships.status, 'active'));
  const pending = await db.select({ count: sql<number>`count(*)` }).from(mentorships).where(eq(mentorships.status, 'pending'));
  const completed = await db.select({ count: sql<number>`count(*)` }).from(mentorships).where(eq(mentorships.status, 'completed'));
  
  return {
    total: total[0]?.count || 0,
    active: active[0]?.count || 0,
    pending: pending[0]?.count || 0,
    completed: completed[0]?.count || 0,
  };
}

// ==================== RESOURCES ====================
export async function getResources() {
  return await db.select().from(resources).orderBy(desc(resources.createdAt));
}

export async function getResourceById(id: string) {
  return await db.select().from(resources).where(eq(resources.id, id)).then(res => res[0]);
}

export async function createResource(data: any) {
  const [resource] = await db.insert(resources).values(data).returning();
  return resource;
}

export async function updateResource(id: string, data: any) {
  const [updated] = await db.update(resources)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning();
  return updated;
}

export async function deleteResource(id: string) {
  await db.delete(resources).where(eq(resources.id, id));
}

export async function approveResource(id: string) {
  const [updated] = await db.update(resources)
    .set({ status: 'approved', isVerified: true, updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning();
  return updated;
}

export async function rejectResource(id: string) {
  const [updated] = await db.update(resources)
    .set({ status: 'rejected', updatedAt: new Date() })
    .where(eq(resources.id, id))
    .returning();
  return updated;
}

export async function getResourceStats() {
  const total = await db.select({ count: sql<number>`count(*)` }).from(resources);
  const approved = await db.select({ count: sql<number>`count(*)` }).from(resources).where(eq(resources.status, 'approved'));
  const pending = await db.select({ count: sql<number>`count(*)` }).from(resources).where(eq(resources.status, 'pending'));
  const rejected = await db.select({ count: sql<number>`count(*)` }).from(resources).where(eq(resources.status, 'rejected'));
  
  return {
    total: total[0]?.count || 0,
    approved: approved[0]?.count || 0,
    pending: pending[0]?.count || 0,
    rejected: rejected[0]?.count || 0,
  };
}

// ==================== EVENTS ====================
export async function getEvents() {
  return await db.select().from(events).orderBy(desc(events.createdAt));
}

export async function getEventById(id: string) {
  return await db.select().from(events).where(eq(events.id, id)).then(res => res[0]);
}

export async function createEvent(data: any) {
  const [event] = await db.insert(events).values(data).returning();
  return event;
}

export async function updateEvent(id: string, data: any) {
  const [updated] = await db.update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();
  return updated;
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id));
}

export async function publishEvent(id: string) {
  const [updated] = await db.update(events)
    .set({ status: 'published', updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();
  return updated;
}

// ==================== ANNOUNCEMENTS ====================
export async function getAnnouncements() {
  return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
}

export async function getAnnouncementById(id: string) {
  return await db.select().from(announcements).where(eq(announcements.id, id)).then(res => res[0]);
}

export async function createAnnouncement(data: any) {
  const [announcement] = await db.insert(announcements).values(data).returning();
  return announcement;
}

export async function updateAnnouncement(id: string, data: any) {
  const [updated] = await db.update(announcements)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(announcements.id, id))
    .returning();
  return updated;
}

export async function deleteAnnouncement(id: string) {
  await db.delete(announcements).where(eq(announcements.id, id));
}

export async function publishAnnouncement(id: string) {
  const [updated] = await db.update(announcements)
    .set({ isPublished: true, publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(announcements.id, id))
    .returning();
  return updated;
}

// ==================== REPORTS ====================
export async function getReports() {
  return await db.select().from(reports).orderBy(desc(reports.createdAt));
}

export async function getReportById(id: string) {
  return await db.select().from(reports).where(eq(reports.id, id)).then(res => res[0]);
}

export async function createReport(data: any) {
  const [report] = await db.insert(reports).values(data).returning();
  return report;
}

export async function updateReport(id: string, data: any) {
  const [updated] = await db.update(reports)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(reports.id, id))
    .returning();
  return updated;
}

export async function resolveReport(id: string) {
  const [updated] = await db.update(reports)
    .set({ status: 'resolved', updatedAt: new Date() })
    .where(eq(reports.id, id))
    .returning();
  return updated;
}

// ==================== DASHBOARD STATS ====================
export async function getDashboardStats() {
  const userStats = await getUserStats();
  const mentorStats = await getMentorStats();
  const mentorshipStats = await getMentorshipStats();
  const resourceStats = await getResourceStats();
  
  const eventCount = await db.select({ count: sql<number>`count(*)` }).from(events).where(eq(events.status, 'published'));
  const announcementCount = await db.select({ count: sql<number>`count(*)` }).from(announcements).where(eq(announcements.isPublished, true));
  const reportCount = await db.select({ count: sql<number>`count(*)` }).from(reports).where(eq(reports.status, 'pending'));
  
  return {
    users: userStats,
    mentors: mentorStats,
    mentorships: mentorshipStats,
    resources: resourceStats,
    events: eventCount[0]?.count || 0,
    announcements: announcementCount[0]?.count || 0,
    reports: reportCount[0]?.count || 0,
  };
}

// ==================== CAMPUS LOCATIONS ====================
export async function getCampusLocations() {
  return await db.select().from(campusLocations).orderBy(campusLocations.name);
}

export async function getCampusLocationById(id: string) {
  return await db.select().from(campusLocations).where(eq(campusLocations.id, id)).then(res => res[0]);
}

export async function createCampusLocation(data: any) {
  const [location] = await db.insert(campusLocations).values(data).returning();
  return location;
}

export async function updateCampusLocation(id: string, data: any) {
  const [updated] = await db.update(campusLocations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(campusLocations.id, id))
    .returning();
  return updated;
}

export async function deleteCampusLocation(id: string) {
  await db.delete(campusLocations).where(eq(campusLocations.id, id));
}
