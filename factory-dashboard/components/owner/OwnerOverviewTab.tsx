'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Scissors,
  Printer,
  Shirt,
  Package,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { RealJob } from '@/lib/supabase/data';
import { OwnerQcDecision, OwnerAlertItem } from '@/lib/owner-filters';
import { FactoryHealthScores } from '@/components/owner/FactoryHealthScores';
import { OwnerPingsCard } from '@/components/owner/OwnerPingsCard';
import { useI18n } from '@/lib/i18n/context';

interface OwnerOverviewTabProps {
  jobs: RealJob[];
  qcDecisions: OwnerQcDecision[];
  topAlerts: OwnerAlertItem[];
  bottlenecks: { stage: string; name: string; count: number; pieces: number; oldestDays: number }[];
  onResolveQc: (jobNo: number, action: 'rework' | 'continue') => void;
  onSelectTab: (tabId: string) => void;
}

export function OwnerOverviewTab({
  jobs,
  qcDecisions,
  topAlerts,
  bottlenecks,
  onResolveQc,
  onSelectTab,
}: OwnerOverviewTabProps) {
  const { isUrdu, isRoman, l } = useI18n();

  // Compute dynamic factory health rates
  const totalJobs = jobs.length || 1;
  const onTimeJobs = jobs.filter((j) => {
    if (!j.delivery_date) return true;
    return new Date(j.delivery_date).getTime() >= Date.now();
  }).length;
  const onTimeRate = Math.round((onTimeJobs / totalJobs) * 100);

  const totalWipPieces = jobs.reduce((sum, j) => sum + (j.totalQty || 0), 0) || 2103;
  const heaviest = bottlenecks[0] || { name: 'Cutting Station', pieces: 840 };

  return (
    <div className="space-y-6">
      {/* 0. Executive Department Health Scores & Staff Individual Performance Report */}
      <FactoryHealthScores />

      {/* 1. QC Rejected — Owner Decision Card (Animated highlight when defects exist) */}
      <AnimatePresence>
        {qcDecisions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-r from-rose-50/90 via-surface to-rose-50/50 dark:from-rose-950/40 dark:via-surface dark:to-rose-950/20 p-5 sm:p-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-rose-950 dark:text-rose-200">
                      {isUrdu
                        ? 'کوالٹی انسپیکشن میں مسترد — آپ کا فیصلہ درکار ہے'
                        : isRoman
                        ? 'QC Inspection Rejects — Aap Ka Faisla Chahiye'
                        : 'Quality Inspection Rejects — Your Decision Needed'}
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-rose-200/70 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200 px-2 py-0.5 rounded-full">
                      {qcDecisions.length}{' '}
                      {isUrdu
                        ? 'کیسز'
                        : isRoman
                        ? 'Open Cases'
                        : `Open Case${qcDecisions.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                    {isUrdu
                      ? 'کپڑے کوالٹی چیک میں فیل ہو گئے ہیں۔ درزی کو مرمت کے لیے واپس بھیجیں یا ضائع کر کے آگے بڑھائیں۔'
                      : isRoman
                      ? 'Pieces inspection mein fail ho gaye. Tailor ko theek karne ke liye wapis bhejein ya scrap kar ke aage barhein.'
                      : 'Garments failed inspection. Choose whether to return them to the tailor for repair or scrap them and proceed.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-rose-100/80 dark:divide-rose-900/40 pt-1">
              {qcDecisions.map((qc) => (
                <div
                  key={qc.jobNo}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                        Job #{qc.jobNo}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{qc.party}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 dark:text-slate-300">{qc.product}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-rose-700 dark:text-rose-300">
                      <span className="font-bold">
                        {qc.rejectedQty}{' '}
                        {isUrdu ? 'پیسز کوالٹی میں فیل ہوئے' : isRoman ? 'pieces fail hue' : 'pieces failed inspection'}
                      </span>
                      <span>
                        ({isUrdu ? 'نقص:' : isRoman ? 'Nuqs:' : 'Defect:'} {qc.defectCategory} {isUrdu ? 'مقام:' : isRoman ? 'at' : 'at'} {qc.sourceDept})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onResolveQc(qc.jobNo, 'rework')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>
                        {isUrdu ? 'مرمت کے لیے بھیجیں' : isRoman ? 'Rework Ke Liye Bhejo' : 'Send to Rework'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onResolveQc(qc.jobNo, 'continue')}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <span>
                        {isUrdu ? 'ضائع کر کے آگے چلائیں' : isRoman ? 'Scrap Kar Ke Aage Chalao' : 'Scrap & Continue'}
                      </span>
                    </button>

                    <Link
                      href={`/jobs/${qc.jobNo}`}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 transition"
                      title="Inspect Job Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Two-Column Split: Top Alerts Feed (Left) & Top Bottlenecks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Top Critical & Warning Alerts */}
        <div className="lg:col-span-8 bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isUrdu
                    ? 'توجہ طلب اہم الرٹس'
                    : isRoman
                    ? 'Tawajjah Talab Zaroori Alerts'
                    : 'Top Alerts Requiring Attention'}
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  {topAlerts.length}{' '}
                  {isUrdu
                    ? 'آج کے کل آپریشنل نوٹسز'
                    : isRoman
                    ? 'aaj ke kul notices'
                    : 'total operational notices today'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('exceptions')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>
                {isUrdu
                  ? 'تمام ایکسیپشنز میٹرکس دیکھیں'
                  : isRoman
                  ? 'Tamam Exceptions Matrix Dekho'
                  : 'View All Exceptions Matrix'}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topAlerts.slice(0, 8).map((alert) => (
              <motion.div
                key={alert.id}
                whileHover={{ scale: 1.005 }}
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/90 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        Job #{alert.jobNo}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        • {alert.party}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          alert.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                        }`}
                      >
                        {alert.type}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      <span>{alert.reason}</span>
                      <span className="mx-1">•</span>
                      <span>
                        {isUrdu ? 'موجودہ مرحلہ:' : isRoman ? 'Abhi:' : 'Now at:'} {alert.stage}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="font-mono font-bold">
                        {isUrdu ? 'ذمہ دار:' : isRoman ? 'Zimmadar:' : 'With:'} {alert.responsible}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/jobs/${alert.jobNo}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:border-blue-400 transition shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <span>{isUrdu ? 'کھولیں' : isRoman ? 'Kholo' : 'Open'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Staff Pings & Stage Backlogs Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Staff Pings & Important Notes Card */}
          <OwnerPingsCard />

          {/* 2. Busiest Production Stations Card */}
          <div className="bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isUrdu
                    ? 'مصروف ترین پروڈکشن مراحل'
                    : isRoman
                    ? 'Sab Se Masroof Production Stations'
                    : 'Busiest Production Stations'}
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  {isUrdu
                    ? 'لائن میں رکے ہوئے کپڑوں کی بنیاد پر ترتیب'
                    : isRoman
                    ? 'Line mein ruke hue pieces ke hisaab se'
                    : 'Ranked by backlog pieces in line'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectTab('bottlenecks')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {isUrdu ? 'تمام ۱۰ دیکھیں' : isRoman ? 'Sab 10 Dekho' : 'See All 10'}
              </button>
            </div>

            <div className="space-y-3">
              {bottlenecks.slice(0, 5).map((st, idx) => (
                <div
                  key={st.stage}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">0{idx + 1}.</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {st.name}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                      {st.pieces.toLocaleString()} {isUrdu ? 'پیسز' : isRoman ? 'pcs' : 'pcs'}
                    </span>
                  </div>

                  {/* Progress Visual Bar */}
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(12, (st.pieces / 1200) * 100))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>
                      {st.count}{' '}
                      {isUrdu ? 'اوپن جابز لائن میں' : isRoman ? 'open jobs line mein' : 'open jobs in line'}
                    </span>
                    <span>
                      {isUrdu ? 'سب سے پرانا:' : isRoman ? 'Oldest:' : 'Oldest:'} {st.oldestDays}
                      {isUrdu ? ' دن سے منتظر' : isRoman ? 'd waiting' : 'd waiting'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
