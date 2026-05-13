import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AuditReportEmail } from '@/emails/AuditReportEmail';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, totalSavings, annualSavings, shareUrl, recommendationsCount } = await request.json();

    // In development, override the recipient to your verified email to avoid Resend 403 errors
    const isDev = process.env.NODE_ENV === 'development';
    const recipientEmail = isDev && process.env.NEXT_PUBLIC_DEV_EMAIL 
      ? process.env.NEXT_PUBLIC_DEV_EMAIL 
      : email;

    if (isDev) {
      console.log(`[DEV MODE] Redirecting email from ${email} to ${recipientEmail}`);
    }

    // For testing without verified domain, use "onboarding@resend.dev"
    const fromEmail = process.env.VERIFIED_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: `StackAudit <${fromEmail}>`,
      to: [recipientEmail],
      subject: totalSavings > 0 
        ? `💰 Save $${totalSavings}/month on your AI tools!`
        : '✅ Your AI Spend Audit Results',
      react: AuditReportEmail({
        email, // Keep original email for the template display
        totalSavings,
        annualSavings,
        shareUrl,
        recommendationsCount,
      }) as React.ReactElement,
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Provide a helpful hint for the developer if it's a validation error (e.g. unverified domain)
      const hint: string | undefined = error.name === 'validation_error' 
        ? 'HINT: Resend restricts sending to your verified email only during development. Verify your domain at resend.com/domains to send to any recipient.'
        : undefined;

      return NextResponse.json({ 
        error: error.message,
        hint 
      }, { status: 500 });
    }

    console.log('Email sent:', data);
    return NextResponse.json({ success: true, data }, { status: 200 });
    
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
