'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

export interface FactoryHealthMetrics {
  onTimeDeliveryRate: number; // e.g. 94.2%
  targetAchievementRate: number; // e.g. 91.8%
  qcPassRate: number; // e.g. 97.4%
  qcRejectRate: number; // e.g. 2.6% (Warning if > 5%)
  activeWipUnits: number; // e.g. 2,103 pcs
  wipOld10DaysCount: number; // e.g. 3 jobs older than 10 days
  heaviestStageName: string; // e.g. "Cutting Station"
  heaviestStagePieces: number; // e.g. 840 pcs
}

interface FactoryHealthBarProps {
  metrics?: FactoryHealthMetrics;
}

export function FactoryHealthBar({
  metrics = {
    onTimeDeliveryRate: 94.2,
    targetAchievementRate: 91.8,
    qcPassRate: 97.4,
    qcRejectRate: 2.6,
    activeWipUnits: 2103,
    wipOld10DaysCount: 3,
    heaviestStageName: 'Cutting Station',
    heaviestStagePieces: 840,
  },
}: FactoryHealthBarProps) {
  const isQcWarning = metrics.qcRejectRate > 5.0;
  const isDeliveryWarning = metrics.onTimeDeliveryRate < 90.0;

  return (
    <div className="bg-white dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Factory Health & Quality Rates
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Real-time operational efficiency benchmarks across all floor stations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Factory Running Smoothly
          </span>
        </div>
      </div>

      {/* 4 Primary Rate Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: On-Time Delivery Rate */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              On-Time Delivery
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {metrics.onTimeDeliveryRate}%
            </span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4%
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isDeliveryWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${metrics.onTimeDeliveryRate}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {metrics.onTimeDeliveryRate >= 90 ? 'Healthy target (>90%)' : 'Needs attention'}
          </span>
        </div>

        {/* Metric 2: Floor Target Achievement Rate */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Target Completed
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {metrics.targetAchievementRate}%
            </span>
            <span className="text-[11px] font-mono text-slate-400">Daily Average</span>
          </div>

          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${metrics.targetAchievementRate}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Completed vs assigned pieces
          </span>
        </div>

        {/* Metric 3: QC Pass Rate vs Defect Reject Rate */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              QC Pass Rate
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {metrics.qcPassRate}%
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isQcWarning
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {metrics.qcRejectRate}% Rejects
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500" style={{ width: `${metrics.qcPassRate}%` }} />
            <div className="h-full bg-rose-500" style={{ width: `${metrics.qcRejectRate}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {metrics.qcRejectRate < 5.0 ? 'Acceptable (<5% tolerance)' : 'High Defect Warning'}
          </span>
        </div>

        {/* Metric 4: Aging Work (WIP 10+ Days) & Top Load */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Work In Progress (WIP)
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {metrics.activeWipUnits.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400 font-bold">Total Pieces</span>
          </div>

          <div className="pt-0.5 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Busiest Station:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
              {metrics.heaviestStageName}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Stuck &gt;10 Days:</span>
            <span className={metrics.wipOld10DaysCount > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
              {metrics.wipOld10DaysCount} Orders
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
