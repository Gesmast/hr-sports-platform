import React from 'react';
import Link from 'next/link';
import {
  MessageSquareText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Download,
  Calendar,
  Layers,
  Archive
} from 'lucide-react';
import { getUserInquiries } from '@/app/actions/portal';
import { Button } from '@/components/shared/Button';

export default async function InquiriesListPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = 'current' } = await searchParams;
  const { currentInquiries, pastInquiries } = await getUserInquiries();

  const isCurrentTab = tab === 'current';
  const displayedInquiries = isCurrentTab ? currentInquiries : pastInquiries;

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Production Inquiries & Quotes
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 font-medium mt-1">
          Track quotation requests, review engineering pricing proposals, and communicate with the pattern master.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/portal/inquiries?tab=current"
          className={`py-2 px-3.5 text-xs font-mono uppercase tracking-wider rounded-xl transition flex items-center gap-2 ${
            isCurrentTab
              ? 'bg-zinc-200 text-black font-black border border-gray-300 shadow-2xs'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-gray-200 font-bold'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-black" />
          <span>Current Inquiries ({currentInquiries.length})</span>
        </Link>

        <Link
          href="/portal/inquiries?tab=past"
          className={`py-2 px-3.5 text-xs font-mono uppercase tracking-wider rounded-xl transition flex items-center gap-2 ${
            !isCurrentTab
              ? 'bg-zinc-200 text-black font-black border border-gray-300 shadow-2xs'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-gray-200 font-bold'
          }`}
        >
          <Archive className="w-3.5 h-3.5 text-black" />
          <span>Past Inquiries ({pastInquiries.length})</span>
        </Link>
      </div>

      {/* Inquiries List */}
      {displayedInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center space-y-4 shadow-xs border border-gray-200/80">
          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-black">
            <MessageSquareText className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-base font-bold text-black">
            {isCurrentTab ? 'No Current Inquiries' : 'No Past Inquiries Recorded'}
          </h3>
          <p className="text-xs text-zinc-600 font-medium max-w-sm mx-auto leading-relaxed">
            {isCurrentTab
              ? 'You have no ongoing quotation requests in discussion. Submit custom specs to receive a commercial proforma quote.'
              : 'Inquiries that were converted into orders, expired, or inactive for more than 7 days will be archived here for your records.'}
          </p>
          {isCurrentTab && (
            <div className="pt-2">
              <Link href="/request-a-quote">
                <button className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-black border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer">
                  <PlusCircle className="w-4 h-4 text-black" />
                  <span>Submit Your First Inquiry</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedInquiries.map((inquiry) => {
            const activeQuote = inquiry.quotes?.find((q: any) => q.status === 'active');

            return (
              <div
                key={inquiry.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-200/80 hover:border-gray-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-black">
                      {inquiry.reference_id}
                    </span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-zinc-600 font-mono">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>

                    {/* Status Pills */}
                    {inquiry.status === 'converted' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Converted to Order
                      </span>
                    ) : inquiry.isQuoteExpired ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full font-bold border border-gray-200">
                        <AlertTriangle className="w-3 h-3 text-zinc-600" />
                        Quote Expired
                      </span>
                    ) : activeQuote ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-black bg-zinc-100 px-2.5 py-0.5 rounded-full font-bold border border-gray-300">
                        <Clock className="w-3 h-3 text-emerald-600 animate-pulse" />
                        Formal Quote Ready (${Number(activeQuote.unit_price).toFixed(2)}/u)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-zinc-600 bg-zinc-50 px-2.5 py-0.5 rounded-full border border-gray-200 font-medium">
                        Pending Factory Quote
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-black">
                    {inquiry.garment_type}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-zinc-600 font-mono">
                    <span>Batch Size: <strong className="text-black">{inquiry.quantity} units</strong></span>
                    {inquiry.customization_type && (
                      <span>Customization: <strong className="text-black">{inquiry.customization_type}</strong></span>
                    )}
                    {inquiry.target_delivery_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        Target: <strong className="text-black">{new Date(inquiry.target_delivery_date).toLocaleDateString()}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/portal/inquiries/${inquiry.id}`}>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-50 hover:bg-zinc-100 text-black border border-gray-200 hover:border-gray-300 transition cursor-pointer shadow-2xs">
                      <span>View Specs & Quote</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
