'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';
import { Palette, CheckCircle2, Clock, Upload, ArrowRight, MessageSquare } from 'lucide-react';

export default function DesignDeskPage() {
  const { isUrdu, isRoman } = useI18n();

  const designQueue = [
    {
      ref: 'INQ-9482',
      party: 'FC BAVARIA ACADEMY',
      garment: 'Sublimated Jersey + Shorts',
      designer: 'Usman',
      mockupStatus: 'Proof V1 Uploaded',
      clientApproval: 'Pending Client Approval',
      slaRemaining: '4h 28m',
    },
    {
      ref: 'INQ-9485',
      party: 'RED BULL LEIPZIG ACADEMY',
      garment: 'Windbreaker Training Vest',
      designer: 'Shahzaib',
      mockupStatus: 'Vector Sizing In Progress',
      clientApproval: 'Drafting',
      slaRemaining: '6h 15m',
    },
    {
      ref: 'INQ-9477',
      party: 'AJAX AMSTERDAM FC',
      garment: 'Retro Heritage Cotton Tee',
      designer: 'Faizan',
      mockupStatus: 'Proof V2 Approved',
      clientApproval: 'Approved — Handed to Accounts',
      slaRemaining: 'Met',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Palette className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'ڈیزائن و آرڈر ڈیسک (عثمان / ٹیم)' : isRoman ? 'Design & CAD Desk' : 'Design & CAD Order Desk'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'کسٹمر چیٹ، تھری ڈی موک اپ اپ لوڈز، اور کلائنٹ اپروول گیٹ ورک فلو'
              : isRoman
              ? 'Customer chat, 3D mockup uploads aur client approval gating'
              : 'Direct customer CAD chat, 3D vector mockup proofing, and client sign-off gates'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {designQueue.map((item) => (
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
                  item.clientApproval.includes('Approved')
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                }`}
              >
                {item.clientApproval}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Assigned Designer</span>
                <span className="font-semibold text-ink mt-0.5 block">{item.designer}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Mockup Status</span>
                <span className="font-semibold text-ink mt-0.5 block">{item.mockupStatus}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">SLA Window</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{item.slaRemaining}</span>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  href={`/inquiries/${item.ref}`}
                  className="px-3 py-1.5 rounded-base bg-ink text-surface hover:opacity-90 text-xs font-bold font-mono transition flex items-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'ڈیزائن چیٹ کھولیں' : isRoman ? 'Design Chat Kholo' : 'Open Design Chat'}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
