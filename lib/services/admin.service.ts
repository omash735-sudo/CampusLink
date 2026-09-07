// lib/services/admin.service.ts
// This service manages all admin data with clear separation between demo and real data

export interface AdminData {
  id: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends AdminData {
  name: string;
  username: string;
  email: string;
  programme: string;
  year: number;
  faculty: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinedDate: string;
  lastActive: string;
  avatar?: string;
  bio?: string;
  interests?: string[];
  isMentor?: boolean;
}

export interface Mentor extends AdminData {
  name: string;
  username: string;
  email: string;
  programme: string;
  year: number;
  faculty: string;
  expertise: string[];
  subjects: string[];
  status: 'Active' | 'Inactive' | 'Suspended';
  mentees: number;
  joinedDate: string;
  rating?: number;
  availability?: 'available' | 'limited' | 'unavailable';
  introduction?: string;
  experience?: string;
}

export interface MentorApplication extends AdminData {
  applicant: string;
  applicantId: string;
  programme: string;
  year: number;
  faculty: string;
  expertise: string[];
  subjects: string[];
  introduction: string;
  experience: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

export interface Mentorship extends AdminData {
  mentor: string;
  mentorId: string;
  mentee: string;
  menteeId: string;
  topic: string;
  startDate: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled' | 'Suspended';
  lastActivity: string;
  sessions?: number;
}

export interface Programme extends AdminData {
  name: string;
  slug: string;
  code: string;
  faculty: string;
  description: string;
  duration: number;
  degree: string;
  status: 'Active' | 'Archived';
  department?: string;
  campus?: string;
}

export interface Faculty extends AdminData {
  name: string;
  slug: string;
  description: string;
  programmes: number;
  status: 'Active' | 'Archived';
}

export interface Course extends AdminData {
  name: string;
  slug: string;
  code: string;
  programme: string;
  programmeId: string;
  year: number;
  semester: number;
  description: string;
  credits: number;
  status: 'Active' | 'Archived';
}

export interface Resource extends AdminData {
  title: string;
  description: string;
  course: string;
  courseId: string;
  programme: string;
  programmeId: string;
  type: 'Notes' | 'Past Paper' | 'Assignment' | 'Study Guide' | 'Presentation' | 'Other';
  uploadedBy: string;
  uploadedById: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloads: number;
  views: number;
  status: 'Pending Review' | 'Published' | 'Rejected' | 'Archived';
  isVerified: boolean;
}

export interface Event extends AdminData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  organizerId: string;
  category: string;
  image?: string;
  maxAttendees?: number;
  registeredCount: number;
  status: 'Draft' | 'Published' | 'Cancelled' | 'Completed';
}

export interface Announcement extends AdminData {
  title: string;
  content: string;
  image?: string;
  category: string;
  priority: 'Normal' | 'High' | 'Urgent';
  author: string;
  authorId: string;
  publishDate: string;
  status: 'Draft' | 'Published' | 'Archived';
  expiresAt?: string;
}

export interface CampusLocation extends AdminData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  address: string;
  openingHours: string;
  contactInfo: string;
  accessibilityInfo: string;
  imageUrl: string;
  galleryImages: string[];
  isFeatured: boolean;
  status: 'Published' | 'Draft' | 'Archived';
  coordinates?: { lat: number; lng: number };
}

export interface CampusGalleryImage extends AdminData {
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  locationId?: string;
  isPublished: boolean;
}

export interface CampusHistoryEntry extends AdminData {
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  source?: string;
  isPublished: boolean;
  sortOrder: number;
}

export interface Report extends AdminData {
  type: 'Student' | 'Mentor' | 'Resource' | 'Event' | 'Announcement' | 'Other';
  itemId: string;
  itemTitle: string;
  reporter: string;
  reporterId: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Dismissed';
  resolvedBy?: string;
  resolvedDate?: string;
  resolution?: string;
}

export interface Feedback extends AdminData {
  content: string;
  category: string;
  user: string;
  userId: string;
  status: 'New' | 'Reviewing' | 'Resolved' | 'Archived';
  response?: string;
  respondedBy?: string;
  respondedDate?: string;
}

export interface PlatformNotification extends AdminData {
  title: string;
  message: string;
  target: 'All Users' | 'Students' | 'Mentors';
  scheduledFor?: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  sentAt?: string;
}

export interface AdminAuditLog extends AdminData {
  admin: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
}

class AdminService {
  private static instance: AdminService;
  private isUsingRealData = false;
  private defaultData: any = {};

  private constructor() {}

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  setRealDataMode(enabled: boolean) {
    this.isUsingRealData = enabled;
  }

  getDataMode(): string {
    return this.isUsingRealData ? 'Real Data' : 'Default/Demo Data';
  }

