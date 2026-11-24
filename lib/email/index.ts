import { EMAIL_CONFIG, EMAIL_SENDERS } from './config';
import {
  sendPlatformEmail,
  getSupportRecipientEmail,
  EmailAttachment,
  SendEmailResponse,
} from './service';
import {
  renderInquiryConfirmationEmail,
  renderDesignProofReadyEmail,
  renderDesignApprovalConfirmedEmail,
  renderQuotationIssuedEmail,
  renderStaffMessageAlertEmail,
  InquiryConfirmationData,
} from './templates/inquiry';
import {
  renderContactAdminForwardEmail,
  renderContactVisitorConfirmationEmail,
  ContactMessageData,
} from './templates/contact';
import {
  renderOrderCreatedEmail,
  renderOrderStageUpdateEmail,
  OrderEmailData,
} from './templates/order';
import {
  renderNewsletterVerificationEmail,
  renderNewsletterWelcomeEmail,
  renderPromotionalCampaignEmail,
} from './templates/newsletter';

export * from './config';
export * from './service';
export * from './layout';

/**
 * High-Level Business Email Dispatchers with Automatic Idempotency
 */
export const platformEmails = {
  // 1. INQUIRY LIFECYCLE (Sender: inquiry@thehrsports.com, No-Reply)
  async sendInquiryConfirmation(data: InquiryConfirmationData, attachments?: EmailAttachment[]) {
    const html = renderInquiryConfirmationEmail(data);
    return sendPlatformEmail({
      emailType: 'inquiry_confirmation',
      sender: EMAIL_SENDERS.INQUIRY,
      to: data.contactEmail,
      subject: `Inquiry Received — Ref #${data.referenceId} | HR Sports`,
      html,
      relatedId: data.referenceId,
      idempotencyKey: `inq_confirm_${data.referenceId}`,
      attachments,
      metadata: { referenceId: data.referenceId, garment: data.garmentType },
    });
  },

  async sendDesignProofReady(params: {
    to: string;
    clientName: string;
    referenceId: string;
    garmentType: string;
    designerName?: string;
  }) {
    const html = renderDesignProofReadyEmail({
      clientName: params.clientName,
      referenceId: params.referenceId,
      garmentType: params.garmentType,
      designerName: params.designerName || 'CAD Lead',
    });
    return sendPlatformEmail({
      emailType: 'design_proof_ready',
      sender: EMAIL_SENDERS.INQUIRY,
      to: params.to,
      subject: `🎨 3D Design Proof Ready — Ref #${params.referenceId} | HR Sports`,
      html,
      relatedId: params.referenceId,
      idempotencyKey: `proof_ready_${params.referenceId}`,
    });
  },

  async sendDesignApprovalConfirmed(params: {
    to: string;
    clientName: string;
    referenceId: string;
    garmentType: string;
  }) {
    const html = renderDesignApprovalConfirmedEmail(params);
    return sendPlatformEmail({
      emailType: 'design_approval_confirmed',
      sender: EMAIL_SENDERS.INQUIRY,
      to: params.to,
      subject: `Design Approved — Ref #${params.referenceId} | HR Sports`,
      html,
      relatedId: params.referenceId,
      idempotencyKey: `design_approved_${params.referenceId}`,
    });
  },

  async sendQuotationIssued(params: {
    to: string;
    clientName: string;
    referenceId: string;
    garmentType: string;
    quantity: number;
    unitPrice: string;
    validUntilIso: string;
    formattedExpiryText: string;
  }) {
    const html = renderQuotationIssuedEmail(params);
    return sendPlatformEmail({
      emailType: 'quotation_issued',
      sender: EMAIL_SENDERS.INQUIRY,
      to: params.to,
      subject: `💼 Formal Quotation Issued — Ref #${params.referenceId} | HR Sports`,
      html,
      relatedId: params.referenceId,
      idempotencyKey: `quote_issued_${params.referenceId}_${params.validUntilIso}`,
    });
  },

  async sendStaffMessageAlert(params: {
    to: string;
    clientName: string;
    referenceId: string;
    senderName: string;
    messageText: string;
    messageId?: string;
  }) {
    const html = renderStaffMessageAlertEmail(params);
    return sendPlatformEmail({
      emailType: 'staff_message_alert',
      sender: EMAIL_SENDERS.INQUIRY,
      to: params.to,
      subject: `💬 New Message from ${params.senderName} (Ref #${params.referenceId}) | HR Sports`,
      html,
      relatedId: params.referenceId,
      idempotencyKey: params.messageId ? `msg_alert_${params.messageId}` : undefined,
    });
  },

  // 2. CONTACT DESK (Sender: support@thehrsports.com, Replyable)
  async handleContactSubmission(data: ContactMessageData, submissionId: string) {
    const supportRecipient = await getSupportRecipientEmail();

    // (a) Forward to Support team with Reply-To set to the customer
    const adminHtml = renderContactAdminForwardEmail(data);
    const forwardRes = await sendPlatformEmail({
      emailType: 'contact_admin_forward',
      sender: EMAIL_SENDERS.SUPPORT,
      to: supportRecipient,
      replyTo: data.email,
      subject: `📩 Contact Inquiry from ${data.name} | HR Sports Support`,
      html: adminHtml,
      relatedId: submissionId,
      idempotencyKey: `contact_fwd_${submissionId}`,
    });

    // (b) Send confirmation receipt to the visitor (replyable)
    const visitorHtml = renderContactVisitorConfirmationEmail(data);
    const confirmRes = await sendPlatformEmail({
      emailType: 'contact_visitor_confirm',
      sender: EMAIL_SENDERS.SUPPORT,
      to: data.email,
      subject: `We received your message | HR Sports Support`,
      html: visitorHtml,
      relatedId: submissionId,
      idempotencyKey: `contact_ack_${submissionId}`,
    });

    return { forwardRes, confirmRes };
  },

  // 3. ORDER PROGRESSION (Sender: order@thehrsports.com, No-Reply)
  async sendOrderCreated(params: {
    to: string;
    clientName: string;
    orderNumber: string;
    productName: string;
    totalQuantity: number;
    totalAmount?: string;
    estimatedDelivery?: string;
  }) {
    const html = renderOrderCreatedEmail(params);
    return sendPlatformEmail({
      emailType: 'order_created',
      sender: EMAIL_SENDERS.ORDER,
      to: params.to,
      subject: `Production Order Confirmed #${params.orderNumber} | HR Sports`,
      html,
      relatedId: params.orderNumber,
      idempotencyKey: `order_created_${params.orderNumber}`,
    });
  },

  async sendOrderStageUpdate(params: OrderEmailData) {
    const html = renderOrderStageUpdateEmail(params);
    const isDispatched = params.currentStageKey === 'dispatch' || params.currentStageKey === 'shipped';
    const subject = isDispatched
      ? `🚚 Production Dispatched — Order #${params.orderNumber} | HR Sports`
      : `Order Progress #${params.orderNumber}: ${params.currentStageName} | HR Sports`;

    return sendPlatformEmail({
      emailType: 'order_stage_update',
      sender: EMAIL_SENDERS.ORDER,
      to: params.clientName, // or clientEmail resolved
      subject,
      html,
      relatedId: params.orderNumber,
      idempotencyKey: `order_stage_${params.orderNumber}_${params.currentStageKey}`,
    });
  },

  // 4. NEWSLETTER & PROMOTIONS (Sender: news@thehrsports.com, No-Reply)
  async sendNewsletterVerification(email: string, token: string) {
    const verificationUrl = `${EMAIL_CONFIG.APP_URL}/api/newsletter/verify?token=${encodeURIComponent(token)}`;
    const html = renderNewsletterVerificationEmail({ email, verificationUrl });
    return sendPlatformEmail({
      emailType: 'newsletter_verification',
      sender: EMAIL_SENDERS.NEWS,
      to: email,
      subject: `Confirm your subscription to HR Sports`,
      html,
      idempotencyKey: `news_verify_${email}_${token}`,
    });
  },

  async sendNewsletterWelcome(email: string, unsubscribeToken: string) {
    const unsubscribeUrl = `${EMAIL_CONFIG.APP_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
    const html = renderNewsletterWelcomeEmail({ email, unsubscribeUrl });
    return sendPlatformEmail({
      emailType: 'newsletter_welcome',
      sender: EMAIL_SENDERS.NEWS,
      to: email,
      subject: `Welcome to HR Sports Updates`,
      html,
      idempotencyKey: `news_welcome_${email}`,
    });
  },

  async sendPromotionalCampaign(params: {
    to: string;
    title: string;
    previewText?: string;
    contentHtml: string;
    campaignId: string;
    unsubscribeToken: string;
    callToAction?: {
      label: string;
      url: string;
    };
  }) {
    const unsubscribeUrl = `${EMAIL_CONFIG.APP_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(params.unsubscribeToken)}`;
    const html = renderPromotionalCampaignEmail({
      title: params.title,
      previewText: params.previewText,
      contentHtml: params.contentHtml,
      callToAction: params.callToAction,
      unsubscribeUrl,
    });

    return sendPlatformEmail({
      emailType: 'promotional_campaign',
      sender: EMAIL_SENDERS.NEWS,
      to: params.to,
      subject: `${params.title} | HR Sports`,
      html,
      relatedId: params.campaignId,
      idempotencyKey: `promo_${params.campaignId}_${params.to}`,
    });
  },
};
