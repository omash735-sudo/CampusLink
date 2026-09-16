// lib/validation.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  fullName: z
    .string()
    .min(2, 'Full name is required')
    .max(100, 'Full name is too long'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username is too long')
    .regex(/^[a-zA-Z0-9._]+$/, 'Username may only contain letters, numbers, dots and underscores'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Enter a valid phone number'),
  programmeId: z.string().uuid('Select a programme'),
  year: z.number().int().min(1).max(6),
  termsAccepted: z.literal(true, {
    errorMap: () => ({
      message: 'You must accept the Terms and Conditions and Privacy Policy',
    }),
  }),
  marketingEmailConsent: z.boolean().optional().default(false),
  whatsappMarketingConsent: z.boolean().optional().default(false),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  type: z
    .enum(['general', 'academic', 'student_union', 'student_news'])
    .default('general'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  isPublished: z.boolean().default(false),
  imageUrl: z.string().url().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  organizer: z.string().optional(),
  category: z.string().optional(),
  maxAttendees: z.number().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const mentorSchema = z.object({
  expertise: z.array(z.string()).optional().default([]),
  subjects: z.array(z.string()).optional().default([]),
  introduction: z.string().optional().default(''),
  experience: z.string().optional().nullable(),
  availability: z.enum(['available', 'limited', 'unavailable']).optional().default('available'),
});

export const opportunitySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  organization: z.string().min(2),
  category: z.string(),
  eligibility: z.string().optional(),
  deadline: z.string().optional(),
  applicationUrl: z.string().url().optional(),
  contact: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const postSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1),
  type: z.enum(['post', 'question', 'announcement']).default('post'),
  visibility: z.enum(['public', 'private']).default('public'),
});

export const mentorshipRequestSchema = z.object({
  message: z.string().min(10),
  introduction: z.string().optional(),
  helpNeeded: z.array(z.string()).optional(),
});

export const becomeMentorSchema = z.object({
  expertise: z.array(z.string()).min(1, 'At least one area of expertise is required'),
  subjects: z.array(z.string()).optional(),
  introduction: z.string().min(20, 'Introduction must be at least 20 characters'),
  experience: z.string().optional(),
  mentorType: z.enum(['Student', 'Alumni', 'Professional', 'Staff']).default('Student'),
});

// ==================== ADMIN / AUTH SCHEMAS ====================

export const adminSetupSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2, 'Full name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export const superAccessSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

// ==================== STUDENT UNION SCHEMA ====================

export const studentUnionMemberSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  position: z.string().min(2, 'Position is required').max(100),
  description: z.string().max(1000).optional().nullable(),
  photoUrl: z.string().url('Photo URL must be a valid URL').optional().nullable().or(z.literal('')),
  email: z.string().email('Enter a valid email').optional().nullable().or(z.literal('')),
  whatsapp: z.string().max(30).optional().nullable(),
  academicYear: z.string().min(4, 'Academic year is required').max(20),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// ==================== LEGAL SCHEMAS ====================

export const legalDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(20, 'Content is required'),
  version: z.string().min(1, 'Version is required'),
});

export const acceptLegalSchema = z.object({
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms and Conditions' }),
  }),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Privacy Policy' }),
  }),
  marketingEmailConsent: z.boolean().optional().default(false),
  whatsappMarketingConsent: z.boolean().optional().default(false),
});

// ==================== SPOTLIGHT SCHEMA ====================