  // MARK: - Students
  async getStudents(): Promise<Student[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultStudents();
  }

  async getStudent(id: string): Promise<Student | null> {
    const students = await this.getStudents();
    return students.find(s => s.id === id) || null;
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    return {
      id: `student_${Date.now()}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    } as Student;
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const student = await this.getStudent(id);
    if (!student) throw new Error('Student not found');
    return { ...student, ...data, updatedAt: new Date().toISOString() };
  }

  async deleteStudent(id: string): Promise<void> {
    // In production, DELETE to API
  }

  private getDefaultStudents(): Student[] {
    return [
      {
        id: 'default_1',
        isDefault: true,
        createdAt: '2026-08-15T00:00:00Z',
        updatedAt: '2026-09-07T00:00:00Z',
        name: 'Omash Mashiri',
        username: 'omash.mashiri',
        email: 'omash@example.com',
        programme: 'Social Work',
        year: 3,
        faculty: 'Social Sciences',
        status: 'Active',
        joinedDate: '2026-08-15',
        lastActive: '2026-09-07',
        bio: 'Social Work student passionate about community development.',
        interests: ['Technology', 'Research', 'Social Work'],
        isMentor: true,
      },
    ];
  }

  // MARK: - Mentors
  async getMentors(): Promise<Mentor[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultMentors();
  }

  async getMentor(id: string): Promise<Mentor | null> {
    const mentors = await this.getMentors();
    return mentors.find(m => m.id === id) || null;
  }

  async updateMentor(id: string, data: Partial<Mentor>): Promise<Mentor> {
    const mentor = await this.getMentor(id);
    if (!mentor) throw new Error('Mentor not found');
    return { ...mentor, ...data, updatedAt: new Date().toISOString() };
  }

  private getDefaultMentors(): Mentor[] {
    return [
      {
        id: 'mentor_1',
        isDefault: true,
        createdAt: '2026-08-15T00:00:00Z',
        updatedAt: '2026-09-07T00:00:00Z',
        name: 'Omash Mashiri',
        username: 'omash.mashiri',
        email: 'omash@example.com',
        programme: 'Social Work',
        year: 3,
        faculty: 'Social Sciences',
        expertise: ['Academic Support', 'Career Guidance', 'Research'],
        subjects: ['Research Methods', 'Social Work Practice'],
        status: 'Active',
        mentees: 4,
        joinedDate: '2026-08-15',
        rating: 4.8,
        availability: 'available',
        introduction: 'I am a passionate mentor with experience in social work and youth development.',
      },
    ];
  }

  // MARK: - Mentor Applications
  async getMentorApplications(): Promise<MentorApplication[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultMentorApplications();
  }

  async getMentorApplication(id: string): Promise<MentorApplication | null> {
    const apps = await this.getMentorApplications();
    return apps.find(a => a.id === id) || null;
  }

  async approveMentorApplication(id: string, notes?: string): Promise<MentorApplication> {
    const app = await this.getMentorApplication(id);
    if (!app) throw new Error('Application not found');
    return {
      ...app,
      status: 'Approved',
      reviewedBy: 'admin',
      reviewedDate: new Date().toISOString(),
      reviewNotes: notes,
      updatedAt: new Date().toISOString(),
    };
  }

  async rejectMentorApplication(id: string, notes?: string): Promise<MentorApplication> {
    const app = await this.getMentorApplication(id);
    if (!app) throw new Error('Application not found');
    return {
      ...app,
      status: 'Rejected',
      reviewedBy: 'admin',
      reviewedDate: new Date().toISOString(),
      reviewNotes: notes,
      updatedAt: new Date().toISOString(),
    };
  }

  private getDefaultMentorApplications(): MentorApplication[] {
    return [
      {
        id: 'app_1',
        isDefault: true,
        createdAt: '2026-09-05T00:00:00Z',
        updatedAt: '2026-09-05T00:00:00Z',
        applicant: 'Sarah Phiri',
        applicantId: 'user_123',
        programme: 'Environmental Science',
        year: 3,
        faculty: 'Natural Sciences',
        expertise: ['Academic Support', 'Research'],
        subjects: ['Environmental Science', 'Research Methods'],
        introduction: 'I want to help students succeed in their studies.',
        experience: 'Peer tutor for 2 years',
        status: 'Pending',
        appliedDate: '2026-09-05',
      },
    ];
  }

  // MARK: - Programmes
  async getProgrammes(): Promise<Programme[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultProgrammes();
  }

  async getProgramme(id: string): Promise<Programme | null> {
    const programmes = await this.getProgrammes();
    return programmes.find(p => p.id === id) || null;
  }

  async createProgramme(data: Partial<Programme>): Promise<Programme> {
    return {
      id: `prog_${Date.now()}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Active',
      ...data,
    } as Programme;
  }

