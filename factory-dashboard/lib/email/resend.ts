import { getAdminClient } from '@/lib/supabase/admin';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  duplicate?: boolean;
  simulated?: boolean;
  error?: string;
}

const SENDERS = {
  INQUIRY: process.env.EMAIL_SENDER_INQUIRY || 'HR Sports <inquiry@thehrsports.com>',
  ORDER: process.env.EMAIL_SENDER_ORDER || 'HR Sports <order@thehrsports.com>',
  SUPPORT: process.env.EMAIL_SENDER_SUPPORT || 'HR Sports <support@thehrsports.com>',
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thehrsports.com';
const PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'https://thehrsports.com/portal';
const LOGO_URL = `${BASE_URL}/logo.png`;

/**
 * Standard branded wrapper for HR Sports factory automated emails (Cool Slate & Cobalt style)
 */
function wrapEmail(title: string, bodyContent: string, actionButton?: { label: string; url: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; }
    .email-container { max-width: 600px; margin: 32px auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { padding: 24px 32px 20px 32px; border-bottom: 1px solid #F1F5F9; background-color: #FFFFFF; }
    .header-logo { height: 32px; vertical-align: middle; }
    .tagline { font-size: 12px; color: #64748B; margin: 4px 0 0 0; font-weight: 500; }
    .content { padding: 28px 32px; font-size: 14px; line-height: 1.6; color: #334155; }
    .btn { display: inline-block; background-color: #1D4ED8; color: #FFFFFF !important; font-size: 13px; font-weight: 700; padding: 12px 24px; text-decoration: none; border-radius: 10px; margin: 16px 0; box-shadow: 0 2px 4px rgba(29, 78, 216, 0.2); }
    .footer { padding: 20px 32px; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; line-height: 1.5; }
  </style>
</head>
<body>
  <div style="width: 100%; background-color: #F4F6F9; padding: 24px 10px;">
    <div class="email-container">
      <div class="header">
        <a href="${BASE_URL}" target="_blank" style="text-decoration: none;">
          <img src="${LOGO_URL}" alt="HR Sports" class="header-logo" border="0" onerror="this.style.display='none'">
          <span style="font-size: 20px; font-weight: 900; color: #0F172A; vertical-align: middle; margin-left: 6px; letter-spacing: -0.5px;">HR SPORTS</span>
        </a>
        <p class="tagline">Custom Sports Apparel & Direct Factory Manufacturing</p>
      </div>
      <div class="content">
        ${bodyContent}
        ${actionButton ? `<div style="margin: 20px 0;"><a href="${actionButton.url}" class="btn" target="_blank">${actionButton.label} &rarr;</a></div>` : ''}
      </div>
      <div class="footer">
        <div style="padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
          <strong>Order Tracking Notice:</strong> You received this email because you placed an order with HR Sports. You can also view live photos and tracking in your <a href="${PORTAL_URL}" style="color: #1D4ED8; font-weight: 700; text-decoration: none;">Client Portal</a>.
        </div>
        <div>HR Sports &bull; Website: <a href="${BASE_URL}" style="color: #64748B;">thehrsports.com</a> | Email: <a href="mailto:support@thehrsports.com" style="color: #64748B;">support@thehrsports.com</a></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const emailNotifications = {
  /**
   * Core dispatch helper with Resend API
   */
  async sendEmail(options: {
    sender: string;
    to: string;
    subject: string;
    html: string;
    emailType: string;
    relatedId?: string;
    idempotencyKey?: string;
  }): Promise<SendEmailResult> {
    const resendKey = process.env.RESEND_API_KEY;

    // Local / dev fallback: if no API key, log to console safely
    if (!resendKey) {
      console.log(`[Email Simulated (No RESEND_API_KEY)] To: ${options.to} | Subject: ${options.subject}`);
      return { success: true, simulated: true };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: options.sender,
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[Resend Email Error]:', data);
        return { success: false, error: data.message || 'Failed to send email' };
      }

      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('[Email Network Error]:', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  },

  /**
   * 1. 3D Design Mockup Ready for Client Approval
   */
  async sendDesignMockupReady(params: {
    to: string;
    clientName: string;
    referenceId: string;
    garmentType: string;
    designerName: string;
    portalUrl?: string;
  }): Promise<SendEmailResult> {
    const portalUrl = params.portalUrl || `${PORTAL_URL}/inquiries/${params.referenceId}`;
    const bodyContent = `
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">3D Design Proof Ready for Review</h2>
      <p>Hello <strong>${params.clientName}</strong>,</p>
      <p>Our designer <strong>${params.designerName}</strong> has prepared your 3D mockup and pattern specifications for Inquiry <strong>#${params.referenceId}</strong> (${params.garmentType}).</p>
      <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 16px; margin: 18px 0;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #0F172A;">Client Review & Approval</h4>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #475569;">Please review the design in your client portal. Once approved, our team will release your formal price quotation.</p>
        <a href="${portalUrl}" class="btn" target="_blank" style="display: inline-block; background-color: #1D4ED8; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Review & Approve Design &rarr;</a>
      </div>
    `;

    const html = wrapEmail(`Design Ready — Ref #${params.referenceId}`, bodyContent);
    return this.sendEmail({
      sender: SENDERS.INQUIRY,
      to: params.to,
      subject: `Your 3D Design Proof is Ready — Ref #${params.referenceId} | HR Sports`,
      html,
      emailType: 'design_proof_ready',
      relatedId: params.referenceId,
      idempotencyKey: `dash_proof_${params.referenceId}`,
    });
  },

  /**
   * 2. Commercial Quotation Issued
   */
  async sendQuotationIssued(params: {
    to: string;
    clientName: string;
    referenceId: string;
    garmentType: string;
    quantity: number;
    unitPrice: string;
    validUntilIso?: string;
  }): Promise<SendEmailResult> {
    const portalUrl = `${PORTAL_URL}/quotes/${params.referenceId}`;
    const bodyContent = `
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Price Quotation Issued</h2>
      <p>Hello <strong>${params.clientName}</strong>,</p>
      <p>Our pricing desk has issued your formal commercial quote for Inquiry <strong>#${params.referenceId}</strong>.</p>
      <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 18px; margin: 18px 0;">
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 6px 0; color: #64748B;">Garment:</td><td style="font-weight: 700; text-align: right; color: #0F172A;">${params.garmentType}</td></tr>
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 6px 0; color: #64748B;">Quantity:</td><td style="font-weight: 700; text-align: right; color: #0F172A;">${params.quantity} units</td></tr>
          <tr><td style="padding: 8px 0; color: #64748B; font-size: 14px;">Quoted Price:</td><td style="font-weight: 800; text-align: right; font-size: 18px; color: #059669;">${params.unitPrice}</td></tr>
        </table>
        <div style="margin-top: 14px;">
          <a href="${portalUrl}" class="btn" target="_blank" style="display: inline-block; background-color: #1D4ED8; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 10px 20px; text-decoration: none; border-radius: 6px;">View & Accept Quote &rarr;</a>
        </div>
      </div>
    `;

    const html = wrapEmail(`Price Quote Issued — Ref #${params.referenceId}`, bodyContent);
    return this.sendEmail({
      sender: SENDERS.INQUIRY,
      to: params.to,
      subject: `Price Quotation Ready — Ref #${params.referenceId} | HR Sports`,
      html,
      emailType: 'quotation_issued',
      relatedId: params.referenceId,
      idempotencyKey: `dash_quote_${params.referenceId}`,
    });
  },

  /**
   * 3. New Staff Message Notification
   */
  async sendNewStaffMessage(params: {
    to: string;
    clientName: string;
    referenceId: string;
    staffName?: string;
    senderName?: string;
    messageSnippet?: string;
    messageText?: string;
  }): Promise<SendEmailResult> {
    const sender = params.staffName || params.senderName || 'Our Team';
    const textSnippet = params.messageSnippet || params.messageText || 'You have received a new update on your inquiry.';
    const portalUrl = `${PORTAL_URL}/inquiries/${params.referenceId}`;
    const bodyContent = `
      <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">New Message from Factory Team</h2>
      <p>Hello <strong>${params.clientName}</strong>,</p>
      <p><strong>${sender}</strong> sent you a message regarding your Inquiry <strong>#${params.referenceId}</strong>:</p>
      <div style="background-color: #F8FAFC; border-left: 4px solid #1D4ED8; border: 1px solid #CBD5E1; border-radius: 6px; padding: 16px; margin: 18px 0; font-size: 14px; color: #1E293B; font-style: italic;">
        "${textSnippet}"
      </div>
      <div style="margin: 20px 0;">
        <a href="${portalUrl}" class="btn" target="_blank" style="display: inline-block; background-color: #1D4ED8; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Open Chat in Portal &rarr;</a>
      </div>
    `;

    const html = wrapEmail(`New Message on #${params.referenceId}`, bodyContent);
    return this.sendEmail({
      sender: SENDERS.SUPPORT,
      to: params.to,
      subject: `New Message from ${sender} — Ref #${params.referenceId} | HR Sports`,
      html,
      emailType: 'staff_chat_message',
      relatedId: params.referenceId,
    });
  },

  /**
   * 4. Automated Factory Floor Progress Update Email
   * Triggered whenever an order advances through Cutting, Printing, Stitching, QC, Packing, or Dispatch.
   * Includes optional photo proof and optional custom notes from the shop floor.
   */
  async sendOrderStageUpdate(params: {
    to: string;
    clientName?: string;
    partyName?: string;
    jobNo: number | string;
    product: string;
    quantity: number;
    stageKey: string;
    notes?: string | null;
    photoUrls?: string[] | null;
    trackingCarrier?: string | null;
    trackingNumber?: string | null;
  }): Promise<SendEmailResult> {
    // Stage human-readable titles and plain descriptions (Zero Buzzwords)
    const stageInfo: Record<string, { title: string; desc: string }> = {
      cutting: {
        title: 'Fabric Cutting Underway',
        desc: 'Your fabric rolls have been inspected and precision-cut to your team’s size measurements.',
      },
      printing: {
        title: 'Sublimation Printing & Heat Press',
        desc: 'Colors, team logos, and player numbers are being heat-transferred into the fabric fibers.',
      },
      heattransfer: {
        title: 'Heat Transfer Pressing',
        desc: 'Badges and sponsor crests are being pressed into place.',
      },
      stitching: {
        title: 'Assembly & Stitching',
        desc: 'Our tailors are stitching and sewing your garments together on the production line.',
      },
      qc: {
        title: 'Quality Inspection (QC)',
        desc: 'Our quality team is measuring pieces, checking collar seams, and verifying print sharpness.',
      },
      quality: {
        title: 'Quality Inspection (QC)',
        desc: 'Our quality team is measuring pieces, checking collar seams, and verifying print sharpness.',
      },
      packing: {
        title: 'Packing & Final Press',
        desc: 'Garments have passed inspection, are being steam pressed, poly-bagged, and placed into shipping boxes.',
      },
      dispatch: {
        title: 'Dispatched & Handed to Courier',
        desc: 'Your order has left our factory and is in transit to your delivery address.',
      },
    };

    const normKey = params.stageKey.toLowerCase().replace(/[^a-z]/g, '');
    const currentInfo = stageInfo[normKey] || {
      title: `${params.stageKey} Stage Completed`,
      desc: 'Your order has advanced to the next production step.',
    };

    const isDispatched = normKey === 'dispatch';
    const portalUrl = `${PORTAL_URL}/orders/${params.jobNo}`;

    // Clean 5-Stage Stepper for Email
    const stagesList = [
      { key: 'cutting', label: '1. Cutting' },
      { key: 'printing', label: '2. Printing' },
      { key: 'stitching', label: '3. Stitching' },
      { key: 'qc', label: '4. Quality QC' },
      { key: 'dispatch', label: '5. Dispatch' },
    ];

    let effectiveIdx = 0;
    if (normKey === 'cutting') effectiveIdx = 0;
    else if (normKey === 'printing' || normKey === 'heattransfer') effectiveIdx = 1;
    else if (normKey === 'stitching') effectiveIdx = 2;
    else if (normKey === 'qc' || normKey === 'quality' || normKey === 'packing') effectiveIdx = 3;
    else if (normKey === 'dispatch') effectiveIdx = 4;

    const progressStepsHtml = stagesList.map((st, idx) => {
      const isPast = idx < effectiveIdx;
      const isCurr = idx === effectiveIdx;
      const icon = isPast ? '&#10003;' : isCurr ? '&bull;' : String(idx + 1);
      const bg = isPast ? '#10B981' : isCurr ? '#1D4ED8' : '#E2E8F0';
      const textCol = isPast || isCurr ? '#FFFFFF' : '#64748B';
      const labelCol = isCurr ? '#1D4ED8' : isPast ? '#059669' : '#94A3B8';

      return `
        <td style="text-align: center; padding: 0 4px; vertical-align: top;">
          <div style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: ${bg}; color: ${textCol}; font-size: 11px; font-weight: bold; margin-bottom: 4px;">
            ${icon}
          </div>
          <div style="font-size: 10px; color: ${labelCol}; font-weight: ${isCurr ? '700' : '500'}; line-height: 1.2;">
            ${st.label}
          </div>
        </td>
      `;
    }).join('');

    // Optional Notes Section (Only displayed if floor operator entered notes)
    const optionalNotesHtml = params.notes && params.notes.trim().length > 0 ? `
      <div style="margin-top: 14px; padding: 12px 14px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 4px;">
          Note from Factory Floor:
        </div>
        <div style="font-size: 13px; color: #0F172A; font-style: italic;">
          "${params.notes.trim()}"
        </div>
      </div>
    ` : '';

    // Optional Photos Gallery (Only displayed if photos were uploaded)
    const optionalPhotosHtml = params.photoUrls && params.photoUrls.length > 0 ? `
      <div style="margin-top: 18px;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 8px;">
          Factory Proof Photos (${params.photoUrls.length}):
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${params.photoUrls.map((url) => `
            <a href="${url}" target="_blank" style="display: inline-block; text-decoration: none; border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E1; margin-right: 8px; margin-bottom: 8px;">
              <img src="${url}" alt="Production photo" width="130" height="130" style="object-fit: cover; display: block;" />
            </a>
          `).join('')}
        </div>
      </div>
    ` : '';

    // Courier Tracking Details (For Dispatch)
    const courierHtml = isDispatched && (params.trackingNumber || params.trackingCarrier) ? `
      <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 16px; margin: 18px 0;">
        <div style="font-size: 11px; font-weight: 800; color: #065F46; text-transform: uppercase; margin-bottom: 6px;">
          Air Express Delivery Details
        </div>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          ${params.trackingCarrier ? `<tr><td style="padding: 3px 0; color: #047857;">Courier Service:</td><td style="font-weight: 700; text-align: right; color: #064E3B;">${params.trackingCarrier}</td></tr>` : ''}
          ${params.trackingNumber ? `<tr><td style="padding: 3px 0; color: #047857;">Tracking Number:</td><td style="font-weight: 800; font-family: monospace; text-align: right; color: #064E3B; font-size: 14px;">${params.trackingNumber}</td></tr>` : ''}
        </table>
      </div>
    ` : '';

    const bodyContent = `
      <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 0; letter-spacing: -0.3px;">
        ${isDispatched ? 'Your Order Is on Its Way!' : `Production Update: ${currentInfo.title}`}
      </h2>
      <p style="font-size: 14px; color: #475569; margin: 6px 0 16px 0;">
        Hello <strong>${params.clientName || params.partyName || 'Customer'}</strong>,
      </p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Here is a quick production update on Order <strong>#${params.jobNo}</strong> (${params.product}, ${params.quantity} pieces).
      </p>

      <!-- Stepper Progress Bar -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            ${progressStepsHtml}
          </tr>
        </table>
      </div>

      <!-- Current Station Details Card -->
      <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid #1D4ED8; border-radius: 8px; padding: 16px; margin: 18px 0;">
        <div style="font-size: 11px; text-transform: uppercase; color: #1D4ED8; font-weight: 800; letter-spacing: 0.5px;">Current Station</div>
        <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 4px 0 6px 0;">${currentInfo.title}</div>
        <div style="font-size: 13px; color: #475569; line-height: 1.5;">${currentInfo.desc}</div>

        ${optionalNotesHtml}
        ${optionalPhotosHtml}
      </div>

      ${courierHtml}

      <div style="margin: 24px 0 10px 0; text-align: left;">
        <a href="${portalUrl}" class="btn" target="_blank" style="display: inline-block; background-color: #1D4ED8; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Open Live Order Tracking &rarr;
        </a>
      </div>
    `;

    const html = wrapEmail(`Order Update: ${currentInfo.title} — Job #${params.jobNo}`, bodyContent);

    return this.sendEmail({
      sender: SENDERS.ORDER,
      to: params.to,
      subject: `Order Update: ${currentInfo.title} — Job #${params.jobNo} | HR Sports`,
      html,
      emailType: 'order_stage_update',
      relatedId: String(params.jobNo),
      idempotencyKey: `dash_order_${params.jobNo}_${normKey}_${Date.now()}`,
    });
  },
};
