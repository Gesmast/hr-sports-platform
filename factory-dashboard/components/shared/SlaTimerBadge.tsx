'use client';

import React, { useState, useEffect } from 'react';
import { calculateFirstResponseSla, SlaCalculation } from '@/lib/sla-engine';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

interface SlaTimerBadgeProps {
  createdAt: string;
  isFirstResponseMet: boolean;
  deadline?: string | null;
  compact?: boolean;
}

export function SlaTimerBadge({
  createdAt,
  isFirstResponseMet,
  deadline,
  compact = false,
}: SlaTimerBadgeProps) {
  const { t, isUrdu, isRoman } = useI18n();
  const [sla, setSla] = useState<SlaCalculation>(() =>
    calculateFirstResponseSla(createdAt, isFirstResponseMet, deadline)
  );

  useEffect(() => {
    // Tick every 30 seconds for live countdown
    const timer = setInterval(() => {
      setSla(calculateFirstResponseSla(createdAt, isFirstResponseMet, deadline));
    }, 30000);

    return () => clearInterval(timer);
  }, [createdAt, isFirstResponseMet, deadline]);

  if (sla.status === 'MET') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
        <span>{isUrdu ? '8 گھنٹے ایس ایل اے پورا' : isRoman ? '8h SLA Poora' : '8h SLA Met'}</span>
      </span>
    );
  }

  if (sla.isOverdue) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2] dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40 animate-pulse">
        <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
        <span>
          {isUrdu
            ? `${sla.formattedOverdue} تاخیر`
            : isRoman
            ? `${sla.formattedOverdue} late ho gaya`
            : `Overdue by ${sla.formattedOverdue}`}
        </span>
      </span>
    );
  }

  if (sla.isNearOverdue) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40">
        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] animate-bounce" />
        <span>
          {isUrdu
            ? `انتباہ: ${sla.formattedRemaining} باقی`
            : isRoman
            ? `Warning: ${sla.formattedRemaining} baaki`
            : `1hr Warning (${sla.formattedRemaining} left)`}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] dark:bg-surface-elevated dark:text-muted dark:border-border">
      <Clock className="w-3.5 h-3.5 text-[#64748B]" />
      <span>
        {isUrdu
          ? `${sla.formattedRemaining} باقی`
          : isRoman
          ? `${sla.formattedRemaining} baaki hai`
          : `${sla.formattedRemaining} left`}
      </span>
    </span>
  );
}
