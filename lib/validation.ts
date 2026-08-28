// lib/validation.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  username: z.string().min(3),
  programme: z.string().optional(),
  year: z.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  type: z.enum(['general', 'academic', 'student_union']).default('general'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  isPublished: z.boolean().default(false),
  expiresAt: z.string().optional(),
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

export const resourceSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  programmeId: z.string().optional(),
  year: z.number().optional(),
  course: z.string().optional(),
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
});

export const mentorSchema = z.object({
  expertise: z.array(z.string()),
  subjects: z.array(z.string()),
  introduction: z.string().min(50),
  experience: z.string().optional(),
  availability: z.record(z.any()).optional(),
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
