'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const { isUrdu, isRoman } = useI18n();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-muted" />
            <span>
              {isUrdu
                ? 'فیکٹری مینوفیکچرنگ و پروڈکشن اینالیٹکس'
                : isRoman
                ? 'Factory Production aur SLA Analytics'
                : 'Factory Production & SLA Analytics'}
            </span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'انکوائری تبادلوں کا تناسب، SLA رسپانس اوقات، اور فیکٹری آؤٹ پٹ کے تفصیلی چارٹس'
              : isRoman
              ? 'Inquiry-to-order conversion rate, SLA first response benchmarks, aur factory unit output ke charts'
              : 'Inquiry-to-order conversion rate, SLA first response benchmarks, and weekly unit outputs'}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">
            {isUrdu ? 'انکوائری کی تبدیلی' : isRoman ? 'Inquiry Conversion' : 'Inquiry Conversion'}
          </span>
          <div className="text-2xl font-extrabold font-mono text-ink">68.4%</div>
          <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {isUrdu ? 'پچھلے مہینے سے +4.2%' : isRoman ? 'Pichlay mahinay se +4.2%' : '+4.2% from last month'}
          </span>
        </div>

        <div className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">
            {isUrdu ? 'اوسط پہلا جواب' : isRoman ? 'Pehla Jawab (Avg Time)' : 'Avg First Response'}
          </span>
          <div className="text-2xl font-extrabold font-mono text-ink">3h 12m</div>
          <span className="text-[11px] text-emerald-500 font-medium">
            {isUrdu ? '8 گھنٹے کے ہدف کے اندر' : isRoman ? '8h target ke andar andar' : 'Within 8h target window'}
          </span>
        </div>

        <div className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">
            {isUrdu ? 'ماہانہ پیداوار' : isRoman ? 'Mahana Production Output' : 'Monthly Output'}
          </span>
          <div className="text-2xl font-extrabold font-mono text-ink">12,480 pcs</div>
          <span className="text-[11px] text-muted font-mono">
            {isUrdu ? 'ہدف: 15,000 دانے' : isRoman ? 'Target: 15,000 pcs' : 'Target: 15,000 pcs'}
          </span>
        </div>

        <div className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">
            {isUrdu ? 'کوالٹی پاس شرح' : isRoman ? 'AQL Pass Rate' : 'AQL Pass Rate'}
          </span>
          <div className="text-2xl font-extrabold font-mono text-ink">97.8%</div>
          <span className="text-[11px] text-emerald-500 font-medium">
            {isUrdu ? 'AQL 1.0 پاس' : isRoman ? 'AQL 1.0 Pass Ho Gaya' : 'AQL 1.0 Passed'}
          </span>
        </div>
      </div>
    </div>
  );
}
