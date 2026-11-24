import { EMAIL_CONFIG } from '../config';
import { renderEmailLayout } from '../layout';

export function renderNewsletterVerificationEmail(params: {
  email: string;
  verificationUrl: string;
}): string {
  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      Please confirm your subscription
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px 0; color: #3F3F46; line-height: 1.6;">
      We received a request to subscribe <strong>${params.email}</strong> to HR Sports manufacturing updates and apparel promotions.
    </p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="font-size: 14px; color: #18181B; margin: 0 0 16px 0; font-weight: 500;">
        Click the button below to confirm your email address:
      </p>
      <a href="${params.verificationUrl}" class="btn-primary" style="background-color: #111111; color: #FFFFFF; font-size: 14px; font-weight: 700; padding: 12px 28px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Confirm Subscription &rarr;
      </a>
    </div>

    <p style="font-size: 12px; color: #71717A; margin: 20px 0 0 0;">
      If you did not make this request, you can safely ignore this email. No emails will be sent to your inbox without your confirmation.
    </p>
  `;

  return renderEmailLayout({
    title: `Confirm your subscription | HR Sports`,
    previewText: `Please confirm your email subscription for HR Sports updates.`,
    contentHtml,
    isNoReply: true,
  });
}

export function renderNewsletterWelcomeEmail(params: {
  email: string;
  unsubscribeUrl: string;
}): string {
  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      Welcome to HR Sports
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello,
    </p>

    <p style="font-size: 14px; margin: 0 0 16px 0; color: #3F3F46; line-height: 1.6;">
      Thank you for confirming your subscription. You are now connected to the HR Sports manufacturing desk.
    </p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 18px; margin: 20px 0;">
      <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0; color: #0F172A;">
        What you will receive from us:
      </h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.6;">
        <li>New fabric arrivals, GSM weights, and moisture-wicking test results</li>
        <li>Seasonal manufacturing discounts and bulk club teamwear offers</li>
        <li>Sublimation and embroidery sample showcases</li>
        <li>Factory production schedules and holiday lead times</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #3F3F46; line-height: 1.6; margin: 16px 0;">
      Need a custom sample or have questions about a design? Visit us anytime at <a href="${EMAIL_CONFIG.APP_URL}" style="color: #059669; font-weight: 600;">thehrsports.com</a>.
    </p>
  `;

  return renderEmailLayout({
    title: `Welcome to HR Sports Updates`,
    previewText: `Your subscription is active. Welcome to HR Sports.`,
    contentHtml,
    isNoReply: true,
    unsubscribeUrl: params.unsubscribeUrl,
  });
}

export function renderPromotionalCampaignEmail(params: {
  title: string;
  previewText?: string;
  contentHtml: string;
  callToAction?: {
    label: string;
    url: string;
  };
  unsubscribeUrl: string;
}): string {
  const contentHtml = `
    <h1 style="font-size: 22px; font-weight: 800; color: #111111; margin: 0 0 18px 0;">
      ${params.title}
    </h1>

    <div style="font-size: 14px; color: #3F3F46; line-height: 1.7; margin-bottom: 24px;">
      ${params.contentHtml}
    </div>

    ${params.callToAction ? `
      <div style="margin: 24px 0; text-align: left;">
        <a href="${params.callToAction.url}" class="btn-primary" target="_blank" style="background-color: #111111; color: #FFFFFF; font-size: 14px; font-weight: 700; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ${params.callToAction.label} &rarr;
        </a>
      </div>
    ` : ''}
  `;

  return renderEmailLayout({
    title: `${params.title} | HR Sports`,
    previewText: params.previewText || params.title,
    contentHtml,
    isNoReply: true,
    unsubscribeUrl: params.unsubscribeUrl,
  });
}
