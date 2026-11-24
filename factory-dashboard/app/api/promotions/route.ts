import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const NEWS_SENDER = process.env.EMAIL_SENDER_NEWS || 'HR Sports News <news@thehrsports.com>';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thehrsports.com';
const LOGO_URL = `${BASE_URL}/logo.png`;

function wrapPromoEmail(title: string, bodyContent: string, cta?: { label: string; url: string }, unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F4F4F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181B; }
    .container { max-width: 600px; margin: 32px auto; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 8px; overflow: hidden; }
    .header { padding: 24px 32px 18px 32px; border-bottom: 1px solid #F4F4F5; }
    .content { padding: 28px 32px; font-size: 14px; line-height: 1.7; color: #3F3F46; }
    .btn { display: inline-block; background-color: #111111; color: #FFFFFF !important; font-size: 14px; font-weight: 700; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 18px 0; }
    .footer { padding: 20px 32px; background: #FAFAFA; border-top: 1px solid #E4E4E7; font-size: 11px; color: #71717A; }
  </style>
</head>
<body>
  <div style="width: 100%; background-color: #F4F4F5; padding: 20px 10px;">
    <div class="container">
      <div class="header">
        <a href="${BASE_URL}" target="_blank" style="text-decoration: none;">
          <img src="${LOGO_URL}" alt="HR Sports" style="height: 36px; vertical-align: middle;" border="0" onerror="this.style.display='none'">
          <span style="font-size: 20px; font-weight: 800; color: #111111; vertical-align: middle; margin-left: 6px;">HR SPORTS</span>
        </a>
        <p style="font-size: 13px; color: #71717A; margin: 4px 0 0 0;">Factory Direct Teamwear & Custom Uniforms</p>
      </div>
      <div class="content">
        <h1 style="font-size: 22px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">${title}</h1>
        ${bodyContent}
        ${cta && cta.url ? `<div><a href="${cta.url}" class="btn" target="_blank">${cta.label || 'View Offer'} &rarr;</a></div>` : ''}
      </div>
      <div class="footer">
        <div>HR Sports Manufacturing &bull; <a href="${BASE_URL}" style="color: #71717A;">thehrsports.com</a></div>
        ${unsubscribeUrl ? `
          <div style="margin-top: 8px;">
            You received this promotional briefing because you are subscribed to HR Sports updates.
            <a href="${unsubscribeUrl}" style="color: #71717A; text-decoration: underline;">Unsubscribe</a> at any time.
          </div>
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function GET() {
  try {
    const sb = getAdminClient();

    // 1. Count active subscribers
    const { count: activeCount } = await sb
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // 2. Fetch past campaigns
    const { data: campaigns } = await sb
      .from('newsletter_campaigns')
      .select('*, sender_profile:profiles!newsletter_campaigns_sent_by_fkey(full_name, email)')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      success: true,
      activeSubscribers: activeCount || 0,
      campaigns: campaigns || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subject, contentHtml, previewText, callToAction, isTest, testEmail } = body;

    if (!title || !subject || !contentHtml) {
      return NextResponse.json({ error: 'Title, subject, and content are required' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const sb = getAdminClient();

    // Mode A: Send single test email
    if (isTest && testEmail) {
      const html = wrapPromoEmail(title, contentHtml, callToAction);
      if (apiKey && !apiKey.startsWith('re_placeholder')) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: NEWS_SENDER,
            to: [testEmail],
            subject: `[TEST] ${subject}`,
            html,
          }),
        });
      }
      return NextResponse.json({ success: true, message: `Test email dispatched to ${testEmail}` });
    }

    // Mode B: Broadcast to all active subscribers
    const { data: subscribers, error: subErr } = await sb
      .from('newsletter_subscribers')
      .select('email, unsubscribe_token')
      .eq('status', 'active');

    if (subErr || !subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active verified subscribers found' }, { status: 400 });
    }

    // Record campaign in database
    const { data: campaign } = await sb
      .from('newsletter_campaigns')
      .insert({
        title,
        subject,
        preview_text: previewText || null,
        content_html: contentHtml,
        status: 'sending',
        recipients_count: subscribers.length,
      })
      .select()
      .single();

    // Async batch dispatch
    (async () => {
      let sentCount = 0;
      for (const sub of subscribers) {
        const unsubsUrl = `${BASE_URL}/api/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;
        const emailHtml = wrapPromoEmail(title, contentHtml, callToAction, unsubsUrl);

        try {
          if (apiKey && !apiKey.startsWith('re_placeholder')) {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: NEWS_SENDER,
                to: [sub.email],
                subject,
                html: emailHtml,
              }),
            });
          }
          sentCount++;
        } catch (e) {
          console.error(`[Promo Dispatch Error] ${sub.email}:`, e);
        }
      }

      if (campaign?.id) {
        await sb
          .from('newsletter_campaigns')
          .update({
            status: 'sent',
            recipients_count: sentCount,
            sent_at: new Date().toISOString(),
          })
          .eq('id', campaign.id);
      }
    })();

    return NextResponse.json({
      success: true,
      message: `Promotional broadcast initiated to ${subscribers.length} active subscribers.`,
      campaignId: campaign?.id,
    });
  } catch (err: any) {
    console.error('[Promotions POST Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
