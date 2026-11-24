'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Receipt,
  Layers,
} from 'lucide-react';
import { OwnerAlertItem } from '@/lib/owner-filters';
import { OwnerTileFilter } from '@/components/jobs/OwnerKpiTiles';
import { useI18n } from '@/lib/i18n/context';

interface OwnerExceptionsTabProps {
  alerts: OwnerAlertItem[];
  activeFilter: OwnerTileFilter;
  onClearFilter: () => void;
}

export function OwnerExceptionsTab({
  alerts,
  activeFilter,
  onClearFilter,
}: OwnerExceptionsTabProps) {
  const { isUrdu, isRoman } = useI18n();

  // Filter alerts according to active KPI tile if selected
  const filteredAlerts = alerts.filter((a) => {
    if (!activeFilter) return true;
    if (activeFilter === 'emergency') return a.isEmergency || a.type.toLowerCase().includes('emergency');
    if (activeFilter === 'overdue') return a.type.toLowerCase().includes('overdue');
    if (activeFilter === 'due_soon') return a.type.toLowerCase().includes('due in') || a.type.toLowerCase().includes('due today');
    if (activeFilter === 'target_missed') return a.type.toLowerCase().includes('target');
    if (activeFilter === 'qc_decision') return a.type.toLowerCase().includes('qc');
    if (activeFilter === 'no_target') return a.type.toLowerCase().includes('no target');
    if (activeFilter === 'billing_pending') return a.type.toLowerCase().includes('billing');
    return true;
  });

  const criticalList = filteredAlerts.filter((a) => a.severity === 'critical');
  const warningList = filteredAlerts.filter((a) => a.severity === 'warning');
  const infoList = filteredAlerts.filter((a) => a.severity === 'info');

  return (
    <div className="space-y-6">
      {/* Top Banner when a KPI tile is filtering the list */}
      {activeFilter && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {isUrdu ? 'صرف دکھایا جا رہا ہے:' : isRoman ? 'Sirf dikhaya ja raha hai:' : 'Showing only:'}
            </span>
            <span className="font-mono font-bold uppercase bg-blue-600 text-white px-2 py-0.5 rounded-lg text-[10px]">
              {activeFilter.replace('_', ' ')}
            </span>
            <span className="text-slate-500 font-mono">
              ({filteredAlerts.length}{' '}
              {isUrdu ? 'مطابق آئٹمز' : isRoman ? 'matching items' : 'matching items'})
            </span>
          </div>
          <button
            type="button"
            onClick={onClearFilter}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer underline"
          >
            {isUrdu ? 'تمام توجہ طلب آرڈرز دکھائیں' : isRoman ? 'Sab Exceptions Dekho' : 'Show All Exceptions'}
          </button>
        </div>
      )}

      {/* Tier 1: CRITICAL — Action Needed Now */}
      <div className="bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              {isUrdu
                ? `انتہائی ضروری — فوری فلور ایکشن درکار ہے (${criticalList.length})`
                : isRoman
                ? `Critical — Fauran Action Chahiye (${criticalList.length})`
                : `Critical — Immediate Floor Action Needed (${criticalList.length})`}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-lg">
            {isUrdu ? 'اعلیٰ ترجیح' : isRoman ? 'High Priority' : 'High Priority'}
          </span>
        </div>

        {criticalList.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            {isUrdu
              ? 'کوئی شدید رکاوٹ یا تاخیر نہیں۔ فیکٹری میں کام تسلی بخش انداز سے جاری ہے۔'
              : isRoman
              ? 'Koi critical masla nahi. Production theek chal rahi hai.'
              : 'No critical bottlenecks or overdue emergencies. Production is flowing smoothly.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {criticalList.map((a) => (
              <div
                key={a.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      Job #{a.jobNo}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{a.party}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {a.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {a.reason} —{' '}
                    <span>
                      {isUrdu ? 'موجودہ مرحلہ:' : isRoman ? 'Abhi marhala:' : 'Currently at'}{' '}
                      <strong className="text-slate-700 dark:text-slate-300">{a.stage}</strong>
                    </span>{' '}
                    <span>
                      {isUrdu ? 'ذمہ دار:' : isRoman ? 'zimmadar:' : 'with'}{' '}
                      <strong className="text-slate-700 dark:text-slate-300">{a.responsible}</strong>
                    </span>
                  </p>
                </div>

                <Link
                  href={`/jobs/${a.jobNo}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-2xs flex items-center gap-1 self-start sm:self-auto shrink-0"
                >
                  <span>
                    {isUrdu ? 'مسئلہ حل کریں' : isRoman ? 'Masla Hal Karo (Resolve)' : 'Resolve Job'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tier 2: WARNING — Keep An Eye */}
      <div className="bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              {isUrdu
                ? `انتباہ — نظر رکھیں (${warningList.length})`
                : isRoman
                ? `Warning — Nazar Rakhein (${warningList.length})`
                : `Warning — Keep An Eye (${warningList.length})`}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg">
            {isUrdu ? 'غور سے دیکھیں' : isRoman ? 'Nazar Rakhein' : 'Monitor Closely'}
          </span>
        </div>

        {warningList.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            {isUrdu ? 'فی الوقت کوئی وارننگ الرٹ نہیں۔' : isRoman ? 'Abhi koi warning alert nahi.' : 'No active warning alerts at this time.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {warningList.map((a) => (
              <div
                key={a.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      Job #{a.jobNo}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{a.party}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {a.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {a.reason} —{' '}
                    <span>
                      {isUrdu ? 'مرحلہ:' : isRoman ? 'Stage:' : 'Stage:'}{' '}
                      <strong className="text-slate-700 dark:text-slate-300">{a.stage}</strong>
                    </span>
                  </p>
                </div>

                <Link
                  href={`/jobs/${a.jobNo}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition self-start sm:self-auto shrink-0 flex items-center gap-1"
                >
                  <span>{isUrdu ? 'کھولیں' : isRoman ? 'Kholo' : 'Open'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tier 3: INFO — Track & Coordinate */}
      <div className="bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              {isUrdu
                ? `معلومات اور دفتری ٹریکنگ (${infoList.length})`
                : isRoman
                ? `Info aur Administrative Tracking (${infoList.length})`
                : `Info & Administrative Tracking (${infoList.length})`}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-lg">
            {isUrdu ? 'پیش رفت دیکھیں' : isRoman ? 'Progress Track Karo' : 'Track Progress'}
          </span>
        </div>

        {infoList.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            {isUrdu
              ? 'تمام دفتری اور بلنگ اہداف واضح ہیں۔'
              : isRoman
              ? 'Sab administrative aur billing targets clear hain.'
              : 'All administrative and billing targets are clear.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {infoList.map((a) => (
              <div
                key={a.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      Job #{a.jobNo}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{a.party}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {a.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {a.reason} —{' '}
                    <span>
                      {isUrdu ? 'ذمہ دار:' : isRoman ? 'Zimmadar:' : 'Responsible:'}{' '}
                      <strong className="text-slate-700 dark:text-slate-300">{a.responsible}</strong>
                    </span>
                  </p>
                </div>

                <Link
                  href={`/jobs/${a.jobNo}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition self-start sm:self-auto shrink-0 flex items-center gap-1"
                >
                  <span>{isUrdu ? 'کھولیں' : isRoman ? 'Kholo' : 'Open'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
