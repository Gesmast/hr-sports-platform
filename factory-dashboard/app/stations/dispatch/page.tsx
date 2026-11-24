'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Truck, CheckCircle2, Globe, ExternalLink } from 'lucide-react';

export default function DispatchStationPage() {
  const { isUrdu, isRoman } = useI18n();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Truck className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'ڈسپیچ و بین الاقوامی شپنگ' : isRoman ? 'Dispatch Floor' : 'Dispatch & International Logistics'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'ایئر کارگو، ڈی ایچ ایل/فیڈیکس وے بلز، اور کسٹمز کلیئرنس دستاویزات'
              : isRoman
              ? 'Air cargo, DHL/FedEx waybills aur customs documents'
              : 'Air freight waybills, DHL/FedEx manifest generation, and export customs manifests'}
          </p>
        </div>
      </div>

      <div className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-extrabold text-ink">#10104</span>
            <span className="text-muted">•</span>
            <span className="font-bold text-ink text-sm">OLYMPIQUE LYON YOUTH</span>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            Dispatched via DHL Express
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Tracking AWB</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">DHL-984729104</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Destination</span>
            <span className="font-semibold text-ink mt-0.5 block">Lyon, France (CDG Hub)</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Cartons</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">4 Master Cartons</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Gate Pass</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">GP-2026-0814</span>
          </div>
        </div>
      </div>
    </div>
  );
}
