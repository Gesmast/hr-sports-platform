import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { platformEmails, EMAIL_CONFIG } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse('Invalid or missing verification token.', { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { data: subscriber, error } = await admin
      .from('newsletter_subscribers')
      .select('id, email, status, unsubscribe_token')
      .eq('verification_token', token)
      .maybeSingle();

    if (error || !subscriber) {
      return new NextResponse('This verification link is invalid or has expired.', { status: 404 });
    }

    if (subscriber.status !== 'active') {
      await admin
        .from('newsletter_subscribers')
        .update({
          status: 'active',
          verified_at: new Date().toISOString(),
          verification_token: null, // Clear used token
        })
        .eq('id', subscriber.id);

      // Send the official welcome briefing email
      try {
        await platformEmails.sendNewsletterWelcome(
          subscriber.email,
          subscriber.unsubscribe_token
        );
      } catch (e) {
        console.warn('[Newsletter Welcome Error]:', e);
      }
    }

    // Return clean, user-friendly HTML confirmation page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Subscription Confirmed — HR Sports</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #F4F4F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { max-width: 480px; margin: 20px; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 8px; padding: 40px 32px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .icon { width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #ECFDF5; color: #059669; font-size: 24px; margin: 0 auto 16px auto; }
    h1 { font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 12px 0; }
    p { font-size: 14px; color: #52525B; line-height: 1.6; margin: 0 0 24px 0; }
    a.btn { display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 14px; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#10003;</div>
    <h1>Subscription Confirmed</h1>
    <p>Thank you for verifying <strong>${subscriber.email}</strong>. Your subscription to HR Sports factory updates and apparel promotions is now active.</p>
    <a href="${EMAIL_CONFIG.APP_URL}" class="btn">Return to HR Sports &rarr;</a>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[Newsletter Verify Error]:', err);
    return new NextResponse('Internal error processing verification.', { status: 500 });
  }
}
