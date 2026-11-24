'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Scissors,
  Printer,
  Flame,
  Shirt,
  CheckCircle2,
  Package,
  Truck,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { RealJob } from '@/lib/supabase/data';
import { useI18n } from '@/lib/i18n/context';

interface OwnerBottlenecksTabProps {
  jobs: RealJob[];
  bottlenecks: {
    stage: string;
    name: string;
    count: number;
    pieces: number;
    oldestDays: number;
    jobsWaiting: { jobNo: number; party: string; product: string; qty: number; idleDays: number }[];
  }[];
}

export function OwnerBottlenecksTab({ jobs, bottlenecks }: OwnerBottlenecksTabProps) {
  const { isUrdu, isRoman } = useI18n();
  const [expandedStage, setExpandedStage] = useState<string | null>(bottlenecks[0]?.stage || null);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'cutting':
        return <Scissors className="w-4 h-4 text-amber-500" />;
      case 'printing':
        return <Printer className="w-4 h-4 text-blue-500" />;
      case 'heatTransfer':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'stitching':
        return <Shirt className="w-4 h-4 text-purple-500" />;
      case 'quality':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'packing':
        return <Package className="w-4 h-4 text-sky-500" />;
      case 'dispatch':
        return <Truck className="w-4 h-4 text-indigo-500" />;
      default:
        return <Scissors className="w-4 h-4 text-slate-400" />;
    }
  };

  const maxPieces = Math.max(...bottlenecks.map((b) => b.pieces), 100);

  return (
    <div className="bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {isUrdu
            ? 'مراحل کی رکاوٹیں اور زیر التواء کام (تمام ۱۰ مراحل)'
            : isRoman
            ? 'Marahil Ki Rokawat aur Pending Kaam (Sab 10 Stages)'
            : 'Stage Backlogs & Work Bottlenecks (All 10 Stages)'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isUrdu
            ? 'رکے ہوئے کام کے مراحل، زیادہ سے کم کی ترتیب میں۔ کسی بھی مرحلے پر کلک کر کے منتظر جابز کی تفصیل دیکھیں۔'
            : isRoman
            ? 'Ruke hue kaam ke stages, zyada se kam ki tarteeb mein. Kisi bhi stage par click kar ke waiting jobs check karein.'
            : 'Stages with stuck work ranked from heaviest to lightest. Click any stage row to expand and inspect the specific jobs waiting in line.'}
        </p>
      </div>

      <div className="space-y-3">
        {bottlenecks.map((st, idx) => {
          const isExpanded = expandedStage === st.stage;
          const isHeaviest = idx === 0 && st.pieces > 0;
          const barWidthPercent = Math.min(100, Math.max(6, (st.pieces / maxPieces) * 100));

          return (
            <div
              key={st.stage}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isHeaviest
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface'
              }`}
            >
              {/* Stage Header Row */}
              <button
                type="button"
                onClick={() => setExpandedStage(isExpanded ? null : st.stage)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shrink-0">
                    {getStageIcon(st.stage)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {st.name}
                      </span>
                      {isHeaviest && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
                          {isUrdu ? 'سب سے بڑی رکاوٹ' : isRoman ? 'Sab Se Barri Rokawat' : 'Heaviest Bottleneck'}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {st.count} {isUrdu ? 'اوپن آرڈرز لائن میں' : isRoman ? 'open orders waiting' : 'open orders waiting'} •{' '}
                      {isUrdu ? 'سب سے پرانا:' : isRoman ? 'Oldest:' : 'Oldest waiting'}{' '}
                      {st.oldestDays} {isUrdu ? 'دن سے منتظر' : isRoman ? 'd waiting' : 'days'}
                    </div>
                  </div>
                </div>

                {/* Right side: Piece Count & Capacity Bar */}
                <div className="flex items-center gap-4 sm:ml-auto shrink-0 w-full sm:w-64">
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-slate-400 text-[10px] uppercase">
                        {isUrdu ? 'منتظر کپڑے:' : isRoman ? 'Waiting Pieces:' : 'Waiting Pieces:'}
                      </span>
                      <span className={isHeaviest ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}>
                        {st.pieces.toLocaleString()} {isUrdu ? 'پیسز' : isRoman ? 'pcs' : 'pcs'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHeaviest ? 'bg-rose-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${barWidthPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </button>

              {/* Expandable Drill-Down Table */}
              {isExpanded && (
                <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80">
                  {st.jobsWaiting.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 font-mono">
                      {isUrdu
                        ? 'اس مرحلے میں فی الوقت کوئی جاب نہیں رکی ہوئی ہے۔'
                        : isRoman
                        ? 'Is stage mein abhi koi job nahi ruki hui.'
                        : 'No jobs currently queued at this station.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase text-slate-400 font-bold">
                            <th className="pb-2">Job #</th>
                            <th className="pb-2">{isUrdu ? 'گاہک' : isRoman ? 'Customer' : 'Customer'}</th>
                            <th className="pb-2">{isUrdu ? 'پروڈکٹ' : isRoman ? 'Product' : 'Product'}</th>
                            <th className="pb-2 text-right">{isUrdu ? 'منتظر تعداد' : isRoman ? 'Waiting Qty' : 'Waiting Qty'}</th>
                            <th className="pb-2 text-right">{isUrdu ? 'رکا ہوا وقت' : isRoman ? 'Idle Time' : 'Idle Time'}</th>
                            <th className="pb-2 text-right">{isUrdu ? 'کارروائی' : isRoman ? 'Action' : 'Action'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {st.jobsWaiting.map((j) => (
                            <tr key={j.jobNo} className="hover:bg-surface-elevated dark:hover:bg-slate-850">
                              <td className="py-2.5 font-mono font-bold text-slate-900 dark:text-white">
                                #{j.jobNo}
                              </td>
                              <td className="py-2.5 text-slate-700 dark:text-slate-300 font-medium">
                                {j.party}
                              </td>
                              <td className="py-2.5 text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                {j.product}
                              </td>
                              <td className="py-2.5 font-mono font-bold text-slate-900 dark:text-white text-right">
                                {j.qty} {isUrdu ? 'پیسز' : isRoman ? 'pcs' : 'pcs'}
                              </td>
                              <td className="py-2.5 font-mono text-slate-400 text-right">
                                {j.idleDays}{isUrdu ? ' دن سے منتظر' : isRoman ? 'd waiting' : 'd waiting'}
                              </td>
                              <td className="py-2.5 text-right">
                                <Link
                                  href={`/jobs/${j.jobNo}`}
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-bold font-mono inline-flex items-center gap-1"
                                >
                                  <span>{isUrdu ? 'جاب کھولیں' : isRoman ? 'Job Kholo' : 'Open'}</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
