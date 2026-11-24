import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/schemas/newsletter';
import { platformEmails } from '@/lib/email';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Anti-Bot Honeypot
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      console.log('[Newsletter Honeypot] Silently dropping bot submission');
      return NextResponse.json({
        success: true,
        message: 'Please check your inbox to confirm your subscription.',
      });
    }

    // 2. Validation
    const validation = newsletterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid email address',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const normalizedEmail = email.trim().toLowerCase();
    const admin = createAdminClient();

    // 3. Check existing subscriber in Supabase
    const { data: existing } = await admin
      .from('newsletter_subscribers')
      .select('id, status, unsubscribe_token')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existing && existing.status === 'active') {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already registered for HR Sports updates.',
      });
    }

    // Generate secure random verification and unsubscribe tokens
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = existing?.unsubscribe_token || crypto.randomBytes(32).toString('hex');

    await admin.from('newsletter_subscribers').upsert(
      {
        email: normalizedEmail,
        status: 'pending_verification',
        verification_token: verificationToken,
        unsubscribe_token: unsubscribeToken,
        consent_timestamp: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    // 4. Dispatch Double Opt-In Verification Email (From: news@thehrsports.com)
    await platformEmails.sendNewsletterVerification(normalizedEmail, verificationToken);

    return NextResponse.json({
      success: true,
      message: 'Please check your inbox and click the confirmation link to complete your subscription.',
    });
  } catch (error: any) {
    console.error('Error handling /api/newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process newsletter subscription' },
      { status: 500 }
    );
  }
}
