import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquareText, ShieldCheck } from 'lucide-react';
import { getInquiryDetails } from '@/app/actions/portal';
import { InquiryThread } from '@/components/portal/InquiryThread';

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiryDetails(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Link */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Link
          href="/portal/inquiries"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-ink transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inquiries List</span>
        </Link>

        <div className="flex items-center gap-1.5 text-xs font-mono text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Inquiry #{inquiry.reference_id}</span>
        </div>
      </div>

      {/* Main Inquiry Thread */}
      <InquiryThread inquiry={inquiry} />
    </div>
  );
}
