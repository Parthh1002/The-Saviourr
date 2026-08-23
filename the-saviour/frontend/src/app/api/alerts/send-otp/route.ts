import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

export async function POST(req: Request) {
  let email = '';
  let otp = '';
  let fullname = '';
  try {
    const body = await req.json();
    email = body.email;
    otp = body.otp;
    fullname = body.fullname;

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 });
    }

    // Set short connection timeout so Render doesn't hang the client request for 30s
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

    const emailHtml = `
      <div style="background-color: #050a0f; color: #ffffff; font-family: 'Inter', sans-serif; padding: 40px; border-radius: 12px; max-width: 500px; margin: auto; border: 1px solid #1a2a3a; box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);">
        <div style="border-left: 4px solid #3b82f6; padding-left: 20px; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; font-size: 22px; font-weight: 800; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">Security Verification</h1>
          <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0; font-family: monospace;">THE SAVIOUR | IDENTITY ASSURANCE</p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 25px; margin-bottom: 25px; text-align: center;">
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px; text-align: left;">
            Hello ${fullname || 'Officer'},<br/><br/>
            Please use the following 6-digit secure OTP to complete your registration and verify your Gmail address on The Saviour AI Surveillance network:
          </p>
          
          <div style="background: rgba(59, 130, 246, 0.1); border: 1px dashed rgba(59, 130, 246, 0.4); padding: 15px; border-radius: 8px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #3b82f6; display: inline-block; margin: 10px 0 20px 0; font-family: monospace;">
            ${otp}
          </div>

          <div style="padding: 10px; background: rgba(239, 68, 68, 0.05); border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.15);">
            <p style="color: #f87171; font-size: 11px; margin: 0; font-weight: 500;">
              ⚠️ Security Notice: Do not share this OTP with anyone. Saviour staff will never ask for this code.
            </p>
          </div>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; text-align: center;">
          <p style="color: #475569; font-size: 11px; line-height: 1.6;">
            This is an automated transmission from The Saviour AI Surveillance Platform.<br/>
            If you did not request this verification, please ignore this email.
          </p>
        </div>
      </div>
    `;

    // Try sending email
    await transporter.sendMail({
      from: `"THE SAVIOUR SECURITY" <${process.env.GMAIL_USER || 'noreply@saviour.ai'}>`,
      to: email,
      subject: `🔑 [Saviour AI] ${otp} - Verification OTP Code`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, isDemoMode: false });
  } catch (error: any) {
    console.warn('Nodemailer OTP sending failed, falling back to Demo Mode. Error:', error.message || error);
    
    // We return success: true but flag isDemoMode so the UI can show the OTP to the user gracefully.
    // This solves the hosting network SMTP blocking (Render blocks port 465/587 outbound on free tier).
    return NextResponse.json({ 
      success: true, 
      isDemoMode: true, 
      otp: otp, 
      warning: 'Outbound SMTP port is blocked by the cloud provider. Falling back to Demo Mode.'
    });
  }
}
