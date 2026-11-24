'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, ArrowRight, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export interface EmergencyJob {
  jobNo: number;
  party: string;
  club?: string;
  stagesPending: string[];
  deadline: string; // e.g. "2026-11-24T18:00:00"
  reason: string;
}

interface EmergencyStripProps {
  emergencies: EmergencyJob[];
  canEndEmergency?: boolean;
  onEndEmergency?: (jobNo: number) => void;
}

export function EmergencyStrip({
  emergencies,
  canEndEmergency = false,
  onEndEmergency,
}: EmergencyStripProps) {
  const { isUrdu, isRoman } = useI18n();
  const [now, setNow] = useState(Date.now());

  // Update timer every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!emergencies || emergencies.length === 0) return null;

  return (
    <div className="w-full space-y-2 mb-5">
      {emergencies.map((job) => {
        const deadlineMs = new Date(job.deadline).getTime();
        const diffMs = deadlineMs - now;
        const isLate = diffMs <= 0;

        const hoursLeft = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)));
        const minutesLeft = Math.abs(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));

        const countdownText = isLate
          ? isUrdu
            ? `وقت گزر چکا ہے — ${hoursLeft} گھنٹے ${minutesLeft} منٹ قبل`
            : isRoman
            ? `Time guzar chuka hai — ${hoursLeft}h ${minutesLeft}m pehle`
            : `Deadline Passed — ${hoursLeft}h ${minutesLeft}m ago`
          : isUrdu
          ? `${hoursLeft} گھنٹے ${minutesLeft} منٹ باقی`
          : isRoman
          ? `${hoursLeft}h ${minutesLeft}m baaqi hain`
          : `${hoursLeft}h ${minutesLeft}m remaining`;

        return (
          <motion.div
            key={job.jobNo}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`w-full rounded-2xl border px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs transition-all ${
              isLate
                ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 animate-pulse'
                : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
            }`}
          >
            {/* Left: Emergency Tag & Job Details */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                  isLate
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-amber-600 text-white shadow-xs'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs">
                    Job #{job.jobNo}
                  </span>
                  <span className="font-semibold text-xs truncate">
                    {job.party} {job.club ? `(${job.club})` : ''}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      isLate
                        ? 'bg-rose-200/80 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200'
                        : 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200'
                    }`}
                  >
                    {isUrdu ? 'ارجنٹ ایمرجنسی' : isRoman ? 'Emergency Priority' : 'Priority Emergency'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] opacity-80 mt-0.5 flex-wrap">
                  <span>
                    {isUrdu ? 'زیر التواء مراحل:' : isRoman ? 'Pending Marahil:' : 'Pending:'}{' '}
                    {job.stagesPending.join(', ')}
                  </span>
                  <span>•</span>
                  <span>
                    {isUrdu ? 'وجہ:' : isRoman ? 'Wajah:' : 'Reason:'} {job.reason}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Countdown & Action */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <div
                className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${
                  isLate
                    ? 'border-rose-300 dark:border-rose-800 bg-white/70 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                    : 'border-amber-300 dark:border-amber-800 bg-white/70 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{countdownText}</span>
              </div>

              {canEndEmergency && onEndEmergency && (
                <button
                  type="button"
                  onClick={() => onEndEmergency(job.jobNo)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-slate-700 dark:text-slate-300 shadow-2xs"
                  title="Mark emergency as resolved"
                >
                  {isUrdu ? 'ایمرجنسی ختم کریں' : isRoman ? 'Emergency Khatam Karo' : 'Clear Emergency'}
                </button>
              )}

              <Link
                href={`/jobs/${job.jobNo}`}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <span>{isUrdu ? 'جاب کھولیں' : isRoman ? 'Job Kholo' : 'Open Job'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
