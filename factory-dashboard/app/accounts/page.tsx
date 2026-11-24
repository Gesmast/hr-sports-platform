'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';
import { Receipt, DollarSign, Clock, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

export default function AccountsPage() {
  const { isUrdu, isRoman } = useI18n();

  const commercialQuotations = [
    {
      ref: 'INQ-9482',
      party: 'FC BAVARIA ACADEMY',
      garment: 'Sublimated Jersey + Shorts',
      qty: 120,
      unitQuote: '$21.50',
      totalQuote: '$2,580.00',
      validity: '21h remaining (24h clock)',
      status: 'Quote Issued (Active)',
    },
    {
      ref: 'INQ-9477',
      party: 'AJAX AMSTERDAM FC',
      garment: 'Retro Heritage Cotton Tee',
      qty: 300,
      unitQuote: 'Pending Delivery Confirmation',
      totalQuote: '—',
      validity: 'Awaiting Accounts Review',
      status: 'Design Approved — Needs Quote',
    },
    {
      ref: 'INQ-9470',
      party: 'OLYMPIQUE LYON YOUTH',
      garment: 'Track Jacket + Pants',
      qty: 85,
      unitQuote: '$34.00',
      totalQuote: '$2,890.00',
      validity: 'Accepted & Converted to Job #10104',
      status: 'Converted to Production',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Receipt className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'اکاؤنٹس و کمرشل کوٹیشن ڈیسک (عمیر)' : isRoman ? 'Accounts & Commercial Desk' : 'Accounts & Commercial Quotation Desk'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'کسٹمر کوٹیشنز (24 گھنٹے ایکسپائری)، مقدار کی تصدیق، اور ڈیزائن پر واپس بھیجنے کے اختیارات'
              : isRoman
              ? 'Customer quotes (24h expiry), quantity confirmation aur proforma invoices'
              : 'Commercial quotes with 24h validity tickers, proforma invoices, and send-back controls'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {commercialQuotations.map((item) => (
          <div
            key={item.ref}
            className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-extrabold text-ink">{item.ref}</span>
                <span className="text-muted">•</span>
                <span className="font-bold text-ink text-sm">{item.party}</span>
                <span className="text-muted">•</span>
                <span className="text-xs font-mono text-muted">{item.garment}</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase self-start sm:self-auto ${
                  item.status.includes('Converted')
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : item.status.includes('Active')
                    ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Order Units</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{item.qty} pcs</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Quoted Unit Price</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{item.unitQuote}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Validity Window</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{item.validity}</span>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  href={`/inquiries/${item.ref}`}
                  className="px-3 py-1.5 rounded-base bg-ink text-surface hover:opacity-90 text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{isUrdu ? 'کوٹیشن ورک اسپیس' : isRoman ? 'Quote Kholo' : 'Quote Workspace'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
