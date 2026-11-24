'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Package, CheckCircle2, QrCode } from 'lucide-react';

export default function PackingStationPage() {
  const { isUrdu, isRoman } = useI18n();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Package className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'پیکنگ و بارکوڈ ٹیگنگ' : isRoman ? 'Packing Floor' : 'Packing & Export Carton Station'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'انفرادی پولی بیگنگ، ماسٹر کارٹن بارکوڈ سکیننگ، اور کوالٹی کلیئرنس'
              : isRoman
              ? 'Individual polybagging, barcode scanning aur master cartons'
              : 'Individual polybagging, barcode verification, and reinforced master carton packaging'}
          </p>
        </div>
      </div>

      <div className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-extrabold text-ink">#10103</span>
            <span className="text-muted">•</span>
            <span className="font-bold text-ink text-sm">INTER MIAMI YOUTH</span>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            Cartons Sealed & Barcoded
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Total Packed</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">40 / 40 pcs</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Carton Box Count</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">2 Master Cartons</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Gross Weight</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">14.6 kg</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">AQL Inspection</span>
            <span className="font-bold text-emerald-500 mt-0.5 block">Passed (Aamir QC)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
