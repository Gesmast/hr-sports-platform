import { EMAIL_CONFIG } from '../config';
import { renderEmailLayout } from '../layout';

export interface OrderStageInfo {
  key: string;
  label: string;
  completed: boolean;
  current: boolean;
}

export interface OrderEmailData {
  orderNumber: string;
  clientName: string;
  productName: string;
  totalQuantity: number;
  currentStageKey: string;
  currentStageName: string;
  stageDescription: string;
  nextStepText?: string;
  trackingCarrier?: string;
  trackingNumber?: string;
  stages: OrderStageInfo[];
}

export function renderOrderStageUpdateEmail(data: OrderEmailData): string {
  const portalUrl = `${EMAIL_CONFIG.CLIENT_PORTAL_URL}/orders/${data.orderNumber}`;
  const isDispatched = data.currentStageKey === 'dispatch' || data.currentStageKey === 'shipped';

  // Render a clean visual step progress bar table
  const progressStepsHtml = data.stages.map((st, idx) => {
    const icon = st.completed ? '&#10003;' : st.current ? '&bull;' : (idx + 1).toString();
    const bg = st.completed ? '#059669' : st.current ? '#111111' : '#E4E4E7';
    const textCol = st.completed || st.current ? '#FFFFFF' : '#71717A';
    const labelCol = st.current ? '#111111' : st.completed ? '#059669' : '#A1A1AA';
    const labelWeight = st.current ? '700' : '500';

    return `
      <td style="text-align: center; padding: 0 4px; vertical-align: top;">
        <div style="display: inline-block; width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: ${bg}; color: ${textCol}; font-size: 11px; font-weight: bold; margin-bottom: 6px;">
          ${icon}
        </div>
        <div style="font-size: 10px; color: ${labelCol}; font-weight: ${labelWeight}; line-height: 1.2;">
          ${st.label}
        </div>
      </td>
    `;
  }).join('');

  const dispatchHtml = isDispatched && data.trackingNumber ? `
    <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; padding: 18px; margin: 20px 0;">
      <h3 style="font-size: 14px; font-weight: 700; color: #065F46; margin: 0 0 10px 0;">
        Shipment & Tracking Information
      </h3>
      <table style="width: 100%; font-size: 13px;">
        <tr>
          <td style="color: #047857; padding: 4px 0; width: 35%;">Courier / Carrier:</td>
          <td style="font-weight: 700; color: #064E3B; text-align: right;">${data.trackingCarrier || 'International Air Freight'}</td>
        </tr>
        <tr>
          <td style="color: #047857; padding: 4px 0;">Tracking Number:</td>
          <td style="font-weight: 800; font-family: monospace; color: #064E3B; text-align: right; font-size: 14px;">${data.trackingNumber}</td>
        </tr>
      </table>
    </div>
  ` : '';

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      ${isDispatched ? 'Your production order has been dispatched' : `Order Update: ${data.currentStageName}`}
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${data.clientName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px 0; color: #3F3F46; line-height: 1.6;">
      Here is the latest manufacturing update for Order <strong>#${data.orderNumber}</strong> (${data.productName}, ${data.totalQuantity.toLocaleString()} units).
    </p>

    <!-- Progress Bar Table -->
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 18px 8px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          ${progressStepsHtml}
        </tr>
      </table>
    </div>

    <!-- Current Stage Callout -->
    <div style="background-color: #FFFFFF; border-left: 3px solid #111111; border: 1px solid #E4E4E7; border-left-width: 4px; border-left-color: #111111; border-radius: 4px; padding: 16px; margin: 20px 0;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #71717A; font-weight: 700;">Current Factory Stage</div>
      <div style="font-size: 16px; font-weight: 700; color: #111111; margin: 4px 0 6px 0;">${data.currentStageName}</div>
      <div style="font-size: 13px; color: #475569; line-height: 1.5;">${data.stageDescription}</div>

      ${data.nextStepText ? `
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #E2E8F0; font-size: 12px; color: #64748B;">
          <strong>Next Step:</strong> ${data.nextStepText}
        </div>
      ` : ''}
    </div>

    ${dispatchHtml}

    <p style="font-size: 13px; color: #475569; margin: 20px 0;">
      You can inspect live stage movements and download invoices anytime in your portal.
    </p>
  `;

  return renderEmailLayout({
    title: `Order Update #${data.orderNumber}: ${data.currentStageName} | HR Sports`,
    previewText: `Order #${data.orderNumber} is now in ${data.currentStageName}.`,
    contentHtml,
    isNoReply: true,
    portalLink: {
      url: portalUrl,
      label: 'Track Order in Portal',
    },
  });
}

export function renderOrderCreatedEmail(data: {
  orderNumber: string;
  clientName: string;
  productName: string;
  totalQuantity: number;
  totalAmount?: string;
  estimatedDelivery?: string;
}): string {
  const portalUrl = `${EMAIL_CONFIG.CLIENT_PORTAL_URL}/orders/${data.orderNumber}`;

  const contentHtml = `
    <h1 style="font-size: 20px; font-weight: 800; color: #111111; margin: 0 0 16px 0;">
      Production order confirmed & scheduled
    </h1>

    <p style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">
      Hello <strong>${data.clientName}</strong>,
    </p>

    <p style="font-size: 14px; margin: 0 0 20px 0; color: #3F3F46; line-height: 1.6;">
      Thank you for confirming your manufacturing order with HR Sports. Order <strong>#${data.orderNumber}</strong> has been created and assigned a production job slot on our factory floor.
    </p>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 18px; margin: 20px 0;">
      <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; margin: 0 0 12px 0; color: #0F172A;">
        Order Specifications
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B;">Order Number:</td>
          <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #0F172A;">#${data.orderNumber}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B;">Product:</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.productName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 8px 0; color: #64748B;">Total Units:</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.totalQuantity.toLocaleString()} units</td>
        </tr>
        ${data.totalAmount ? `
          <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 8px 0; color: #64748B;">Total Amount:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #059669;">${data.totalAmount}</td>
          </tr>
        ` : ''}
        ${data.estimatedDelivery ? `
          <tr>
            <td style="padding: 8px 0; color: #64748B;">Target Dispatch:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #0F172A;">${data.estimatedDelivery}</td>
          </tr>
        ` : ''}
      </table>
    </div>

    <p style="font-size: 14px; color: #3F3F46; line-height: 1.6; margin: 16px 0;">
      Our fabric cutting team is pulling your yarn and textile lots now. You will receive an automatic email notification whenever your order advances to the next manufacturing stage.
    </p>
  `;

  return renderEmailLayout({
    title: `Order Confirmed #${data.orderNumber} | HR Sports`,
    previewText: `Order #${data.orderNumber} confirmed. Production scheduled.`,
    contentHtml,
    isNoReply: true,
    portalLink: {
      url: portalUrl,
      label: 'View Order in Portal',
    },
  });
}
