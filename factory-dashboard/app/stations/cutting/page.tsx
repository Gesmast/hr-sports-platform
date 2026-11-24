'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Scissors, CheckCircle2, Clock, AlertCircle, Layers, ArrowRight } from 'lucide-react';

export default function CuttingStationPage() {
  const { isUrdu, isRoman } = useI18n();

  const [cuttingJobs, setCuttingJobs] = useState([
    {
      jobNo: 10101,
      party: 'FC BAVARIA ACADEMY',
      garment: 'Sublimated Jersey + Shorts',
      qty: 120,
      fabric: 'Interlock 75D Micro Poly',
      layers: 24,
      table: 'Table 1 (CNC Laser)',
      status: 'In Cutting',
      completedQty: 60,
    },
    {
      jobNo: 10102,
      party: 'ATLETICO MADRID ACADEMY',
      garment: 'Training Warm-up Hoodie',
      qty: 250,
      fabric: 'Brushed Fleece 320 GSM',
      layers: 50,
      table: 'Table 2 (Manual Knife)',
      status: 'Queued',
      completedQty: 0,
    },
    {
      jobNo: 10104,
      party: 'OLYMPIQUE LYON YOUTH',
      garment: 'Track Jacket + Pants',
      qty: 85,
      fabric: 'Taslan Crinkle Nylon',
      layers: 17,
      table: 'Table 1 (CNC Laser)',
      status: 'Completed',
      completedQty: 85,
    },
  ]);

  const markJobComplete = (jobNo: number) => {
    setCuttingJobs(
      cuttingJobs.map((j) =>
        j.jobNo === jobNo ? { ...j, status: 'Completed', completedQty: j.qty } : j
      )
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Scissors className="w-6 h-6 text-muted" />
            <span>{isUrdu ? 'کٹنگ ڈیپارٹمنٹ ورک اسٹیشن' : isRoman ? 'Cutting Station' : 'Cutting Department Station'}</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            {isUrdu
              ? 'لیزر و مینوئل کٹنگ ٹیبلز، فیبرک لیئرز، اور بنڈل پروڈکشن مانیٹرنگ'
              : isRoman
              ? 'CNC Laser aur manual cutting tables, fabric layers aur bundle tagging'
              : 'CNC Laser and manual cutting tables, fabric layer spread, and bundle tagging'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-base border border-border bg-surface text-xs font-mono">
            <span className="text-muted">Total Active Cut: </span>
            <span className="font-bold text-ink">455 pcs</span>
          </div>
        </div>
      </div>

      {/* Cutting Jobs Queue */}
      <div className="grid grid-cols-1 gap-4">
        {cuttingJobs.map((job) => (
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
                  job.status === 'Completed'
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : job.status === 'In Cutting'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    : 'bg-surface-elevated text-muted border border-border'
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Fabric Spec</span>
                <span className="font-semibold text-ink mt-0.5 block">{job.fabric}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Layer Spread</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">{job.layers} layers</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Assigned Table</span>
                <span className="font-semibold text-ink mt-0.5 block">{job.table}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase text-muted">Completed Progress</span>
                <span className="font-mono font-bold text-ink mt-0.5 block">
                  {job.completedQty} / {job.qty} pcs ({Math.round((job.completedQty / job.qty) * 100)}%)
                </span>
              </div>
            </div>

            {/* Progress Bar & Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex-1 bg-surface-elevated rounded-full h-2 overflow-hidden border border-border">
                <div
                  className="bg-ink h-full transition-all duration-300"
                  style={{ width: `${(job.completedQty / job.qty) * 100}%` }}
                />
              </div>

              {job.status !== 'Completed' && (
                <button
                  onClick={() => markJobComplete(job.jobNo)}
                  className="px-3.5 py-1.5 rounded-base bg-ink text-surface hover:opacity-90 text-xs font-bold font-mono transition cursor-pointer shadow-2xs shrink-0 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'مکمل کٹنگ نشان زد کریں' : isRoman ? 'Cutting Mukammal Mark Karo' : 'Mark Cut Complete'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
