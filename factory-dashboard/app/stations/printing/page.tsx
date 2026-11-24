'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Printer, CheckCircle2, Flame, AlertCircle } from 'lucide-react';

export default function PrintingStationPage() {
  const { isUrdu, isRoman } = useI18n();

  const [printJobs, setPrintJobs] = useState([
    {
      jobNo: 10101,
      party: 'FC BAVARIA ACADEMY',
      garment: 'Sublimated Jersey + Shorts',
      qty: 120,
      paperRoll: '160 GSM Sublimation Roll #4',
      plotter: 'Mimaki TS300P-1800 (Plotter A)',
      ripFile: 'Bavaria_Away_FullSub_V2.eps',
      status: 'Printing Active',
      completedMeters: 45,
      totalMeters: 90,
    },
    {
      jobNo: 10103,
      party: 'INTER MIAMI YOUTH',
      garment: 'Goalkeeper Jersey Pack',
      qty: 40,
      paperRoll: '160 GSM Sublimation Roll #2',
      plotter: 'Mimaki TS300P-1800 (Plotter B)',
      ripFile: 'Miami_GK_NeonPink_V1.eps',
      status: 'Ready for Calender Press',
      completedMeters: 30,
      totalMeters: 30,
    },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Printer className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'سبلیمیشن پرنٹنگ ورک اسٹیشن' : isRoman ? 'Printing aur Sublimation Station' : 'Sublimation Printing Station'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'ہائی ریزولوشن پلاٹرز، آر آئی پی ویکٹر فائلز، اور سبلیمیشن پیپر رولز'
              : isRoman
              ? 'High-speed sublimation plotters, RIP files aur transfer paper rolls'
              : 'High-speed sublimation plotters, RIP vector calibration, and transfer paper rolls'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {printJobs.map((job) => (
          <div
            key={job.jobNo}
            className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-extrabold text-ink">#{job.jobNo}</span>
                <span className="text-muted">•</span>
                <span className="font-bold text-ink text-sm">{job.party}</span>
                <span className="text-muted">•</span>
                <span className="text-xs font-mono text-muted">{job.garment}</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase self-start sm:self-auto ${
                  job.status === 'Ready for Calender Press'
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Machine / Plotter</span>
                <span className="font-semibold text-ink mt-0.5 block">{job.plotter}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Paper Spec</span>
                <span className="font-semibold text-ink mt-0.5 block">{job.paperRoll}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">RIP Artwork</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{job.ripFile}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Linear Meters Run</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">
                  {job.completedMeters}m / {job.totalMeters}m
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
