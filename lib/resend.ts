import { QuoteInquiryPayload, ContactMessagePayload } from '@/types';
import { SITE_CONFIG } from './constants';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export const emailService = {
  /**
   * Send Client Quote Confirmation & Proforma Intake Summary
   */
  async sendQuoteConfirmation(
    payload: QuoteInquiryPayload,
    referenceId: string
  ): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'quotes@hrsports.com';

    if (!apiKey) {
      console.log(`[Resend Simulated] Sent QuoteConfirmation to ${payload.contactEmail} (Ref: ${referenceId})`);
      return { success: true, simulated: true, messageId: `sim_${Date.now()}` };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `HR Sports Manufacturing <${fromEmail}>`,
          to: [payload.contactEmail],
          subject: `Quote Intake Confirmed — Ref #${referenceId} | HR Sports OEM`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #111111; background-color: #ffffff; border: 1px solid #27272A;">
              <div style="border-bottom: 2px solid #111111; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0;">HR SPORTS</h1>
                <p style="font-size: 12px; color: #52525B; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.05em;">OEM & Technical Apparel Manufacturing</p>
              </div>

              <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">Dear <strong>${payload.companyName || payload.order_by || 'Valued'}</strong> Team,</p>
              
              <p style="font-size: 14px; line-height: 1.6; color: #52525B; margin-bottom: 24px;">
                We have received your custom manufacturing inquiry. Your production inquiry has been assigned reference number <strong>${referenceId}</strong> and forwarded to our master textile engineering and pattern team.
              </p>

              <div style="background-color: #F5F5F0; border: 1px solid #E4E4E7; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0; color: #111111;">Inquiry Specifications</h3>
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #E4E4E7;">
                    <td style="padding: 8px 0; color: #52525B;">Garment Type:</td>
                    <td style="padding: 8px 0; font-weight: 600; text-align: right;">${payload.garmentType}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #E4E4E7;">
                    <td style="padding: 8px 0; color: #52525B;">Order Quantity:</td>
                    <td style="padding: 8px 0; font-weight: 600; text-align: right;">${payload.volumeMOQ} units</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #E4E4E7;">
                    <td style="padding: 8px 0; color: #52525B;">Fabric Selection:</td>
                    <td style="padding: 8px 0; font-weight: 600; text-align: right;">${payload.materialVariant}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #E4E4E7;">
                    <td style="padding: 8px 0; color: #52525B;">Target Delivery:</td>
                    <td style="padding: 8px 0; font-weight: 600; text-align: right;">${payload.targetDeliveryDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #52525B;">Design Assets:</td>
                    <td style="padding: 8px 0; font-weight: 600; text-align: right;">${payload.uploadMode === 'file' ? `${payload.designFiles?.length || 0} Files Attached` : 'Design Assistance Requested'}</td>
                  </tr>
                </table>
              </div>

              <div style="border-left: 3px solid #111111; padding-left: 16px; margin-bottom: 24px;">
                <p style="font-size: 13px; color: #111111; margin: 0; font-weight: 600;">Next Steps in Factory Queue:</p>
                <p style="font-size: 13px; color: #52525B; margin: 4px 0 0 0;">
                  A dedicated Senior Account Engineer will review your files, verify fabric shrinkage tolerances, and deliver your comprehensive commercial proforma quote with unit pricing within <strong>24 business hours</strong>.
                </p>
              </div>

              <div style="border-top: 1px solid #E4E4E7; padding-top: 16px; font-size: 12px; color: #71717A;">
                <p style="margin: 0;">HR Sports International Ltd. • ${SITE_CONFIG.address}</p>
                <p style="margin: 4px 0 0 0;">Questions? Contact us directly at <a href="mailto:${SITE_CONFIG.email}" style="color: #111111;">${SITE_CONFIG.email}</a> or +1 (800) 582-9174.</p>
              </div>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: JSON.stringify(errorData) };
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('Error sending quote confirmation email:', err);
      return { success: false, error: err?.message || 'Email delivery failed' };
    }
  },

  /**
   * Send Admin Factory Notification
   */
  async sendAdminNotification(
    payload: QuoteInquiryPayload,
    referenceId: string
  ): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'procurement@hrsports.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'quotes@hrsports.com';

    if (!apiKey) {
      console.log(`[Resend Simulated] Sent Admin Notification to ${adminEmail} for Ref: ${referenceId}`);
      return { success: true, simulated: true, messageId: `admin_sim_${Date.now()}` };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `HR Sports Quote Intake <${fromEmail}>`,
          to: [adminEmail],
          subject: `🚨 NEW B2B INQUIRY [${referenceId}] — ${payload.companyName || payload.order_by || 'Direct Inquiry'} (${payload.volumeMOQ} pcs)`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>New Manufacturing Inquiry: ${payload.companyName || payload.order_by || 'Direct Inquiry'}</h2>
              <p><strong>Reference ID:</strong> ${referenceId}</p>
              <p><strong>Contact Email:</strong> ${payload.contactEmail}</p>
              <p><strong>Phone:</strong> ${payload.contactPhone || 'N/A'}</p>
              <p><strong>Garment:</strong> ${payload.garmentType}</p>
              <p><strong>Quantity:</strong> ${payload.volumeMOQ} units</p>
              <p><strong>Fabric:</strong> ${payload.materialVariant}</p>
              <p><strong>Target Timeline:</strong> ${payload.targetDeliveryDate}</p>
              <p><strong>Upload Mode:</strong> ${payload.uploadMode}</p>
              <p><strong>Notes:</strong> ${payload.designNotes || 'None'}</p>
              <p><strong>Files:</strong> ${payload.designFiles?.map(f => `${f.fileName} (${(f.sizeBytes / 1024 / 1024).toFixed(2)} MB, ${f.kind})`).join(', ') || 'None'}</p>
            </div>
          `,
        }),
      });

      return { success: res.ok };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * Send Welcome Email to New Newsletter Subscribers
   */
  async sendNewsletterWelcome(email: string): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'newsletter@hrsports.com';

    if (!apiKey) {
      console.log(`[Resend Simulated] Sent Newsletter Welcome to ${email}`);
      return { success: true, simulated: true };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `HR Sports Textile Intelligence <${fromEmail}>`,
          to: [email],
          subject: 'Welcome to HR Sports — Global Textile Insights & OEM Manufacturing Reports',
          html: `
            <div style="font-family: sans-serif; padding: 24px; max-width: 600px; border: 1px solid #27272A;">
              <h2 style="margin-top:0;">Welcome to HR Sports Technical Updates</h2>
              <p>Thank you for subscribing. You will receive our monthly B2B textile intelligence briefings covering fabric GSM innovations, sublimation standards, and international freight rate forecasts.</p>
            </div>
          `,
        }),
      });
      return { success: res.ok };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * Send General Contact FAQ Notification
   */
  async sendContactMessageNotification(payload: ContactMessagePayload): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'support@hrsports.com';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@hrsports.com';

    if (!apiKey) {
      console.log(`[Resend Simulated] Sent Contact Message from ${payload.email} (${payload.name}, Phone: ${payload.phone || 'N/A'})`);
      return { success: true, simulated: true };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `HR Sports Contact Desk <${fromEmail}>`,
          to: [adminEmail],
          subject: `📩 General Contact Message from ${payload.name}`,
          html: `
            <p><strong>From:</strong> ${payload.name} &lt;${payload.email}&gt;</p>
            <p><strong>Phone:</strong> ${payload.phone || 'N/A'}</p>
            ${payload.country ? `<p><strong>Country:</strong> ${payload.country}</p>` : ''}
            <p><strong>Message / Comment:</strong></p>
            <p style="white-space: pre-wrap; background: #F5F5F0; padding: 12px; border: 1px solid #E4E4E7;">${payload.message}</p>
          `,
        }),
      });
      return { success: res.ok };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },
};
