// lib/announcement-types.ts
export const ANNOUNCEMENT_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'academic', label: 'Academic' },
  { value: 'student_union', label: 'Student Union' },
  { value: 'student_news', label: 'Student News' },
] as const;

export type AnnouncementType = (typeof ANNOUNCEMENT_TYPES)[number]['value'];

export function getAnnouncementTypeLabel(value: string | null | undefined): string {
  const found = ANNOUNCEMENT_TYPES.find((t) => t.value === value);
  return found ? found.label : 'General';
}
