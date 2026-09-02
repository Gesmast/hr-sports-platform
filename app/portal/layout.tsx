import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Production Portal — HR Sports OEM',
  description: 'Track active apparel manufacturing orders, download invoices, inspect QC certificates, and access approved tech packs.',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {children}
    </div>
  );
}
