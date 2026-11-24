'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check,
  XCircle,
} from 'lucide-react';

export default function QualityControlKioskPage() {
  const { t, isUrdu, isRoman } = useI18n();

  const [activeJob, setActiveJob] = useState({
    jobNo: 10128,
    party: 'MOIZ HR SHOP',
    product: 'Sublimated Jersey',
    totalQty: 15,
    stitchingPassed: 15,
  });

  const [passedQty, setPassedQty] = useState(14);
  const [reworkQty, setReworkQty] = useState(1);
  const [rejectedQty, setRejectedQty] = useState(0);
  const [defectCategory, setDefectCategory] = useState('Collar / Neck Issue');
  const [reworkTarget, setReworkTarget] = useState('stitching');
  const [reworkNotes, setReworkNotes] = useState('Collar alignment is 0.5 inches off on size L.');
  const [submitted, setSubmitted] = useState(false);

  const defectCategories = [
    'Stitching Issue',
    'Print Issue',
    'Heat Transfer Issue',
    'Cutting Issue',
    'Size / Measurement Issue',
    'Shade / Colour Issue',
    'Collar / Neck Issue',
    'Finishing Issue',
  ];

  const handleSubmitQc = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Kiosk Header */}
      <div className="p-5 rounded-base border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Station #05 • Quality Inspection Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            {isUrdu ? 'کوالٹی کنٹرول (QC) انسپیکشن کیوسک' : isRoman ? 'Quality Control (QC) Kiosk' : 'Quality Control & Defect Routing Kiosk'}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            {isUrdu
              ? 'سلائی مکمل ہونے کے بعد کپڑوں کی تفصیلی جانچ، پاس/ریورک کی مقدار اور ڈیفیکٹ کا اندراج۔'
              : isRoman
              ? 'Stitching ke baad kapron ki testing, pass aur rework pieces ka record.'
              : 'Sign off on stitching handovers, record passed vs rework garments, and route defects back to floor.'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-base border border-border bg-surface-elevated text-xs font-mono font-bold text-ink">
          Inspector: Ashfaq
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-base border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>QC Inspection logged! 14 pieces passed to Clipping/Pressing. 1 piece routed to Stitching for rework.</span>
        </div>
      )}

      {/* Active Inspection Card */}
      <div className="p-6 rounded-base border border-border bg-surface shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="text-xs font-mono text-muted uppercase">Currently Inspecting</div>
            <div className="text-xl font-extrabold text-ink font-mono mt-0.5">
              Job #{activeJob.jobNo} • {activeJob.party}
            </div>
            <div className="text-xs text-muted mt-0.5">
              {activeJob.product} ({activeJob.totalQty} pcs batch)
            </div>
          </div>

          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-ink text-surface shadow-2xs">
            Batch Size: {activeJob.totalQty} Pcs
          </span>
        </div>

        {/* Piece Counters: Passed, Rework, Rejected */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Passed */}
          <div className="p-4 rounded-base border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                Passed Pieces
              </span>
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPassedQty(Math.max(0, passedQty - 1))}
                className="w-8 h-8 rounded border border-border bg-surface text-ink font-bold hover:bg-surface-elevated transition"
              >
                -
              </button>
              <span className="text-3xl font-extrabold font-mono text-ink tabular-numbers">{passedQty}</span>
              <button
                onClick={() => setPassedQty(passedQty + 1)}
                className="w-8 h-8 rounded border border-border bg-surface text-ink font-bold hover:bg-surface-elevated transition"
              >
                +
              </button>
            </div>
            <div className="text-[11px] text-muted">Advances to Clipping & Pressing</div>
          </div>

          {/* Rework */}
          <div className="p-4 rounded-base border border-amber-500/30 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase font-mono">
                Rework (Repairable)
              </span>
              <RotateCcw className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setReworkQty(Math.max(0, reworkQty - 1))}
                className="w-8 h-8 rounded border border-border bg-surface text-ink font-bold hover:bg-surface-elevated transition"
              >
                -
              </button>
              <span className="text-3xl font-extrabold font-mono text-ink tabular-numbers">{reworkQty}</span>
              <button
                onClick={() => setReworkQty(reworkQty + 1)}
                className="w-8 h-8 rounded border border-border bg-surface text-ink font-bold hover:bg-surface-elevated transition"
              >
                +
              </button>
            </div>
            <div className="text-[11px] text-muted">Re-routed back to floor station</div>
          </div>

          {/* Rejected */}
          <div className="p-4 rounded-base border border-rose-500/30 bg-rose-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase font-mono">
                Rejected (Scrap)
              </span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRejectedQty(Math.max(0, rejectedQty - 1))}
                className="w-8 h-8 rounded border border-border bg-surface text-ink font-bold hover:bg-surface-elevated transition"
              >
                -
              </button>
              <span className="text-3xl font-extrabold font-mono text-ink tabular-numbers">{rejectedQty}</span>
              <button
                onClick={() => setRejectedQty(rejectedQty + 1)}
                className="w-8 h-8 rounded border border-border bg-surface text-ink font-bold hover:bg-surface-elevated transition"
              >
                +
              </button>
            </div>
            <div className="text-[11px] text-muted">Irreparable fabric scrap</div>
          </div>
        </div>

        {/* Rework Loop Routing (Only appears if reworkQty > 0) */}
        {reworkQty > 0 && (
          <div className="p-4 rounded-base border border-amber-500/30 bg-surface-elevated space-y-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                REWORK ROUTING INSTRUCTIONS
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Defect Root-Cause Category:
                </label>
                <select
                  value={defectCategory}
                  onChange={(e) => setDefectCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-border bg-surface text-ink focus:outline-none"
                >
                  {defectCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Send Rework Back To:
                </label>
                <select
                  value={reworkTarget}
                  onChange={(e) => setReworkTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-border bg-surface text-ink focus:outline-none"
                >
                  <option value="stitching">Stitching Line (Mubasher)</option>
                  <option value="cutting">Cutting Station (Mubasher)</option>
                  <option value="heatTransfer">Heat Transfer (Usman)</option>
                  <option value="printing">Printing Desk (Usman)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Inspector Notes for Repair:
              </label>
              <textarea
                value={reworkNotes}
                onChange={(e) => setReworkNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs rounded border border-border bg-surface text-ink placeholder:text-muted focus:outline-none"
                placeholder="Specific instructions for rework..."
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={handleSubmitQc}
            className="px-6 py-2.5 text-xs font-bold rounded-base bg-ink text-surface hover:opacity-90 transition flex items-center gap-2 shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isUrdu ? 'کوالٹی انسپیکشن ریکارڈ محفوظ کریں' : isRoman ? 'QC Record Save Karo' : 'Submit & Complete QC Inspection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
