import { renderEmailLayout } from '../layout';

export interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  message: string;
}

/**
 * Forward contact form submission to support inbox
 * Sent from support@thehrsports.com with Reply-To set to the visitor's email.
 */
export function renderContactAdminForwardEmail(data: ContactMessageData): string {
  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      New website contact form inquiry
    </h1>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 18px; margin-bottom: 20px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B; width: 30%;">From Name:</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B;">Email Address:</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">
            <a href="mailto:${data.email}" style="color: #059669; text-decoration: underline;">${data.email}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B;">Phone / WhatsApp:</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.phone || 'Not provided'}</td>
        </tr>
        ${data.country ? `
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 8px 0; color: #64748B;">Country:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.country}</td>
          </tr>
        ` : ''}
      </table>
    </div>

    <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0; color: #0F172A;">
      Visitor's Message:
    </h3>
    <div style="background-color: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 6px; padding: 16px; font-size: 14px; color: #18181B; line-height: 1.6; white-space: pre-wrap;">
${data.message}
    </div>

    <p style="font-size: 12px; color: #71717A; margin-top: 16px;">
      Tip: You can hit <strong>Reply</strong> in your email client to respond directly to ${data.name} (${data.email}).
    </p>
  `;

  return renderEmailLayout({
    title: `Contact Message from ${data.name} | HR Sports`,
    previewText: `Message from ${data.name}: "${data.message.substring(0, 80)}..."`,
    contentHtml,
    isNoReply: false,
    isSupport: true,
  });
}

/**
 * Auto-confirmation sent to the visitor letting them know their message was received.
 */
export function renderContactVisitorConfirmationEmail(data: ContactMessageData): string {
  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      Thank you for reaching out to HR Sports
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${data.name}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 16px 0; color: #3F3F46; line-height: 1.6;">
      We have received your message. A member of our customer support team is reviewing your inquiry and will get back to you within 24 business hours.
    </p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <h3 style="font-size: 13px; font-weight: 700; margin: 0 0 8px 0; color: #0F172A;">
        Copy of your message:
      </h3>
      <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.5; white-space: pre-wrap;">
${data.message}
      </p>
    </div>

    <p style="font-size: 14px; color: #3F3F46; line-height: 1.6; margin: 16px 0 0 0;">
      If you need to add any details or attachments, simply reply directly to this email.
    </p>
  `;

  return renderEmailLayout({
    title: `We received your message | HR Sports Support`,
    previewText: `Thank you for contacting HR Sports. We will reply within 24 hours.`,
    contentHtml,
    isNoReply: false,
    isSupport: true,
  });
}