  async updateProgramme(id: string, data: Partial<Programme>): Promise<Programme> {
    const programme = await this.getProgramme(id);
    if (!programme) throw new Error('Programme not found');
    return { ...programme, ...data, updatedAt: new Date().toISOString() };
  }

  private getDefaultProgrammes(): Programme[] {
    return [
      {
        id: 'prog_1',
        isDefault: true,
        createdAt: '2026-08-01T00:00:00Z',
        updatedAt: '2026-08-01T00:00:00Z',
        name: 'Social Work & Youth Development',
        slug: 'social-work-youth-development',
        code: 'SWYD',
        faculty: 'Social Sciences',
        description: 'Study of social welfare, community development, and youth empowerment.',
        duration: 4,
        degree: 'Bachelor of Science',
        status: 'Active',
        department: 'Social Work',
        campus: 'City Campus',
      },
    ];
  }

  // MARK: - Resources
  async getResources(): Promise<Resource[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultResources();
  }

  async getResource(id: string): Promise<Resource | null> {
    const resources = await this.getResources();
    return resources.find(r => r.id === id) || null;
  }

  async createResource(data: Partial<Resource>): Promise<Resource> {
    return {
      id: `res_${Date.now()}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Pending Review',
      downloads: 0,
      views: 0,
      isVerified: false,
      ...data,
    } as Resource;
  }

  async approveResource(id: string): Promise<Resource> {
    const resource = await this.getResource(id);
    if (!resource) throw new Error('Resource not found');
    return {
      ...resource,
      status: 'Published',
      isVerified: true,
      updatedAt: new Date().toISOString(),
    };
  }

  async rejectResource(id: string): Promise<Resource> {
    const resource = await this.getResource(id);
    if (!resource) throw new Error('Resource not found');
    return {
      ...resource,
      status: 'Rejected',
      updatedAt: new Date().toISOString(),
    };
  }

  private getDefaultResources(): Resource[] {
    return [
      {
        id: 'res_1',
        isDefault: true,
        createdAt: '2026-09-05T00:00:00Z',
        updatedAt: '2026-09-05T00:00:00Z',
        title: 'Research Methods Guide',
        description: 'Comprehensive guide to research methods in social sciences.',
        course: 'Research Methods',
        courseId: 'course_1',
        programme: 'Social Work',
        programmeId: 'prog_1',
        type: 'Study Guide',
        uploadedBy: 'Jane Mwale',
        uploadedById: 'user_456',
        fileName: 'research_methods_guide.pdf',
        fileType: 'pdf',
        fileSize: 2450000,
        downloads: 45,
        views: 120,
        status: 'Published',
        isVerified: true,
      },
    ];
  }

  // MARK: - Events
  async getEvents(): Promise<Event[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultEvents();
  }

  async getEvent(id: string): Promise<Event | null> {
    const events = await this.getEvents();
    return events.find(e => e.id === id) || null;
  }

  async createEvent(data: Partial<Event>): Promise<Event> {
    return {
      id: `evt_${Date.now()}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Draft',
      registeredCount: 0,
      ...data,
    } as Event;
  }

  async publishEvent(id: string): Promise<Event> {
    const event = await this.getEvent(id);
    if (!event) throw new Error('Event not found');
    return {
      ...event,
      status: 'Published',
      updatedAt: new Date().toISOString(),
    };
  }

  private getDefaultEvents(): Event[] {
    return [
      {
        id: 'evt_1',
        isDefault: true,
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-01T00:00:00Z',
        title: 'Orientation Week 2026',
        description: 'Welcome new students to campus with a week of activities.',
        date: '2026-09-15',
        startTime: '09:00',
        endTime: '17:00',
        location: 'Main Hall',
        organizer: 'Student Union',
        organizerId: 'org_1',
        category: 'Orientation',
        registeredCount: 120,
        status: 'Published',
      },
    ];
  }

