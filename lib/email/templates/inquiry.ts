import { EMAIL_CONFIG } from '../config';
import { renderEmailLayout } from '../layout';

export interface InquiryConfirmationData {
  referenceId: string;
  clientName: string;
  contactEmail: string;
  garmentType: string;
  quantity: number;
  fabricSpec: string;
  targetDate?: string;
  attachedFilesCount: number;
  expiringFileLinks?: Array<{ name: string; url: string; sizeMb: string }>;
}

export function renderInquiryConfirmationEmail(data: InquiryConfirmationData): string {
  const portalUrl = `${EMAIL_CONFIG.CLIENT_PORTAL_URL}/inquiries/${data.referenceId}`;

  const filesHtml = data.expiringFileLinks && data.expiringFileLinks.length > 0
    ? `
      <div style="margin-top: 16px;">
        <p style="font-size: 13px; font-weight: 600; color: #18181B; margin: 0 0 8px 0;">Attached Production & Tech Pack Files:</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #3F3F46;">
          ${data.expiringFileLinks.map((f) => `
            <li style="margin-bottom: 6px;">
              <a href="${f.url}" target="_blank" style="color: #059669; font-weight: 600; text-decoration: underline;">
                ${f.name}
              </a>
              <span style="color: #71717A; font-size: 12px;"> (${f.sizeMb} MB &bull; Secure 7-day link)</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `
    : data.attachedFilesCount > 0
    ? `<p style="font-size: 13px; color: #3F3F46; margin-top: 14px;"><strong>Attached Files:</strong> ${data.attachedFilesCount} tech pack and design files are attached directly to this email.</p>`
    : '';

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      We have received your custom apparel inquiry
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${data.clientName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px 0; color: #3F3F46;">
      Thank you for submitting your custom sportswear requirements to HR Sports. Your inquiry is logged in our manufacturing queue with Reference Number: <strong style="color: #111111; font-family: monospace; font-size: 15px;">#${data.referenceId}</strong>.
    </p>

    <div class="notice-box" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 18px;">
      <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 12px 0; color: #0F172A;">
        Inquiry Summary
      </h3>
      <table class="spec-table" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td class="label" style="padding: 8px 0; color: #64748B;">Reference ID:</td>
          <td class="val" style="padding: 8px 0; font-weight: 700; text-align: right; color: #0F172A;">#${data.referenceId}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td class="label" style="padding: 8px 0; color: #64748B;">Garment Type:</td>
          <td class="val" style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.garmentType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td class="label" style="padding: 8px 0; color: #64748B;">Order Quantity:</td>
          <td class="val" style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.quantity.toLocaleString()} units</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td class="label" style="padding: 8px 0; color: #64748B;">Fabric Selection:</td>
          <td class="val" style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.fabricSpec || 'Standard Technical Poly'}</td>
        </tr>
        ${data.targetDate ? `
          <tr>
            <td class="label" style="padding: 8px 0; color: #64748B;">Target Delivery:</td>
            <td class="val" style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.targetDate}</td>
          </tr>
        ` : ''}
      </table>
      ${filesHtml}
    </div>

    <p style="font-size: 14px; color: #3F3F46; line-height: 1.6; margin: 20px 0;">
      Our pattern and operations desk is reviewing your specifications and tech files. We will deliver your digital vector mockups and unit pricing within <strong>24 business hours</strong>.
    </p>
  `;

  return renderEmailLayout({
    title: `Inquiry Received — Ref #${data.referenceId} | HR Sports`,
    previewText: `Your manufacturing inquiry #${data.referenceId} has been received.`,
    contentHtml,
    isNoReply: true,
    portalLink: {
      url: portalUrl,
      label: 'Open Inquiry in Client Portal',
    },
  });
}

export function renderDesignProofReadyEmail(params: {
  clientName: string;
  referenceId: string;
  garmentType: string;
  designerName: string;
}): string {
  const portalUrl = `${EMAIL_CONFIG.CLIENT_PORTAL_URL}/inquiries/${params.referenceId}`;

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      Your 3D design proof is ready for review
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${params.clientName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px 0; color: #3F3F46; line-height: 1.6;">
      Our pattern designer <strong>${params.designerName}</strong> has prepared your vector mockups and color codes for Inquiry <strong>#${params.referenceId}</strong> (${params.garmentType}).
    </p>

    <div class="notice-box" style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 18px; margin: 20px 0;">
      <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0; color: #0F172A;">
        Next Step: Client Approval
      </h3>
      <p style="font-size: 13px; color: #475569; margin: 0 0 16px 0; line-height: 1.5;">
        Please inspect the artwork, logo sizing, and seam alignment. Once you click approve in your portal, our accounts desk will calculate and release your formal quotation.
      </p>
      <a href="${portalUrl}" class="btn-primary" target="_blank" style="background-color: #111111; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 12px 22px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Review Proof & Approve Design &rarr;
      </a>
    </div>
  `;

  return renderEmailLayout({
    title: `3D Design Proof Ready — Ref #${params.referenceId} | HR Sports`,
    previewText: `Your design proof for #${params.referenceId} is ready for approval.`,
    contentHtml,
    isNoReply: true,
  });
}

