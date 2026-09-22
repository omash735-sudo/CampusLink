// lib/services/email.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(data: EmailData) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@campuslink.com',
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text || '',
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// ==================== EMAIL TEMPLATES ====================

export async function sendMentorApprovalEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: '🎉 You are now a CampusLink Mentor!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Mentor Application Approved!</h1>
        <p>Dear ${name},</p>
        <p>Congratulations! Your mentor application has been approved. You are now officially a CampusLink Mentor.</p>
        <p>What you can do now:</p>
        <ul>
          <li>Access your mentor dashboard</li>
          <li>Manage mentorship requests</li>
          <li>View your mentees</li>
          <li>Share your expertise</li>
        </ul>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/mentor" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Go to Mentor Dashboard
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendMentorRejectionEmail(email: string, name: string, reason?: string) {
  return sendEmail({
    to: email,
    subject: 'Mentor Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #DC2626;">Mentor Application Update</h1>
        <p>Dear ${name},</p>
        <p>We regret to inform you that your mentor application was not approved at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>You can reapply in the future or reach out to us for more information.</p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendMentorshipRequestEmail(email: string, name: string, studentName: string) {
  return sendEmail({
    to: email,
    subject: 'New Mentorship Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">New Mentorship Request</h1>
        <p>Dear ${name},</p>
        <p>${studentName} has requested mentorship from you.</p>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/mentor/requests" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Review Request
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendRegistrationReceivedEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to CampusLink - Registration Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Welcome to CampusLink, ${name}!</h1>
        <p>Thank you for joining CampusLink. Your registration has been received successfully.</p>
        <p>At the moment, access to CampusLink is limited while we complete the authorization system. Your information has been securely recorded, and you will be notified when access becomes available.</p>
        <p>No further action is required from you at this time. If you have any questions, feel free to reach out to us.</p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendTermsUpdatedEmail(email: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuslinkmw.vercel.app';
  return sendEmail({
    to: email,
    subject: 'CampusLink — Terms and Privacy Policy Updated',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">We've updated our Terms</h1>
        <p>Dear ${name},</p>
        <p>We've made changes to the CampusLink Terms and Conditions and/or Privacy Policy.</p>
        <p>Please take a moment to review the updated versions. You'll be asked to accept them the next time you sign in.</p>
        <p style="margin-top: 20px;">
          <a href="${appUrl}/terms" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Review Terms and Conditions
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendPublicationsApplicationReceivedEmail(
  email: string,
  name: string
) {
  return sendEmail({
    to: email,
    subject: 'CampusLink Publications Application Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Application Received</h1>
        <p>Dear ${name},</p>
        <p>Thank you for applying to join the CampusLink Publications Office. Your application has been received and is currently under review.</p>
        <p>We'll notify you by email once a decision has been made.</p>
        <p>No further action is required from you at this time.</p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendPublicationsApprovedEmail(email: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuslinkmw.vercel.app';
  return sendEmail({
    to: email,
    subject: 'Welcome to the CampusLink Publications Office',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">You're now a Publications Officer</h1>
        <p>Dear ${name},</p>
        <p>Your application to join the CampusLink Publications Office has been approved. You can now access the publications dashboard to help manage announcements, events, and the Student Union section.</p>
        <p style="margin-top: 20px;">
          <a href="${appUrl}/admin" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Go to Publications Dashboard
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendPublicationsRejectedEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'CampusLink Publications Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #DC2626;">Application Update</h1>
        <p>Dear ${name},</p>
        <p>Thank you for your interest in joining the CampusLink Publications Office. After reviewing your application, we are unable to offer you a position at this time.</p>
        <p>You are welcome to apply again in the future. If you have any questions, feel free to reach out to us.</p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendClubRegistrationNotification(
  clubName: string,
  proposedBy: string,
  contactEmail: string,
  description: string
) {
  const adminEmail = 'campuslinkmw@gmail.com';
  return sendEmail({
    to: adminEmail,
    subject: `New Club Registration — ${clubName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">New Club Registration</h1>
        <p><strong>Club name:</strong> ${clubName}</p>
        <p><strong>Proposed by:</strong> ${proposedBy}</p>
        <p><strong>Contact email:</strong> ${contactEmail}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p><strong>Description:</strong></p>
        <p style="white-space: pre-wrap;">${description}</p>
        <p style="margin-top: 20px;">
          Review and approve this club in the admin dashboard.
        </p>
      </div>
    `,
  });
}

export async function sendClubApprovedEmail(email: string, clubName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuslinkmw.vercel.app';
  return sendEmail({
    to: email,
    subject: `Your club ${clubName} is now on CampusLink`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Club Approved</h1>
        <p>Good news — your club <strong>${clubName}</strong> has been approved and is now listed on CampusLink.</p>
        <p style="margin-top: 20px;">
          <a href="${appUrl}/clubs" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            View Clubs Page
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendMentorApplicationReceivedEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'CampusLink Mentor Application Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Application Received</h1>
        <p>Dear ${name},</p>
        <p>Thank you for applying to become a CampusLink Mentor. Your application has been received and is currently under review.</p>
        <p>We'll notify you by email once a decision has been made. In the meantime, you can continue using CampusLink as a student.</p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendMentorshipRequestAcceptedEmail(
  email: string,
  studentName: string,
  mentorName: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuslinkmw.vercel.app';
  return sendEmail({
    to: email,
    subject: 'Your mentorship request was accepted',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Request Accepted!</h1>
        <p>Dear ${studentName},</p>
        <p><strong>${mentorName}</strong> has accepted your mentorship request. You can now start your mentorship journey.</p>
        <p style="margin-top: 20px;">
          <a href="${appUrl}/student/dashboard" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Go to Dashboard
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

export async function sendMentorshipRequestDeclinedEmail(
  email: string,
  studentName: string,
  mentorName: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuslinkmw.vercel.app';
  return sendEmail({
    to: email,
    subject: 'Mentorship Request Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #DC2626;">Mentorship Request Update</h1>
        <p>Dear ${studentName},</p>
        <p>Unfortunately, <strong>${mentorName}</strong> is unable to accept your mentorship request at this time.</p>
        <p>You can browse other mentors on CampusLink and send a request to someone else. There are plenty of experienced students and alumni ready to help.</p>
        <p style="margin-top: 20px;">
          <a href="${appUrl}/mentors" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Browse Mentors
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}

// ==================== PASSWORD RESET EMAILS ====================

export async function sendPasswordResetOtpEmail(
  email: string,
  name: string,
  otp: string
) {
  return sendEmail({
    to: email,
    subject: 'CampusLink — Your password reset code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Password Reset</h1>
        <p>Dear ${name},</p>
        <p>You requested to reset your CampusLink password. Use the code below to continue:</p>
        <div style="margin: 24px 0; padding: 16px; background: #f3f4f6; text-align: center;">
          <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #176B3A;">${otp}</span>
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #64706A; font-size: 14px;">
          If you didn't request this, you can safely ignore this email — your password will not change.
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
    text: `Your CampusLink password reset code is: ${otp}\n\nThis code expires in 10 minutes. If you didn't request this, ignore this email.`,
  });
}

export async function sendPasswordResetInstructionsEmail(
  email: string,
  name: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuslinkmw.vercel.app';
  return sendEmail({
    to: email,
    subject: 'CampusLink — Password reset instructions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Password Reset Instructions</h1>
        <p>Dear ${name},</p>
        <p>An administrator has sent you password reset instructions for your CampusLink account.</p>
        <p>To reset your password, click the button below and follow the steps. You'll receive a 6-digit code by email to verify your identity.</p>
        <p style="margin-top: 20px;">
          <a href="${appUrl}/auth/forgot-password" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Reset My Password
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          If you didn't ask for this, contact the CampusLink team.
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
    text: `An administrator has sent you password reset instructions for CampusLink.\n\nReset your password at: ${appUrl}/auth/forgot-password`,
  });
}

export async function sendPasswordChangedConfirmationEmail(
  email: string,
  name: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuslinkmw.vercel.app';
  return sendEmail({
    to: email,
    subject: 'CampusLink — Your password was changed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
        <h1 style="color: #176B3A;">Password Changed</h1>
        <p>Dear ${name},</p>
        <p>This is a confirmation that your CampusLink password was successfully changed on ${new Date().toLocaleString()}.</p>
        <p>If this wasn't you, please contact the CampusLink team immediately.</p>
        <p style="margin-top: 20px;">
          <a href="${appUrl}/auth/login" style="background-color: #176B3A; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
            Sign In
          </a>
        </p>
        <p style="margin-top: 20px; color: #64706A; font-size: 14px;">
          Best regards,<br>
          The CampusLink Team
        </p>
      </div>
    `,
  });
}
