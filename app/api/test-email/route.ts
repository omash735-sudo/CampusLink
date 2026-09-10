// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Check if environment variables are set
    const config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
      secure: process.env.SMTP_SECURE,
      hasPassword: !!process.env.SMTP_PASS,
    };

    console.log('SMTP Config:', config);

    // Validate config
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({
        success: false,
        error: 'Missing SMTP environment variables',
        config,
      }, { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified!');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'campuslinkmw@gmail.com',
      subject: '✅ CampusLink Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb;">
          <h1 style="color: #176B3A;">Email is Working! 🎉</h1>
          <p>Your SMTP configuration is correct.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #64706A; font-size: 14px;">Sent from CampusLink</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      response: info.response,
      config,
    });
  } catch (error: any) {
    console.error('Email test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    }, { status: 500 });
  }
}