export function renderDesignApprovalConfirmedEmail(params: {
  clientName: string;
  referenceId: string;
  garmentType: string;
}): string {
  const portalUrl = `${EMAIL_CONFIG.CLIENT_PORTAL_URL}/inquiries/${params.referenceId}`;

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      Design approved — Moving to commercial quotation
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${params.clientName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px 0; color: #3F3F46; line-height: 1.6;">
      Thank you for approving the digital artwork for Inquiry <strong>#${params.referenceId}</strong> (${params.garmentType}). Your design file has been locked for production and forwarded to our pricing desk.
    </p>

    <div class="notice-box" style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <p style="font-size: 13px; color: #065F46; margin: 0; font-weight: 600;">
        Artwork Status: Approved and Locked
      </p>
      <p style="font-size: 13px; color: #047857; margin: 4px 0 0 0;">
        Our accounts manager is calculating your final per-unit pricing based on fabric consumption and order volume.
      </p>
    </div>
  `;

  return renderEmailLayout({
    title: `Design Approved — Ref #${params.referenceId} | HR Sports`,
    previewText: `Design approved for #${params.referenceId}. Quotation is being prepared.`,
    contentHtml,
    isNoReply: true,
    portalLink: {
      url: portalUrl,
      label: 'View Inquiry in Portal',
    },
  });
}

export function renderQuotationIssuedEmail(params: {
  clientName: string;
  referenceId: string;
  garmentType: string;
  quantity: number;
  unitPrice: string;
  totalPrice?: string;
  validUntilIso: string;
  formattedExpiryText: string;
}): string {
  const portalUrl = `${EMAIL_CONFIG.CLIENT_PORTAL_URL}/quotes/${params.referenceId}`;
  const countdownGifUrl = `${EMAIL_CONFIG.APP_URL}/api/quote/countdown?expires=${encodeURIComponent(params.validUntilIso)}`;

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      Your formal commercial quote has been issued
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${params.clientName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px 0; color: #3F3F46; line-height: 1.6;">
      Our commercial desk has calculated your official factory quotation for Inquiry <strong>#${params.referenceId}</strong>.
    </p>

    <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B;">Garment Specification:</td>
          <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #0F172A;">${params.garmentType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B;">Order Volume:</td>
          <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #0F172A;">${params.quantity.toLocaleString()} units</td>
        </tr>
        <tr>
          <td style="padding: 10px 0 0 0; color: #64748B; font-size: 14px;">Quoted Unit Price:</td>
          <td style="padding: 10px 0 0 0; font-weight: 800; text-align: right; font-size: 20px; color: #059669;">${params.unitPrice}</td>
        </tr>
      </table>

      <!-- Dynamic Server-Generated Countdown GIF Timer -->
      <div style="margin: 22px 0 14px 0; text-align: center;">
        <img src="${countdownGifUrl}" alt="24-Hour Price Lock Countdown" width="360" height="64" style="max-width: 100%; height: auto; border-radius: 6px; display: inline-block;" />
      </div>

      <div style="text-align: center; font-size: 12px; color: #64748B; margin-bottom: 16px;">
        <strong>Price Lock Guaranteed Until:</strong> ${params.formattedExpiryText}
      </div>

      <div style="text-align: center;">
        <a href="${portalUrl}" class="btn-accent" target="_blank" style="background-color: #059669; color: #FFFFFF; font-size: 14px; font-weight: 700; padding: 13px 26px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Review & Lock Order in Portal &rarr;
        </a>
      </div>
    </div>

    <p style="font-size: 12px; color: #71717A; line-height: 1.5; margin: 16px 0 0 0;">
      Note: Raw yarn, sublimation dye, and international sea/air freight exchange rates are guaranteed for 24 hours from release. Locking your order secures your spot on the cutting floor.
    </p>
  `;

  return renderEmailLayout({
    title: `Commercial Quotation Issued — Ref #${params.referenceId} | HR Sports`,
    previewText: `Your quote for #${params.referenceId} is ready: ${params.unitPrice}/unit with 24-hour price lock.`,
    contentHtml,
    isNoReply: true,
  });
}

export function renderStaffMessageAlertEmail(params: {
  clientName: string;
  referenceId: string;
  senderName: string;
  messageText: string;
}): string {
  const portalUrl = `${EMAIL_CONFIG.CLIENT_PORTAL_URL}/inquiries/${params.referenceId}`;

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      New message regarding Inquiry #${params.referenceId}
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${params.clientName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 16px 0; color: #3F3F46;">
      <strong>${params.senderName}</strong> from HR Sports sent you a message:
    </p>

    <div style="background-color: #F8FAFC; border-left: 3px solid #111111; padding: 16px; font-size: 14px; color: #18181B; margin: 16px 0 24px 0; line-height: 1.6; border-radius: 0 6px 6px 0;">
      "${params.messageText}"
    </div>

    <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 6px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #92400E;">
      <strong>Replies by email are not monitored.</strong> To reply directly to ${params.senderName}, please click the button below to open your chat thread in the Client Portal.
    </div>

    <div style="margin: 20px 0;">
      <a href="${portalUrl}" class="btn-primary" target="_blank" style="background-color: #111111; color: #FFFFFF; font-size: 14px; font-weight: 700; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Reply in Client Portal &rarr;
      </a>
    </div>
  `;

  return renderEmailLayout({
    title: `New Message from ${params.senderName} (Ref #${params.referenceId}) | HR Sports`,
    previewText: `New message on Inquiry #${params.referenceId}: "${params.messageText.substring(0, 80)}..."`,
    contentHtml,
    isNoReply: true,
  });
}
