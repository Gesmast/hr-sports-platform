import { EMAIL_CONFIG } from './config';

export interface EmailLayoutOptions {
  title: string;
  previewText?: string;
  contentHtml: string;
  isNoReply?: boolean;
  portalLink?: {
    url: string;
    label: string;
  };
  unsubscribeUrl?: string;
  isSupport?: boolean;
}

/**
 * Shared HTML Email Layout with clean, responsive, human-friendly styling
 * Matches the actual website colors and includes the official HR Sports logo.
 */
export function renderEmailLayout(options: EmailLayoutOptions): string {
  const {
    title,
    previewText,
    contentHtml,
    isNoReply = true,
    portalLink,
    unsubscribeUrl,
    isSupport = false,
  } = options;

  const appUrl = EMAIL_CONFIG.APP_URL;
  const logoUrl = EMAIL_CONFIG.LOGO_URL;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F4F4F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #18181B;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
    }
    .email-wrapper {
      width: 100%;
      background-color: #F4F4F5;
      padding: 32px 16px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #E4E4E7;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      padding: 28px 32px 20px 32px;
      border-bottom: 1px solid #F4F4F5;
      text-align: left;
    }
    .header-logo {
      height: 38px;
      width: auto;
      display: inline-block;
      vertical-align: middle;
    }
    .header-tagline {
      font-size: 13px;
      color: #71717A;
      margin: 6px 0 0 0;
      font-weight: 500;
    }
    .email-body {
      padding: 32px;
    }
    .email-footer {
      padding: 24px 32px;
      background-color: #FAFAFA;
      border-top: 1px solid #E4E4E7;
      font-size: 12px;
      color: #71717A;
      line-height: 1.5;
    }
    .btn-primary {
      display: inline-block;
      background-color: #111111;
      color: #FFFFFF !important;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 16px 0;
    }
    .btn-accent {
      display: inline-block;
      background-color: #059669;
      color: #FFFFFF !important;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 16px 0;
    }
    .notice-box {
      background-color: #F4F4F5;
      border: 1px solid #E4E4E7;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
      font-size: 13px;
      color: #3F3F46;
    }
    .spec-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 13px;
    }
    .spec-table tr {
      border-bottom: 1px solid #F4F4F5;
    }
    .spec-table td {
      padding: 10px 0;
    }
    .spec-table .label {
      color: #71717A;
      font-weight: 500;
      width: 40%;
    }
    .spec-table .val {
      color: #18181B;
      font-weight: 600;
      text-align: right;
    }
    @media only screen and (max-width: 600px) {
      .email-body { padding: 24px 20px; }
      .email-header { padding: 20px; }
      .email-footer { padding: 20px; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#F4F4F5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${escapeHtml(previewText)}</div>` : ''}
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <a href="${appUrl}" target="_blank" style="text-decoration: none;">
          <img src="${logoUrl}" alt="HR Sports" class="header-logo" border="0" onerror="this.style.display='none'">
          <span style="font-size: 20px; font-weight: 800; color: #111111; letter-spacing: -0.02em; margin-left: 4px; vertical-align: middle;">HR SPORTS</span>
        </a>
        <p class="header-tagline">Custom Sports Apparel & Direct Factory Manufacturing</p>
      </div>

      <div class="email-body">
        ${contentHtml}

        ${portalLink ? `
          <div style="margin: 24px 0 8px 0; text-align: left;">
            <a href="${portalLink.url}" class="btn-primary" target="_blank">${escapeHtml(portalLink.label)} &rarr;</a>
          </div>
        ` : ''}
      </div>

      <div class="email-footer">
        ${isNoReply ? `
          <div style="padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid #E4E4E7;">
            <strong>Automated Notification:</strong> This email was sent from an automated system that does not accept incoming replies. To reply or check progress, please open your <a href="${EMAIL_CONFIG.CLIENT_PORTAL_URL}" style="color: #111111; font-weight: 600;">Client Portal</a>.
          </div>
        ` : isSupport ? `
          <div style="padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid #E4E4E7;">
            <strong>Need help?</strong> You can reply directly to this email and our customer support team will assist you.
          </div>
        ` : ''}

        <p style="margin: 0 0 6px 0;"><strong>HR Sports</strong> &bull; Lahore Manufacturing Facility</p>
        <p style="margin: 0 0 6px 0;">Website: <a href="${appUrl}" style="color: #71717A;">thehrsports.com</a> | Support: <a href="mailto:support@thehrsports.com" style="color: #71717A;">support@thehrsports.com</a></p>

        ${unsubscribeUrl ? `
          <p style="margin: 12px 0 0 0; font-size: 11px;">
            You received this because you are subscribed to HR Sports updates.
            <a href="${unsubscribeUrl}" style="color: #71717A; text-decoration: underline;">Unsubscribe</a> at any time.
          </p>
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Helper to strip HTML tags for plain text email versions
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n' + '='.repeat(30) + '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '  • $1\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s+\n/g, '\n\n')
    .trim();
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
