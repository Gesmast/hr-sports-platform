import React from 'react';
import { SITE_CONFIG } from '@/lib/constants';

interface NewsletterWelcomeEmailProps {
  email: string;
}

export const NewsletterWelcomeEmail: React.FC<NewsletterWelcomeEmailProps> = ({ email }) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: 600, margin: '0 auto', padding: '32px 24px', color: '#111111', backgroundColor: '#ffffff', border: '1px solid #27272A' }}>
      <div style={{ borderBottom: '2px solid #111111', paddingBottom: 16, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>HR SPORTS</h1>
        <p style={{ fontSize: 12, color: '#52525B', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Textile Intelligence & OEM Manufacturing Briefing
        </p>
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.6, margin: '0 0 16px 0' }}>
        Thank you for subscribing to HR Sports Textile Intelligence.
      </p>

      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#52525B', margin: '0 0 20px 0' }}>
        You have joined over 4,500 apparel brand founders, athletic directors, and procurement leaders who rely on our monthly manufacturing briefings.
      </p>

      <div style={{ backgroundColor: '#F5F5F0', border: '1px solid #E4E4E7', borderRadius: 4, padding: 16, marginBottom: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px 0', textTransform: 'uppercase' }}>What to Expect:</h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#52525B', lineHeight: 1.6 }}>
          <li>Quarterly analysis on technical yarn and recycled polymer pricing</li>
          <li>Sublimation calibration techniques and Delta-E color fastness benchmarks</li>
          <li>International freight route optimizations and customs tariff updates</li>
        </ul>
      </div>

      <div style={{ borderTop: '1px solid #E4E4E7', paddingTop: 16, fontSize: 12, color: '#71717A' }}>
        <p style={{ margin: 0 }}>HR Sports International Ltd. • {SITE_CONFIG.address}</p>
        <p style={{ margin: '4px 0 0 0' }}>Subscribed address: {email}</p>
      </div>
    </div>
  );
};

export default NewsletterWelcomeEmail;
