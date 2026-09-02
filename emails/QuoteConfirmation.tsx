import React from 'react';
import { QuoteInquiryPayload } from '@/types';
import { SITE_CONFIG } from '@/lib/constants';

interface QuoteConfirmationEmailProps {
  payload: QuoteInquiryPayload;
  referenceId: string;
}

export const QuoteConfirmationEmail: React.FC<QuoteConfirmationEmailProps> = ({
  payload,
  referenceId,
}) => {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: 640, margin: '0 auto', padding: '32px 24px', color: '#111111', backgroundColor: '#ffffff', border: '1px solid #27272A' }}>
      <div style={{ borderBottom: '2px solid #111111', paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>HR SPORTS</h1>
        <p style={{ fontSize: 12, color: '#52525B', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Precision OEM & Custom Sports Apparel Manufacturing
        </p>
      </div>

      <p style={{ fontSize: 16, lineHeight: 1.5, margin: '0 0 16px 0' }}>
        Dear <strong>{payload.companyName}</strong> Procurement Team,
      </p>

      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#52525B', margin: '0 0 24px 0' }}>
        Thank you for submitting your custom apparel manufacturing requirements to HR Sports. Your inquiry has been logged in our factory queue with Reference Number: <strong style={{ color: '#111111' }}>{referenceId}</strong>.
      </p>

      <div style={{ backgroundColor: '#F5F5F0', border: '1px solid #27272A', borderRadius: 4, padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0', color: '#111111' }}>
          Manufacturing Intake Specification
        </h2>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E4E4E7' }}>
              <td style={{ padding: '8px 0', color: '#52525B' }}>Company Name:</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{payload.companyName}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E4E4E7' }}>
              <td style={{ padding: '8px 0', color: '#52525B' }}>Contact Email:</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{payload.contactEmail}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E4E4E7' }}>
              <td style={{ padding: '8px 0', color: '#52525B' }}>Garment / Apparel Type:</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{payload.garmentType}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E4E4E7' }}>
              <td style={{ padding: '8px 0', color: '#52525B' }}>Production Volume (MOQ):</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{payload.volumeMOQ} Units</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E4E4E7' }}>
              <td style={{ padding: '8px 0', color: '#52525B' }}>Fabric & Material Spec:</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{payload.materialVariant}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E4E4E7' }}>
              <td style={{ padding: '8px 0', color: '#52525B' }}>Target Turnaround Date:</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{payload.targetDeliveryDate}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#52525B' }}>Design Intake:</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>
                {payload.uploadMode === 'file' ? `${payload.designFiles?.length || 0} Tech-Pack / 3D Files` : 'Design Assistance Requested'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ borderLeft: '3px solid #111111', paddingLeft: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#111111' }}>Factory Review Process:</p>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#52525B', margin: '4px 0 0 0' }}>
          Our engineering team is currently conducting a pattern and printability assessment on your files. A detailed commercial proforma invoice and sample timetable will be delivered to your inbox within <strong>24 business hours</strong>.
        </p>
      </div>

      <div style={{ borderTop: '1px solid #E4E4E7', paddingTop: 20, fontSize: 12, color: '#71717A', lineHeight: 1.5 }}>
        <p style={{ margin: 0 }}><strong>{SITE_CONFIG.legalName}</strong> • Export Hub & Production Division</p>
        <p style={{ margin: '4px 0 0 0' }}>{SITE_CONFIG.address}</p>
        <p style={{ margin: '4px 0 0 0' }}>Phone: {SITE_CONFIG.phone} | Direct Support: {SITE_CONFIG.email}</p>
      </div>
    </div>
  );
};

export default QuoteConfirmationEmail;
