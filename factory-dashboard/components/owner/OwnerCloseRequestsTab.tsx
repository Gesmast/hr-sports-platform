'use client';

import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  HelpCircle,
  User,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export interface CloseRequestItem {
  id: string;
  requestNo: string;
  party: string;
  workDescription: string;
  designer: string;
  reason: string;
  notes: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface OwnerCloseRequestsTabProps {
  requests?: CloseRequestItem[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onReopen?: (id: string) => void;
}

export function OwnerCloseRequestsTab({
  requests = [
    {
      id: 'cr_01',
      requestNo: 'REQ-0198',
      party: 'Apex Rugby Club',
      workDescription: 'Sublimation Match Tops (120 pcs)',
      designer: 'Usman',
      reason: 'No response from buyer after sending proof V2',
      notes: 'Customer stopped replying to WhatsApp and email messages for over 12 days.',
      requestedAt: '2026-11-22T10:00:00Z',
      status: 'pending',
    },
    {
      id: 'cr_02',
      requestNo: 'REQ-0182',
      party: 'London Athletics',
      workDescription: 'Fleece Pullover Hoodies (60 pcs)',
      designer: 'Shahzaib',
      reason: 'Budget / Rate Issue',
      notes: 'Client requested target price below our fabric raw material cost.',
      requestedAt: '2026-11-20T14:30:00Z',
      status: 'pending',
    },
    {
      id: 'cr_03',
      requestNo: 'REQ-0145',
      party: 'Monty Sports',
      workDescription: 'Pro Training Bibs (200 pcs)',
      designer: 'Faizan',
      reason: 'Event Postponed',
      notes: 'Tournament cancelled by organizer until spring.',
      requestedAt: '2026-11-15T09:00:00Z',
      status: 'approved',
    },
  ],
  onApprove,
  onReject,
  onReopen,
}: OwnerCloseRequestsTabProps) {
  const { isUrdu, isRoman } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'closed'>('pending');

  const pendingList = requests.filter((r) => r.status === 'pending');
  const closedList = requests.filter((r) => r.status === 'approved');

  return (
    <div className="bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isUrdu
              ? 'ڈیزائن اور لیڈ منسوخی کی منظوری (مالکانہ اختیار)'
              : isRoman
              ? 'Design aur Inquiry Cancellation Approvals'
              : 'Design & Inquiry Cancellation Approvals'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu
              ? 'ڈیزائنرز خود سے آرڈر بند نہیں کر سکتے۔ ان کی درخواستوں کا جائزہ لے کر بند کرنے کی اجازت دیں یا فالو اپ کے لیے بھیجیں۔'
              : isRoman
              ? 'Designers khud se lead drop nahi kar sakte. Unki requests check karein aur approve karein.'
              : 'Designers cannot drop inquiries on their own. Review their close requests and approve or send back to follow up.'}
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('pending')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'pending'
                ? 'bg-surface dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isUrdu
              ? `منظوری کے منتظر (${pendingList.length})`
              : isRoman
              ? `Awaiting Approval (${pendingList.length})`
              : `Awaiting Approval (${pendingList.length})`}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('closed')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'closed'
                ? 'bg-surface dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {isUrdu
              ? `بند شدہ ریکارڈ (${closedList.length})`
              : isRoman
              ? `Closed Archive (${closedList.length})`
              : `Closed Archive (${closedList.length})`}
          </button>
        </div>
      </div>

      {activeSubTab === 'pending' ? (
        <div className="space-y-3">
          {pendingList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              No pending cancellation requests from designers.
            </div>
          ) : (
            pendingList.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {req.requestNo}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{req.party}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-slate-300">{req.workDescription}</span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {isUrdu ? 'وجہ:' : isRoman ? 'Wajah:' : 'Reason:'}
                    </strong>{' '}
                    {req.reason}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    &ldquo;{req.notes}&rdquo; —{' '}
                    <span>
                      {isUrdu ? 'درخواست گزار:' : isRoman ? 'Requested by:' : 'Requested by'}{' '}
                      <strong className="text-slate-700 dark:text-slate-300 font-semibold">{req.designer}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onApprove && onApprove(req.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isUrdu ? 'منظور کریں' : isRoman ? 'Approve Close' : 'Approve Close'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReject && onReject(req.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                  >
                    <span>
                      {isUrdu ? 'جاری رکھیں' : isRoman ? 'Keep Active' : 'Keep Active'}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {closedList.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-80 hover:opacity-100 transition"
            >
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {req.requestNo}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{req.party}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {isUrdu ? 'محفوظ شدہ' : isRoman ? 'Archived' : 'Archived'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isUrdu ? 'وجہ:' : isRoman ? 'Wajah:' : 'Reason:'} {req.reason} •{' '}
                  {isUrdu ? 'حفیظ بھائی کی منظوری کے بعد بند' : isRoman ? 'Closed after Owner Approval' : 'Closed after Owner Approval'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onReopen && onReopen(req.id)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-slate-600 hover:text-blue-600 hover:border-blue-400 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {isUrdu ? 'دوبارہ کھولیں' : isRoman ? 'Reopen Inquiry' : 'Reopen Inquiry'}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
