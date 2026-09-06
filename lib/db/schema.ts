// lib/db/schema.ts
import { pgTable, text, uuid, timestamp, integer, jsonb, boolean, foreignKey, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash'),
  fullName: text('full_name').notNull(),
  username: text('username').unique().notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  role: text('role').default('student').notNull(),
  campus: text('campus'),
  programme: text('programme'),
  year: integer('year'),
  interests: text('interests').array(),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  lastActive: timestamp('last_active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== NEW: FACULTIES ====================
export const faculties = pgTable('faculties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Programmes
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

// Cohorts
export const cohorts = pgTable('cohorts', {
  id: uuid('id').primaryKey().defaultRandom(),
  programmeId: uuid('programme_id').references(() => programmes.id),
  year: integer('year').notNull(),
  academicYear: text('academic_year').notNull(),
  studentCount: integer('student_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== NEW: INTERESTS ====================
export const interests = pgTable('interests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== NEW: STUDENT INTERESTS ====================
export const studentInterests = pgTable('student_interests', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').references(() => users.id).notNull(),
  interestId: uuid('interest_id').references(() => interests.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== NEW: CONNECTIONS ====================
export const connections = pgTable('connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  requesterId: uuid('requester_id').references(() => users.id).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id).notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Mentors
export const mentors = pgTable('mentors', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).unique().notNull(),
  status: text('status').default('pending').notNull(),
  expertise: text('expertise').array(),
  subjects: text('subjects').array(),
  availability: jsonb('availability'),
  introduction: text('introduction'),
  experience: text('experience'),
  rating: integer('rating').default(0),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Resources
export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  programmeId: uuid('programme_id').references(() => programmes.id),
  year: integer('year'),
  course: text('course'),
  uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  downloads: integer('downloads').default(0),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Posts
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title'),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  type: text('type').default('post').notNull(),
  visibility: text('visibility').default('public').notNull(),
  status: text('status').default('published').notNull(),
  likes: integer('likes').default(0),
  commentCount: integer('comment_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Comments - Fixed circular reference
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => posts.id).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  parentId: uuid('parent_id'),
  likes: integer('likes').default(0),
  status: text('status').default('published').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Groups
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  type: text('type').default('open').notNull(),
  category: text('category'),
  avatar: text('avatar'),
  cover: text('cover'),
  memberCount: integer('member_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Group Members
export const groupMembers = pgTable('group_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id').references(() => groups.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: text('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// ==================== NEW: USER COMMUNITIES ====================
export const userCommunities = pgTable('user_communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  communityId: uuid('community_id').references(() => groups.id).notNull(),
  role: text('role').default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Events
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

// Event Attendees
export const eventAttendees = pgTable('event_attendees', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  status: text('status').default('registered').notNull(),
  registeredAt: timestamp('registered_at').defaultNow().notNull(),
});

// Opportunities
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

// Announcements
export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  type: text('type').default('general').notNull(),
  priority: text('priority').default('normal').notNull(),
  isPublished: boolean('is_published').default(false),
  imageUrl: text('image_url'),
  publishedAt: timestamp('published_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Conversations
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
  userId: uuid('user_id').references(() => users.id).notNull(),
  lastRead: timestamp('last_read'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  type: text('type').default('text').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content'),
  link: text('link'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reports
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: uuid('reporter_id').references(() => users.id).notNull(),
  targetType: text('target_type').notNull(),
  targetId: uuid('target_id').notNull(),
  reason: text('reason').notNull(),
  description: text('description'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: uuid('entity_id'),
  previousValue: jsonb('previous_value'),
  newValue: jsonb('new_value'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== RELATIONS ====================
export const usersRelations = relations(users, ({ many }) => ({
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
}));

export const programmesRelations = relations(programmes, ({ many }) => ({
  cohorts: many(cohorts),
  resources: many(resources),
}));

export const cohortsRelations = relations(cohorts, ({ one }) => ({
  programme: one(programmes, {
    fields: [cohorts.programmeId],
    references: [programmes.id],
  }),
}));

// ==================== NEW: CONNECTIONS RELATIONS ====================
export const connectionsRelations = relations(connections, ({ one }) => ({
  requester: one(users, {
    fields: [connections.requesterId],
    references: [users.id],
    relationName: 'sentConnections',
  }),
  receiver: one(users, {
    fields: [connections.receiverId],
    references: [users.id],
    relationName: 'receivedConnections',
  }),
}));

// ==================== NEW: STUDENT INTERESTS RELATIONS ====================
export const studentInterestsRelations = relations(studentInterests, ({ one }) => ({
  student: one(users, {
    fields: [studentInterests.studentId],
    references: [users.id],
  }),
  interest: one(interests, {
    fields: [studentInterests.interestId],
    references: [interests.id],
  }),
}));

// ==================== NEW: USER COMMUNITIES RELATIONS ====================
export const userCommunitiesRelations = relations(userCommunities, ({ one }) => ({
  user: one(users, {
    fields: [userCommunities.userId],
    references: [users.id],
  }),
  community: one(groups, {
    fields: [userCommunities.communityId],
    references: [groups.id],
  }),
}));

export const mentorsRelations = relations(mentors, ({ one }) => ({
  user: one(users, {
    fields: [mentors.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
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
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}));

export const conversationMembersRelations = relations(conversationMembers, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationMembers.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [conversationMembers.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));
