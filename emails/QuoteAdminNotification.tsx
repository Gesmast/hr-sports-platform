import React from 'react';
import { QuoteInquiryPayload } from '@/types';

interface QuoteAdminNotificationEmailProps {
  payload: QuoteInquiryPayload;
  referenceId: string;
}

export const QuoteAdminNotificationEmail: React.FC<QuoteAdminNotificationEmailProps> = ({
  payload,
  referenceId,
}) => {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, backgroundColor: '#ffffff', border: '1px solid #27272A', color: '#111111' }}>
      <h2 style={{ fontSize: 18, borderBottom: '2px solid #111111', paddingBottom: 8, margin: '0 0 16px 0' }}>
        [ALERT] NEW B2B QUOTE INTAKE — {referenceId}
      </h2>

      <p><strong>Company:</strong> {payload.companyName}</p>
      <p><strong>Email:</strong> {payload.contactEmail}</p>
      <p><strong>Phone:</strong> {payload.contactPhone || 'N/A'}</p>
      <p><strong>Garment:</strong> {payload.garmentType}</p>
      <p><strong>Volume:</strong> {payload.volumeMOQ} units</p>
      <p><strong>Fabric Blend:</strong> {payload.materialVariant}</p>
      <p><strong>Sizes Breakdown:</strong> {payload.sizeBreakdown || 'Standard distribution'}</p>
      <p><strong>Required Timeline:</strong> {payload.targetDeliveryDate}</p>
      <p><strong>Upload Mode:</strong> {payload.uploadMode}</p>

      {payload.designNotes && (
        <div style={{ background: '#F5F5F0', padding: 12, border: '1px solid #27272A', margin: '12px 0' }}>
          <strong>Design / Tech Instructions:</strong>
          <p style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>{payload.designNotes}</p>
        </div>
      )}

      {payload.designFiles && payload.designFiles.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <strong>Attached Design / 3D Assets ({payload.designFiles.length}):</strong>
          <ul>
            {payload.designFiles.map((file, idx) => (
              <li key={idx}>
                {file.fileName} — {(file.sizeBytes / (1024 * 1024)).toFixed(2)} MB [{file.kind.toUpperCase()}]
                {file.storageUrl && ` — Storage: ${file.storageUrl}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuoteAdminNotificationEmail;
