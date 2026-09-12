// lib/db/schema.ts
import { pgTable, text, uuid, timestamp, integer, jsonb, boolean, foreignKey, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== CAMPUSLINK USERS (DEDICATED) ====================
export const campuslinkUsers = pgTable('campuslink_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  username: text('username').unique().notNull(),
  phone: text('phone'),
  avatar: text('avatar'),
  bio: text('bio'),
  role: text('role').default('student').notNull(),
  campus: text('campus'),
  programme: text('programme'),
  year: integer('year'),
  interests: text('interests').array(),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(false),
  lastActive: timestamp('last_active'),
  isMentor: boolean('is_mentor').default(false),
  mentorType: text('mentor_type'),
  mentorStatus: text('mentor_status').default('not_applied'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== FACULTIES ====================
export const faculties = pgTable('faculties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== PROGRAMMES ====================
export const programmes = pgTable('programmes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  code: text('code'),
  description: text('description'),
  faculty: text('faculty'),
  department: text('department'),
  duration: integer('duration'),
  degree: text('degree'),
  campus: text('campus').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== COURSES ====================
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  code: text('code'),
  description: text('description'),
  programmeId: uuid('programme_id').references(() => programmes.id),
  year: integer('year'),
  semester: integer('semester'),
  credits: integer('credits'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== COHORTS ====================
export const cohorts = pgTable('cohorts', {
  id: uuid('id').primaryKey().defaultRandom(),
  programmeId: uuid('programme_id').references(() => programmes.id),
  year: integer('year').notNull(),
  academicYear: text('academic_year').notNull(),
  studentCount: integer('student_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== INTERESTS ====================
export const interests = pgTable('interests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== STUDENT INTERESTS ====================
export const studentInterests = pgTable('student_interests', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => campuslinkUsers.id).notNull(),
  interestId: uuid('interest_id').references(() => interests.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== CONNECTIONS ====================
export const connections = pgTable('connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  requesterId: uuid('requester_id').references(() => campuslinkUsers.id).notNull(),
  receiverId: uuid('receiver_id').references(() => campuslinkUsers.id).notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== MENTORS ====================
export const mentors = pgTable('mentors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).unique().notNull(),
  status: text('status').default('pending').notNull(),
  expertise: text('expertise').array(),
  subjects: text('subjects').array(),
  availability: text('availability').default('available'),
  introduction: text('introduction'),
  experience: text('experience'),
  rating: integer('rating').default(0),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== MENTOR EXPERTISE ====================
export const mentorExpertise = pgTable('mentor_expertise', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorId: uuid('mentor_id').references(() => mentors.id).notNull(),
  name: text('name').notNull(),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== MENTORSHIP REQUESTS ====================
export const mentorshipRequests = pgTable('mentorship_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorId: uuid('mentor_id').references(() => mentors.id).notNull(),
  studentId: uuid('student_id').references(() => campuslinkUsers.id).notNull(),
  status: text('status').default('pending').notNull(),
  message: text('message'),
  introduction: text('introduction'),
  helpNeeded: text('help_needed').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== MENTORSHIPS ====================
export const mentorships = pgTable('mentorships', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorId: uuid('mentor_id').references(() => mentors.id).notNull(),
  studentId: uuid('student_id').references(() => campuslinkUsers.id).notNull(),
  requestId: uuid('request_id').references(() => mentorshipRequests.id),
  status: text('status').default('active').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  lastInteraction: timestamp('last_interaction'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== MENTOR REVIEWS ====================
export const mentorReviews = pgTable('mentor_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorshipId: uuid('mentorship_id').references(() => mentorships.id).notNull(),
  studentId: uuid('student_id').references(() => campuslinkUsers.id).notNull(),
  rating: integer('rating'),
  review: text('review'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== RESOURCE CATEGORIES ====================
export const resourceCategories = pgTable('resource_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== RESOURCES ====================
export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  programmeId: uuid('programme_id').references(() => programmes.id),
  courseId: uuid('course_id').references(() => courses.id),
  year: integer('year'),
  semester: text('semester'),
  academicYear: text('academic_year'),
  course: text('course'),
  uploadedBy: uuid('uploaded_by').references(() => campuslinkUsers.id).notNull(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  downloads: integer('downloads').default(0),
  viewCount: integer('view_count').default(0),
  status: text('status').default('pending').notNull(),
  isVerified: boolean('is_verified').default(false),
  verifiedBy: uuid('verified_by').references(() => campuslinkUsers.id),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== SAVED RESOURCES ====================
export const savedResources = pgTable('saved_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).notNull(),
  resourceId: uuid('resource_id').references(() => resources.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== RESOURCE DOWNLOADS ====================
export const resourceDownloads = pgTable('resource_downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).notNull(),
  resourceId: uuid('resource_id').references(() => resources.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== RESOURCE VIEWS ====================
export const resourceViews = pgTable('resource_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => campuslinkUsers.id),
  resourceId: uuid('resource_id').references(() => resources.id).notNull(),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});

// ==================== RESOURCE REPORTS ====================
export const resourceReports = pgTable('resource_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  resourceId: uuid('resource_id').references(() => resources.id).notNull(),
  reporterId: uuid('reporter_id').references(() => campuslinkUsers.id).notNull(),
  reason: text('reason').notNull(),
  description: text('description'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== POSTS ====================
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title'),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => campuslinkUsers.id).notNull(),
  type: text('type').default('post').notNull(),
  visibility: text('visibility').default('public').notNull(),
  status: text('status').default('published').notNull(),
  likes: integer('likes').default(0),
  commentCount: integer('comment_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== COMMENTS ====================
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => posts.id).notNull(),
  authorId: uuid('author_id').references(() => campuslinkUsers.id).notNull(),
  content: text('content').notNull(),
  parentId: uuid('parent_id'),
  likes: integer('likes').default(0),
  status: text('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== GROUPS ====================
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  type: text('type').default('open').notNull(),
  category: text('category'),
  whatsappLink: text('whatsapp_link'),
  avatar: text('avatar'),
  cover: text('cover'),
  memberCount: integer('member_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== GROUP MEMBERS ====================
export const groupMembers = pgTable('group_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => groups.id).notNull(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).notNull(),
  role: text('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// ==================== USER COMMUNITIES ====================
export const userCommunities = pgTable('user_communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).notNull(),
  communityId: uuid('community_id').references(() => groups.id).notNull(),
  role: text('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// ==================== EVENTS ====================
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  location: text('location'),
  organizer: text('organizer'),
  image: text('image'),
  category: text('category'),
  maxAttendees: integer('max_attendees'),
  status: text('status').default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== EVENT ATTENDEES ====================
export const eventAttendees = pgTable('event_attendees', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).notNull(),
  status: text('status').default('registered').notNull(),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
});

// ==================== OPPORTUNITIES ====================
export const opportunities = pgTable('opportunities', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  organization: text('organization').notNull(),
  category: text('category').notNull(),
  eligibility: text('eligibility'),
  deadline: timestamp('deadline'),
  applicationUrl: text('application_url'),
  contact: text('contact'),
  status: text('status').default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== ANNOUNCEMENTS ====================
export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => campuslinkUsers.id).notNull(),
  type: text('type').default('general').notNull(),
  priority: text('priority').default('normal').notNull(),
  isPublished: boolean('is_published').default(false),
  imageUrl: text('image_url'),
  publishedAt: timestamp('published_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== CONVERSATIONS ====================
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  isGroup: boolean('is_group').default(false),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const conversationMembers = pgTable('conversation_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).notNull(),
  lastRead: timestamp('last_read'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  senderId: uuid('sender_id').references(() => campuslinkUsers.id).notNull(),
  content: text('content').notNull(),
  type: text('type').default('text').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== NOTIFICATIONS ====================
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => campuslinkUsers.id).notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content'),
  link: text('link'),
  metadata: jsonb('metadata'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== REPORTS ====================
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: uuid('reporter_id').references(() => campuslinkUsers.id).notNull(),
  targetType: text('target_type').notNull(),
  targetId: uuid('target_id').notNull(),
  reason: text('reason').notNull(),
  description: text('description'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== FEEDBACK ====================
export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => campuslinkUsers.id),
  content: text('content').notNull(),
  category: text('category').default('general'),
  status: text('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== AUDIT LOGS ====================
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => campuslinkUsers.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: uuid('entity_id'),
  previousValue: jsonb('previous_value'),
  newValue: jsonb('new_value'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== CAMPUS LOCATIONS ====================
export const campusLocations = pgTable('campus_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  category: text('category').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  address: text('address'),
  coordinates: jsonb('coordinates'),
  openingHours: text('opening_hours'),
  contactInfo: text('contact_info'),
  accessibilityInfo: text('accessibility_info'),
  imageUrl: text('image_url'),
  galleryImages: text('gallery_images').array(),
  isFeatured: boolean('is_featured').default(false),
  isPublished: boolean('is_published').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campusLocationNearby = pgTable('campus_location_nearby', {
  id: uuid('id').primaryKey().defaultRandom(),
  locationId: uuid('location_id').references(() => campusLocations.id).notNull(),
  nearbyLocationId: uuid('nearby_location_id').references(() => campusLocations.id).notNull(),
  distance: text('distance'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const campusTimeline = pgTable('campus_timeline', {
  id: uuid('id').primaryKey().defaultRandom(),
  year: integer('year').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  source: text('source'),
  isPublished: boolean('is_published').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campusGallery = pgTable('campus_gallery', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title'),
  imageUrl: text('image_url').notNull(),
  category: text('category'),
  description: text('description'),
  locationId: uuid('location_id').references(() => campusLocations.id),
  isPublished: boolean('is_published').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== RELATIONS ====================
export const campuslinkUsersRelations = relations(campuslinkUsers, ({ many }) => ({
  mentors: many(mentors),
  resources: many(resources),
  posts: many(posts),
  comments: many(comments),
  groupMembers: many(groupMembers),
  eventAttendees: many(eventAttendees),
  conversations: many(conversationMembers),
  notifications: many(notifications),
  announcements: many(announcements),
  sentConnections: many(connections, { relationName: 'sentConnections' }),
  receivedConnections: many(connections, { relationName: 'receivedConnections' }),
  interests: many(studentInterests),
  communities: many(userCommunities),
  mentorshipRequests: many(mentorshipRequests, { relationName: 'studentRequests' }),
  receivedMentorshipRequests: many(mentorshipRequests, { relationName: 'mentorRequests' }),
  mentorships: many(mentorships, { relationName: 'studentMentorships' }),
  mentorMentorships: many(mentorships, { relationName: 'mentorMentorships' }),
  mentorReviews: many(mentorReviews),
  savedResources: many(savedResources),
  resourceDownloads: many(resourceDownloads),
  resourceViews: many(resourceViews),
  resourceReports: many(resourceReports),
  auditLogs: many(auditLogs),
  feedback: many(feedback),
}));

export const programmesRelations = relations(programmes, ({ many }) => ({
  cohorts: many(cohorts),
  resources: many(resources),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  programme: one(programmes, {
    fields: [courses.programmeId],
    references: [programmes.id],
  }),
  resources: many(resources),
}));

export const cohortsRelations = relations(cohorts, ({ one }) => ({
  programme: one(programmes, {
    fields: [cohorts.programmeId],
    references: [programmes.id],
  }),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  requester: one(campuslinkUsers, {
    fields: [connections.requesterId],
    references: [campuslinkUsers.id],
    relationName: 'sentConnections',
  }),
  receiver: one(campuslinkUsers, {
    fields: [connections.receiverId],
    references: [campuslinkUsers.id],
    relationName: 'receivedConnections',
  }),
}));

export const studentInterestsRelations = relations(studentInterests, ({ one }) => ({
  student: one(campuslinkUsers, {
    fields: [studentInterests.studentId],
    references: [campuslinkUsers.id],
  }),
  interest: one(interests, {
    fields: [studentInterests.interestId],
    references: [interests.id],
  }),
}));

export const userCommunitiesRelations = relations(userCommunities, ({ one }) => ({
  user: one(campuslinkUsers, {
    fields: [userCommunities.userId],
    references: [campuslinkUsers.id],
  }),
  community: one(groups, {
    fields: [userCommunities.communityId],
    references: [groups.id],
  }),
}));

export const mentorsRelations = relations(mentors, ({ one, many }) => ({
  user: one(campuslinkUsers, {
    fields: [mentors.userId],
    references: [campuslinkUsers.id],
  }),
  expertise: many(mentorExpertise),
  requests: many(mentorshipRequests, { relationName: 'mentorRequests' }),
  mentorships: many(mentorships, { relationName: 'mentorMentorships' }),
}));

export const mentorExpertiseRelations = relations(mentorExpertise, ({ one }) => ({
  mentor: one(mentors, {
    fields: [mentorExpertise.mentorId],
    references: [mentors.id],
  }),
}));

export const mentorshipRequestsRelations = relations(mentorshipRequests, ({ one }) => ({
  mentor: one(mentors, {
    fields: [mentorshipRequests.mentorId],
    references: [mentors.id],
    relationName: 'mentorRequests',
  }),
  student: one(campuslinkUsers, {
    fields: [mentorshipRequests.studentId],
    references: [campuslinkUsers.id],
    relationName: 'studentRequests',
  }),
}));

export const mentorshipsRelations = relations(mentorships, ({ one, many }) => ({
  mentor: one(mentors, {
    fields: [mentorships.mentorId],
    references: [mentors.id],
    relationName: 'mentorMentorships',
  }),
  student: one(campuslinkUsers, {
    fields: [mentorships.studentId],
    references: [campuslinkUsers.id],
    relationName: 'studentMentorships',
  }),
  request: one(mentorshipRequests, {
    fields: [mentorships.requestId],
    references: [mentorshipRequests.id],
  }),
  reviews: many(mentorReviews),
}));

export const mentorReviewsRelations = relations(mentorReviews, ({ one }) => ({
  mentorship: one(mentorships, {
    fields: [mentorReviews.mentorshipId],
    references: [mentorships.id],
  }),
  student: one(campuslinkUsers, {
    fields: [mentorReviews.studentId],
    references: [campuslinkUsers.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  programme: one(programmes, {
    fields: [resources.programmeId],
    references: [programmes.id],
  }),
  course: one(courses, {
    fields: [resources.courseId],
    references: [courses.id],
  }),
  uploader: one(campuslinkUsers, {
    fields: [resources.uploadedBy],
    references: [campuslinkUsers.id],
  }),
  savedBy: many(savedResources),
  downloads: many(resourceDownloads),
  views: many(resourceViews),
  reports: many(resourceReports),
}));

export const savedResourcesRelations = relations(savedResources, ({ one }) => ({
  user: one(campuslinkUsers, {
    fields: [savedResources.userId],
    references: [campuslinkUsers.id],
  }),
  resource: one(resources, {
    fields: [savedResources.resourceId],
    references: [resources.id],
  }),
}));

export const resourceDownloadsRelations = relations(resourceDownloads, ({ one }) => ({
  user: one(campuslinkUsers, {
    fields: [resourceDownloads.userId],
    references: [campuslinkUsers.id],
  }),
  resource: one(resources, {
    fields: [resourceDownloads.resourceId],
    references: [resources.id],
  }),
}));

export const resourceViewsRelations = relations(resourceViews, ({ one }) => ({
  user: one(campuslinkUsers, {
    fields: [resourceViews.userId],
    references: [campuslinkUsers.id],
  }),
  resource: one(resources, {
    fields: [resourceViews.resourceId],
    references: [resources.id],
  }),
}));

export const resourceReportsRelations = relations(resourceReports, ({ one }) => ({
  resource: one(resources, {
    fields: [resourceReports.resourceId],
    references: [resources.id],
  }),
  reporter: one(campuslinkUsers, {
    fields: [resourceReports.reporterId],
    references: [campuslinkUsers.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(campuslinkUsers, {
    fields: [posts.authorId],
    references: [campuslinkUsers.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(campuslinkUsers, {
    fields: [comments.authorId],
    references: [campuslinkUsers.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(campuslinkUsers, {
    fields: [groupMembers.userId],
    references: [campuslinkUsers.id],
  }),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(campuslinkUsers, {
    fields: [eventAttendees.userId],
    references: [campuslinkUsers.id],
  }),
}));

export const conversationMembersRelations = relations(conversationMembers, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationMembers.conversationId],
    references: [conversations.id],
  }),
  user: one(campuslinkUsers, {
    fields: [conversationMembers.userId],
    references: [campuslinkUsers.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(campuslinkUsers, {
    fields: [messages.senderId],
    references: [campuslinkUsers.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(campuslinkUsers, {
    fields: [announcements.authorId],
    references: [campuslinkUsers.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(campuslinkUsers, {
    fields: [auditLogs.adminId],
    references: [campuslinkUsers.id],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(campuslinkUsers, {
    fields: [feedback.userId],
    references: [campuslinkUsers.id],
  }),
}));

export const campusLocationsRelations = relations(campusLocations, ({ many }) => ({
  nearby: many(campusLocationNearby, { relationName: 'locationNearby' }),
  nearbyOf: many(campusLocationNearby, { relationName: 'nearbyLocation' }),
  gallery: many(campusGallery),
}));

export const campusLocationNearbyRelations = relations(campusLocationNearby, ({ one }) => ({
  location: one(campusLocations, {
    fields: [campusLocationNearby.locationId],
    references: [campusLocations.id],
    relationName: 'locationNearby',
  }),
  nearbyLocation: one(campusLocations, {
    fields: [campusLocationNearby.nearbyLocationId],
    references: [campusLocations.id],
    relationName: 'nearbyLocation',
  }),
}));

export const campusGalleryRelations = relations(campusGallery, ({ one }) => ({
  location: one(campusLocations, {
    fields: [campusGallery.locationId],
    references: [campusLocations.id],
  }),
}));
