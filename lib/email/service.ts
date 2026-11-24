import { createAdminClient } from '@/lib/supabase/server';
import { EMAIL_CONFIG, EMAIL_SENDERS } from './config';
import { htmlToPlainText } from './layout';

export interface EmailAttachment {
  filename: string;
  content?: string; // base64 string
  path?: string;    // url or file path
}

export interface SendEmailOptions {
  emailType: string;
  sender: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  relatedId?: string;
  idempotencyKey?: string;
  attachments?: EmailAttachment[];
  metadata?: Record<string, any>;
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  duplicate?: boolean;
  simulated?: boolean;
  error?: string;
}

/**
 * Enterprise Email Delivery Service with Idempotency and Audit Logging
 */
export async function sendPlatformEmail(options: SendEmailOptions): Promise<SendEmailResponse> {
  const {
    emailType,
    sender,
    to,
    subject,
    html,
    replyTo,
    relatedId,
    idempotencyKey,
    attachments,
    metadata = {},
  } = options;

  const recipientStr = Array.isArray(to) ? to.join(', ') : to;
  const apiKey = process.env.RESEND_API_KEY;

  // 1. Idempotency Check: prevent duplicate email sends on retries / double-clicks
  let supabaseAdmin: any = null;
  try {
    supabaseAdmin = createAdminClient();
  } catch (err) {
    console.warn('[EmailService] Supabase admin client unavailable for email log:', err);
  }

  if (idempotencyKey && supabaseAdmin) {
    try {
      const { data: existingLog } = await supabaseAdmin
        .from('email_log')
        .select('id, status, provider_message_id')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existingLog && existingLog.status === 'sent') {
        console.log(`[EmailService] Idempotency match: Email ${idempotencyKey} already sent (${existingLog.provider_message_id}). Skipping duplicate.`);
        return {
          success: true,
          messageId: existingLog.provider_message_id,
          duplicate: true,
        };
      }
    } catch (checkErr) {
      console.warn('[EmailService] Error checking idempotency:', checkErr);
    }
  }

  // 2. Simulation fallback if no Resend API key is present
  if (!apiKey || apiKey.startsWith('re_placeholder') || apiKey === '') {
    console.log(`[EmailService Simulated] From: ${sender} | To: ${recipientStr} | Subject: "${subject}" (Type: ${emailType})`);
    
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('email_log').insert({
          email_type: emailType,
          sender,
          recipient: recipientStr,
          subject,
          related_id: relatedId || null,
          idempotency_key: idempotencyKey || null,
          status: 'simulated',
          provider_message_id: `sim_${Date.now()}`,
          metadata,
        });
      } catch {}
    }

    return {
      success: true,
      simulated: true,
      messageId: `sim_${Date.now()}`,
    };
  }

  // 3. Dispatch via Resend API
  try {
    const text = htmlToPlainText(html);

    const payload: Record<string, any> = {
      from: sender,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    };

    if (replyTo) {
      payload.reply_to = replyTo;
    }

    if (attachments && attachments.length > 0) {
      payload.attachments = attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
        path: att.path,
      }));
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errStr = JSON.stringify(data);
      console.error(`[EmailService Delivery Error] ${emailType} to ${recipientStr}:`, data);

      if (supabaseAdmin) {
        try {
          await supabaseAdmin.from('email_log').insert({
            email_type: emailType,
            sender,
            recipient: recipientStr,
            subject,
            related_id: relatedId || null,
            idempotency_key: idempotencyKey || null,
            status: 'failed',
            error: errStr,
            metadata,
          });
        } catch {}
      }

      return { success: false, error: errStr };
    }

    // 4. Record successful dispatch in email_log
    const messageId = data.id;
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('email_log').insert({
          email_type: emailType,
          sender,
          recipient: recipientStr,
          subject,
          related_id: relatedId || null,
          idempotency_key: idempotencyKey || null,
          status: 'sent',
          provider_message_id: messageId,
          metadata,
        });
      } catch (logErr) {
        console.warn('[EmailService] Failed to insert email_log:', logErr);
      }
    }

    return { success: true, messageId };
  } catch (netErr: any) {
    const errMsg = netErr?.message || 'Network error while contacting Resend';
    console.error(`[EmailService Network Error] ${emailType}:`, netErr);

    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('email_log').insert({
          email_type: emailType,
          sender,
          recipient: recipientStr,
          subject,
          related_id: relatedId || null,
          idempotency_key: idempotencyKey || null,
          status: 'failed',
          error: errMsg,
          metadata,
        });
      } catch {}
    }

    return { success: false, error: errMsg };
  }
}

/**
 * Resolve the owner-configured Support recipient from hrsg_settings
 */
export async function getSupportRecipientEmail(): Promise<string> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('hrsg_settings')
      .select('value')
      .eq('key', 'support_email_recipient')
      .maybeSingle();

    if (data?.value && data.value.includes('@')) {
      return data.value.trim();
    }
  } catch (err) {
    console.warn('[EmailService] Could not read support_email_recipient from settings:', err);
  }

  return EMAIL_CONFIG.DEFAULT_SUPPORT_RECIPIENT;
}
