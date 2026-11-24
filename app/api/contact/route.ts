import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/schemas/contact';
import { db } from '@/lib/db';
import { platformEmails } from '@/lib/email';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Honeypot check: If bot filled the hidden honeypot, simulate success without dispatching email
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      console.log('[Contact Honeypot Triggered] Silently discarding spam bot submission.');
      return NextResponse.json({
        success: true,
        message: 'Your inquiry has been received. Our team will get back to you within 24 hours.',
      });
    }

    // 2. Strict Zod Validation
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const payload = validation.data;
    const entry = await db.saveContactMessage(payload);

    // 3. Dispatch Emails (From support@thehrsports.com, Reply-To: customer)
    // - Forwards to Support Inbox
    // - Sends receipt confirmation to visitor
    try {
      await platformEmails.handleContactSubmission(
        {
          name: payload.name,
          email: payload.email,
          phone: payload.phone || undefined,
          country: payload.country || undefined,
          message: payload.message,
        },
        entry.id
      );
    } catch (emailErr) {
      console.error('[Contact Email Dispatch Error]:', emailErr);
    }

    // 4. In-Dashboard Realtime Notification for Factory Staff
    try {
      const adminClient = createAdminClient();
      await adminClient.from('notifications').insert([
        {
          target_role: 'owner',
          event_type: 'contact_message',
          title: `Contact Desk: ${payload.name}`,
          message: `New message from ${payload.name} (${payload.email}): "${payload.message.substring(0, 100)}..."`,
          customer_name: payload.name,
          is_urgent: false,
        },
        {
          target_role: 'hamza',
          event_type: 'contact_message',
          title: `Contact Desk: ${payload.name}`,
          message: `New message from ${payload.name} (${payload.email}): "${payload.message.substring(0, 100)}..."`,
          customer_name: payload.name,
          is_urgent: false,
        },
      ]);
    } catch (notifErr) {
      console.warn('[Contact Dashboard Notification Warning]:', notifErr);
    }

    return NextResponse.json({
      success: true,
      id: entry.id,
      message: 'Your inquiry has been received. Our team will get back to you within 24 hours.',
    });
  } catch (error: any) {
    console.error('Error handling /api/contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
