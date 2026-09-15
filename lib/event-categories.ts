// lib/event-categories.ts
export const EVENT_CATEGORIES = [
  'Orientation',
  'Academic',
  'Career',
  'Social',
  'Sports',
  'Entertainment',
  'Workshop',
  'Other',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
