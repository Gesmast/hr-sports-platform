'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Flame, CheckCircle2, Clock } from 'lucide-react';

export default function HeatTransferStationPage() {
  const { isUrdu, isRoman } = useI18n();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Flame className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'ہیٹ ٹرانسفر و روٹری کیلنڈر' : isRoman ? 'Heat Transfer Station' : 'Heat Transfer & Rotary Calender Station'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'تھرمل پریس کیلیبریشن (210°C)، ڈوئل پریشر، اور فیبرک فیڈنگ کنٹرول'
              : isRoman
              ? 'Thermal press (210°C), pressure aur fabric feed speed control'
              : 'Rotary drum temperature calibration (210°C), pneumatic pressure, and fabric feed speed'}
          </p>
        </div>
      </div>

      <div className="p-5 rounded-base border border-border bg-surface shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-extrabold text-ink">#10101</span>
            <span className="text-muted">•</span>
            <span className="font-bold text-ink text-sm">FC BAVARIA ACADEMY</span>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
            Heat Transfer In Progress
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Calender Drum Temp</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">212°C Steady</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Feed Velocity</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">1.8 m/min</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Dwell Time</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">28 seconds</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase text-muted">Transferred Pieces</span>
            <span className="font-mono font-bold text-ink mt-0.5 block">95 / 120 pcs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