export const spotlightSchema = z.object({
  studentName: z.string().min(2, 'Student name is required').max(120),
  programme: z.string().max(200).optional().nullable(),
  year: z.number().int().min(1).max(8).optional().nullable(),
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(600),
  graphicUrl: z.string().url('Graphic URL must be a valid URL').optional().nullable().or(z.literal('')),
  tags: z.array(z.string().max(40)).max(10).optional().default([]),
  achievement: z.string().max(200).optional().nullable(),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

// ==================== CLUB SCHEMAS ====================

export const clubSchema = z.object({
  name: z.string().min(2, 'Club name is required').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category: z.string().max(60).optional().nullable(),
  logoUrl: z.string().url('Logo URL must be a valid URL').optional().nullable().or(z.literal('')),
  coverUrl: z.string().url().optional().nullable().or(z.literal('')),
  email: z.string().email('Enter a valid email').optional().nullable().or(z.literal('')),
  whatsapp: z.string().max(30).optional().nullable(),
  instagramUrl: z.string().url().optional().nullable().or(z.literal('')),
  websiteUrl: z.string().url().optional().nullable().or(z.literal('')),
  meetingInfo: z.string().max(500).optional().nullable(),
  membershipInfo: z.string().max(500).optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

// ==================== RESOURCE LIBRARY SCHEMAS ====================

const RESOURCE_KINDS = ['document', 'video', 'article', 'publication'] as const;
const RESOURCE_STATUSES = ['draft', 'published', 'archived'] as const;

const RIGHTS_TYPES = [
  'campuslink_original',
  'own_material',
  'public_domain',
  'licensed_redistribution',
  'permission_obtained',
  'other',
] as const;

export const resourceKindSchema = z.enum(RESOURCE_KINDS);
export const resourceStatusSchema = z.enum(RESOURCE_STATUSES);
export const rightsTypeSchema = z.enum(RIGHTS_TYPES);

export const documentResourceSchema = z.object({
  resourceKind: z.literal('document'),
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  subject: z.string().max(120).optional().nullable(),
  programmeId: z.string().uuid().optional().nullable().or(z.literal('')),
  year: z.number().int().min(1).max(8).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  source: z.string().max(200).optional().nullable(),
  publicationDate: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  downloadable: z.boolean().default(true),
  previewable: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: resourceStatusSchema.default('draft'),
  rightsType: rightsTypeSchema,
  rightsConfirmed: z.literal(true, {
    errorMap: () => ({
      message: 'You must confirm you have rights to distribute this material',
    }),
  }),
  fileUrl: z.string().min(1, 'File is required'),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().int().min(1),
});

export const videoResourceSchema = z.object({
  resourceKind: z.literal('video'),
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  subject: z.string().max(120).optional().nullable(),
  programmeId: z.string().uuid().optional().nullable().or(z.literal('')),
  year: z.number().int().min(1).max(8).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  source: z.string().max(200).optional().nullable(),
  publicationDate: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  showEmbeddedPlayer: z.boolean().default(true),
  showYoutubeButton: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: resourceStatusSchema.default('draft'),
  youtubeUrl: z.string().url('Enter a valid YouTube URL'),
});

export const articleResourceSchema = z.object({
  resourceKind: z.enum(['article', 'publication']),
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(500).optional().nullable(),
  body: z.string().min(50, 'Article body must be at least 50 characters'),
  category: z.string().max(80).optional().nullable(),
  subject: z.string().max(120).optional().nullable(),
  programmeId: z.string().uuid().optional().nullable().or(z.literal('')),
  year: z.number().int().min(1).max(8).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  source: z.string().max(200).optional().nullable(),
  publicationDate: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  featured: z.boolean().default(false),
  status: resourceStatusSchema.default('draft'),
});

export const resourceCreateSchema = z.discriminatedUnion('resourceKind', [
  documentResourceSchema,
  videoResourceSchema,
  articleResourceSchema,
]);

export const resourceUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  subject: z.string().max(120).optional().nullable(),
  programmeId: z.string().uuid().optional().nullable().or(z.literal('')),
  year: z.number().int().min(1).max(8).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  source: z.string().max(200).optional().nullable(),
  publicationDate: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  body: z.string().optional().nullable(),
  youtubeUrl: z.string().url().optional().nullable().or(z.literal('')),
  youtubeVideoId: z.string().optional().nullable(),
  showEmbeddedPlayer: z.boolean().optional(),
  showYoutubeButton: z.boolean().optional(),
  downloadable: z.boolean().optional(),
  previewable: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: resourceStatusSchema.optional(),
  rightsType: rightsTypeSchema.optional().nullable(),
  rightsConfirmed: z.boolean().optional(),
  fileUrl: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  fileType: z.string().optional().nullable(),
  fileSize: z.number().int().optional().nullable(),
});

// ==================== RESOURCE CATEGORY SCHEMA ====================

export const resourceCategorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(60),
  description: z.string().max(200).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});
