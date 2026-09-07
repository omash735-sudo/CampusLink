// app/api/mentors/requests/[id]/route.ts - Add notification calls
import { notifyMentorshipRequestAccepted, notifyMentorshipRequestDeclined } from '@/lib/services/notification.service';

// In accept action:
if (action === 'accept') {
  // ... existing code ...
  
  // Send notification to student
  await notifyMentorshipRequestAccepted(requestData.studentId, mentor.fullName);
}

// In decline action:
if (action === 'decline') {
  // ... existing code ...
  
  // Send notification to student
  await notifyMentorshipRequestDeclined(requestData.studentId, mentor.fullName);
}