  // MARK: - Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultAnnouncements();
  }

  async getAnnouncement(id: string): Promise<Announcement | null> {
    const announcements = await this.getAnnouncements();
    return announcements.find(a => a.id === id) || null;
  }

  async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
    return {
      id: `ann_${Date.now()}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Draft',
      priority: 'Normal',
      ...data,
    } as Announcement;
  }

  async publishAnnouncement(id: string): Promise<Announcement> {
    const announcement = await this.getAnnouncement(id);
    if (!announcement) throw new Error('Announcement not found');
    return {
      ...announcement,
      status: 'Published',
      publishDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private getDefaultAnnouncements(): Announcement[] {
    return [
      {
        id: 'ann_1',
        isDefault: true,
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-01T00:00:00Z',
        title: 'Library Extended Hours',
        content: 'The library will be open until midnight during exam period.',
        category: 'Academic',
        priority: 'Urgent',
        author: 'Administrator',
        authorId: 'admin_1',
        publishDate: '2026-09-01',
        status: 'Published',
      },
    ];
  }

  // MARK: - Campus Locations
  async getCampusLocations(): Promise<CampusLocation[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultCampusLocations();
  }

  async getCampusLocation(id: string): Promise<CampusLocation | null> {
    const locations = await this.getCampusLocations();
    return locations.find(l => l.id === id) || null;
  }

  async createCampusLocation(data: Partial<CampusLocation>): Promise<CampusLocation> {
    return {
      id: `loc_${Date.now()}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Draft',
      galleryImages: [],
      isFeatured: false,
      ...data,
    } as CampusLocation;
  }

  private getDefaultCampusLocations(): CampusLocation[] {
    return [
      {
        id: 'loc_1',
        isDefault: true,
        createdAt: '2026-08-01T00:00:00Z',
        updatedAt: '2026-08-01T00:00:00Z',
        name: 'Main Hall',
        slug: 'main-hall',
        description: 'Central lecture hall for large classes and events.',
        shortDescription: 'Primary lecture venue on campus.',
        category: 'Academic',
        address: 'City Campus, Lilongwe',
        openingHours: '08:00 - 18:00',
        contactInfo: '+265 123 456 789',
        accessibilityInfo: 'Wheelchair accessible',
        imageUrl: '',
        galleryImages: [],
        isFeatured: true,
        status: 'Published',
        coordinates: { lat: -13.9636, lng: 33.7741 },
      },
    ];
  }

  // MARK: - Reports
  async getReports(): Promise<Report[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultReports();
  }

  async getReport(id: string): Promise<Report | null> {
    const reports = await this.getReports();
    return reports.find(r => r.id === id) || null;
  }

  async resolveReport(id: string, resolution?: string): Promise<Report> {
    const report = await this.getReport(id);
    if (!report) throw new Error('Report not found');
    return {
      ...report,
      status: 'Resolved',
      resolvedBy: 'admin',
      resolvedDate: new Date().toISOString(),
      resolution,
      updatedAt: new Date().toISOString(),
    };
  }

  private getDefaultReports(): Report[] {
    return [
      {
        id: 'rep_1',
        isDefault: true,
        createdAt: '2026-09-06T00:00:00Z',
        updatedAt: '2026-09-06T00:00:00Z',
        type: 'Resource',
        itemId: 'res_2',
        itemTitle: 'Case Study Notes',
        reporter: 'John Banda',
        reporterId: 'user_789',
        description: 'This resource appears to be a duplicate of another existing resource.',
        status: 'Open',
      },
    ];
  }

  // MARK: - Feedback
  async getFeedback(): Promise<Feedback[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultFeedback();
  }

  async getFeedbackItem(id: string): Promise<Feedback | null> {
    const feedback = await this.getFeedback();
    return feedback.find(f => f.id === id) || null;
  }

  async resolveFeedback(id: string, response?: string): Promise<Feedback> {
    const feedback = await this.getFeedbackItem(id);
    if (!feedback) throw new Error('Feedback not found');
    return {
      ...feedback,
      status: 'Resolved',
      response,
      respondedBy: 'admin',
      respondedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private getDefaultFeedback(): Feedback[] {
    return [
      {
        id: 'fb_1',
        isDefault: true,
        createdAt: '2026-09-06T00:00:00Z',
        updatedAt: '2026-09-06T00:00:00Z',
        content: 'The platform is great! I would love to see more resources for Social Work courses.',
        category: 'Suggestion',
        user: 'Jane Mwale',
        userId: 'user_456',
        status: 'New',
      },
    ];
  }

  // MARK: - Admin Audit Log
  async getAuditLog(): Promise<AdminAuditLog[]> {
    if (this.isUsingRealData) {
      return [];
    }
    return this.getDefaultAuditLog();
  }

  private getDefaultAuditLog(): AdminAuditLog[] {
    return [
      {
        id: 'audit_1',
        isDefault: true,
        createdAt: '2026-09-07T10:30:00Z',
        updatedAt: '2026-09-07T10:30:00Z',
        admin: 'Administrator',
        adminId: 'admin_1',
        action: 'Approved mentor application',
        entity: 'Mentor Application',
        entityId: 'app_1',
        details: 'Approved Sarah Phiri\'s mentor application',
      },
    ];
  }
}

export const adminService = AdminService.getInstance();
