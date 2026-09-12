// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
      secure: process.env.SMTP_SECURE,
      hasPassword: !!process.env.SMTP_PASS,
    };

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({
        success: false,
        error: 'Missing SMTP env vars',
        config,
      }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'campuslinkmw@gmail.com',
      subject: 'CampusLink SMTP Test',
      html: `<p>SMTP is working. Sent at ${new Date().toISOString()}</p>`,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
      config,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    }, { status: 500 });
  }
}
