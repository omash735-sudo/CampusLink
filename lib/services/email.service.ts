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
      from: process.env.SMTP_FROM || 'noreply@campuslink.com',
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
