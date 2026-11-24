/**
 * HR Sports Enterprise Email System Configuration
 * All senders strictly use the verified domain: @thehrsports.com
 */

export const EMAIL_SENDERS = {
  INQUIRY: process.env.EMAIL_SENDER_INQUIRY || 'HR Sports Inquiries <inquiry@thehrsports.com>',
  ORDER: process.env.EMAIL_SENDER_ORDER || 'HR Sports Orders <order@thehrsports.com>',
  NEWS: process.env.EMAIL_SENDER_NEWS || 'HR Sports News <news@thehrsports.com>',
  SUPPORT: process.env.EMAIL_SENDER_SUPPORT || 'HR Sports Support <support@thehrsports.com>',
} as const;

export const EMAIL_CONFIG = {
  DOMAIN: 'thehrsports.com',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://thehrsports.com',
  CLIENT_PORTAL_URL: process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'https://thehrsports.com/portal',
  FACTORY_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001',
  LOGO_URL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://thehrsports.com'}/logo.png`,
  MAX_ATTACHMENT_BYTES: 15 * 1024 * 1024, // 15 MB safe threshold for direct email attachments
  DEFAULT_SUPPORT_RECIPIENT: 'support@thehrsports.com',
} as const;
