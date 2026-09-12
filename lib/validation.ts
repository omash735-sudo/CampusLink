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
