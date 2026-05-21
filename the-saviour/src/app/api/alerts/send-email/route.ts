import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { threatType, timestamp, location, cameraId, threatLevel, confidence, dashboardUrl } = body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    // Always ensure parth's email receives the emergency alerts in addition to any configured environment variables
    const rawEmails = process.env.OFFICER_ALERT_EMAILS || '';
    const officerEmails = [...new Set([
      '11a21278parth@gmail.com', 
      ...rawEmails.split(',').map(e => e.trim()).filter(Boolean)
    ])].join(', ');

    const emailHtml = `
      <div style="background-color: #050a0f; color: #ffffff; font-family: 'Inter', sans-serif; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #1a2a3a; box-shadow: 0 0 40px rgba(239, 68, 68, 0.1);">
        <div style="border-left: 4px solid #ef4444; padding-left: 20px; margin-bottom: 30px;">
          <h1 style="color: #ef4444; font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0; text-transform: uppercase;">Emergency Threat Alert</h1>
          <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0; font-family: monospace;">THE SAVIOUR | AI SURVEILLANCE MESH</p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 25px; margin-bottom: 25px; backdrop-filter: blur(10px);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 15px;">
            <span style="color: #94a3b8; font-size: 14px;">Threat Type:</span>
            <span style="color: #ffffff; font-weight: 700; font-size: 16px;">${threatType}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 4px; text-transform: uppercase;">Location Context</p>
            <p style="color: #ffffff; font-size: 16px; margin: 0;">${location}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="color: #94a3b8; font-size: 12px; margin-bottom: 4px; text-transform: uppercase;">Camera ID</p>
              <p style="color: #ffffff; font-size: 14px; margin: 0; font-family: monospace;">${cameraId}</p>
            </div>
            <div>
              <p style="color: #94a3b8; font-size: 12px; margin-bottom: 4px; text-transform: uppercase;">AI Confidence</p>
              <p style="color: #10b981; font-size: 14px; margin: 0; font-weight: 700;">${confidence}%</p>
            </div>
          </div>

          <div style="margin-top: 20px; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.2);">
            <p style="color: #ef4444; font-size: 12px; margin: 0; text-align: center; font-weight: 600;">STATUS: ${threatLevel.toUpperCase()} PRIORITY INTERCEPTION REQUIRED</p>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${dashboardUrl}" style="display: inline-block; background: #ef4444; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);">Access Command Dashboard</a>
        </div>

        <div style="margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; text-align: center;">
          <p style="color: #475569; font-size: 11px; line-height: 1.6;">
            This is an automated emergency transmission from The Saviour AI Forest Surveillance Network.<br/>
            Timestamp: ${timestamp}<br/>
            Unsubscribe from critical alerts is restricted for authorized personnel.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"THE SAVIOUR ALERT" <${process.env.GMAIL_USER || 'noreply@saviour.ai'}>`,
      to: officerEmails,
      subject: `🚨 CRITICAL: ${threatType} Detected in ${location}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.warn('Gmail alert sending failed (SMTP outbound port may be restricted). Error:', error.message || error);
    return NextResponse.json({ 
      success: true, 
      warning: 'Outbound SMTP port is restricted by the cloud host.',
      error: error.message 
    });
  }
}
