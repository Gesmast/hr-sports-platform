'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Compass,
  Calendar,
  Layers,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

export default function CoordinatorTargetsPage() {
  const { t, isUrdu, isRoman } = useI18n();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const targetPlan = [
    {
      jobNo: 10128,
      party: 'MOIZ HR SHOP',
      product: 'Sublimated Jersey (15 pcs)',
      priority: 'Normal',
      stages: [
        { name: 'Printing', targetQty: 15, completed: 15, status: 'Complete', timing: 'Morning' },
        { name: 'Heat Transfer', targetQty: 15, completed: 15, status: 'Complete', timing: 'Midday' },
        { name: 'Cutting', targetQty: 15, completed: 15, status: 'Complete', timing: 'Midday' },
        { name: 'Stitching', targetQty: 15, completed: 15, status: 'Complete', timing: 'Afternoon' },
        { name: 'QC (Ashfaq)', targetQty: 15, completed: 14, status: 'In Process', timing: 'Late Target' },
        { name: 'Packing', targetQty: 15, completed: 0, status: 'Pending', timing: 'Evening' },
      ],
    },
    {
      jobNo: 10126,
      party: 'MOIZ HR SHOP',
      product: 'AC Milan Home Jersey (15 pcs)',
      priority: 'Urgent',
      stages: [
        { name: 'Printing', targetQty: 15, completed: 15, status: 'Complete', timing: 'Morning' },
        { name: 'Heat Transfer', targetQty: 15, completed: 15, status: 'Complete', timing: 'Morning' },
        { name: 'Cutting', targetQty: 15, completed: 15, status: 'Complete', timing: 'Midday' },
        { name: 'Stitching', targetQty: 15, completed: 10, status: 'In Process', timing: 'Afternoon' },
        { name: 'QC', targetQty: 15, completed: 0, status: 'Pending', timing: 'Evening' },
        { name: 'Packing', targetQty: 15, completed: 0, status: 'Pending', timing: 'Night' },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Operations Coordination & Target Dispatch</span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            {isUrdu ? 'روزانہ کے اہداف و پروڈکشن شیڈولنگ' : isRoman ? 'Daily Production Targets' : 'Daily Floor Target Planning & Scheduling'}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            {isUrdu
              ? 'حمزہ (کوآرڈینیٹر) کے اہداف: تاریخ منتخب کریں، ہر مرحلے کی مطلوبہ مقدار اور ٹائمنگ کا تعین کریں۔'
              : isRoman
              ? 'Hamza (Coordinator) targets: tareekh select karein aur har stage ke piece targets set karein.'
              : 'Hamza (Coordinator) target desk: date selection, piece targets per stage, and automated delay tracking.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-base border border-border bg-surface text-xs font-mono shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-muted" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Target Jobs Grid */}
      <div className="space-y-4">
        {targetPlan.map((plan) => (
          <div key={plan.jobNo} className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-extrabold text-base text-ink">Job #{plan.jobNo}</span>
                <span className="text-muted">•</span>
                <span className="font-bold text-sm text-ink">{plan.party}</span>
                <span className="text-muted text-xs">({plan.product})</span>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  plan.priority === 'Urgent'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-surface-elevated text-muted border border-border'
                }`}
              >
                Priority: {plan.priority}
              </span>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {plan.stages.map((st, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border text-xs space-y-2 ${
                    st.status === 'Complete'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : st.status === 'In Process'
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-border bg-surface-elevated'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-ink">
                    <span>{st.name}</span>
                    {st.status === 'Complete' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {st.status === 'In Process' && <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                  </div>

                  <div>
                    <div className="font-mono text-base font-bold text-ink tabular-numbers">
                      {st.completed} / {st.targetQty}
                    </div>
                    <div className="text-[10px] text-muted">Target: {st.timing}</div>
                  </div>

                  <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${st.status === 'Complete' ? 'bg-emerald-500' : 'bg-amber-400'}`}
                      style={{ width: `${(st.completed / st.targetQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
