'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Shirt, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function StitchingStationPage() {
  const { isUrdu, isRoman } = useI18n();

  const [stitchingLines, setStitchingLines] = useState([
    {
      line: 'Line 1 (Overlock & Flatlock)',
      supervisor: 'Akram Bhai',
      jobNo: 10101,
      party: 'FC BAVARIA ACADEMY',
      garment: 'Sublimated Jersey + Shorts',
      targetQty: 120,
      completedQty: 75,
      hourlyOutput: 18,
      status: 'Active Running',
    },
    {
      line: 'Line 2 (Single Needle & Hemming)',
      supervisor: 'Rashid Usttad',
      jobNo: 10102,
      party: 'ATLETICO MADRID ACADEMY',
      garment: 'Training Warm-up Hoodie',
      targetQty: 250,
      completedQty: 110,
      hourlyOutput: 24,
      status: 'Active Running',
    },
    {
      line: 'Line 3 (Collars & Rib Assembly)',
      supervisor: 'Naveed',
      jobNo: 10103,
      party: 'INTER MIAMI YOUTH',
      garment: 'Goalkeeper Jersey Pack',
      targetQty: 40,
      completedQty: 40,
      hourlyOutput: 0,
      status: 'Completed Line',
    },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Shirt className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'اسٹچنگ فلور و اسمبلنگ' : isRoman ? 'Stitching Floor Lines' : 'Stitching Floor Assembly Lines'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'سلائی لائنز، بنڈل پروڈکشن، اوورلاک و فلیٹ لاک مشین کی رفتار اور گھنٹہ وار آؤٹ پٹ'
              : isRoman
              ? 'Hourly sewing output, flatlock/overlock machine allocation aur daily targets'
              : 'Hourly sewing output, flatlock/overlock machine allocation, and daily targets'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stitchingLines.map((line, idx) => (
          <div
            key={idx}
            className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="font-bold text-ink text-sm block">{line.line}</span>
                <span className="text-[11px] font-mono text-muted">Supervisor: {line.supervisor}</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase self-start sm:self-auto ${
                  line.status === 'Completed Line'
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                }`}
              >
                {line.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Active Job</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">
                  #{line.jobNo} ({line.party})
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Garment</span>
                <span className="font-semibold text-ink mt-0.5 block">{line.garment}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Hourly Pace</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{line.hourlyOutput} pcs/hr</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Stitched Units</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">
                  {line.completedQty} / {line.targetQty} pcs ({Math.round((line.completedQty / line.targetQty) * 100)}%)
                </span>
              </div>
            </div>

            <div className="bg-surface-elevated rounded-full h-2 overflow-hidden border border-border">
              <div
                className="bg-ink h-full transition-all duration-300"
                style={{ width: `${(line.completedQty / line.targetQty) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
