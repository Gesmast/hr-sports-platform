'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Globe,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { RealJob } from '@/lib/supabase/data';
import { getResponsiblePerson, getScheduleStatus } from '@/lib/owner-filters';
import { useI18n } from '@/lib/i18n/context';

interface OwnerMasterJobsTabProps {
  jobs: RealJob[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function OwnerMasterJobsTab({
  jobs,
  searchQuery,
  onSearchChange,
}: OwnerMasterJobsTabProps) {
  const { isUrdu, isRoman } = useI18n();
  const [channelFilter, setChannelFilter] = useState<'all' | 'web' | 'offline'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'completed' | 'all'>('active');

  const filteredJobs = jobs.filter((j) => {
    // 1. Channel Filter (Web vs Offline)
    const isWeb = !!(j.inquiry || j.design_request);
    if (channelFilter === 'web' && !isWeb) return false;
    if (channelFilter === 'offline' && isWeb) return false;

    // 2. Status Filter
    if (statusFilter === 'active' && !j.isActive) return false;
    if (statusFilter === 'completed' && j.isActive) return false;

    // 3. Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const resp = getResponsiblePerson(j);
    return (
      String(j.job_no).includes(q) ||
      j.party.toLowerCase().includes(q) ||
      (j.client && j.client.toLowerCase().includes(q)) ||
      (j.currentStage && j.currentStage.toLowerCase().includes(q)) ||
      resp.label.toLowerCase().includes(q) ||
      resp.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-surface dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Search & Channel Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isUrdu
              ? `تمام پروڈکشن جاب کارڈز (${filteredJobs.length} دکھائے گئے)`
              : isRoman
              ? `Sab Production Job Cards (${filteredJobs.length} dikhaye gaye)`
              : `Master Production Job Cards (${filteredJobs.length} shown)`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu
              ? 'فیکٹری فلور کا مکمل رجسٹر مع ذمہ دار عملہ اور ڈلیوری تاریخیں۔'
              : isRoman
              ? 'Factory floor ka mukammal register, zimmadar staff aur delivery schedule ke sath.'
              : 'Full factory floor register with responsible personnel and delivery schedules.'}
          </p>
        </div>

        {/* 3-Way Channel Filter Toggle (All / Web Orders / Offline Deals) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setChannelFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                channelFilter === 'all'
                  ? 'bg-surface dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {isUrdu ? 'تمام جابز' : isRoman ? 'Sab Jobs' : 'All Jobs'}
            </button>

            <button
              type="button"
              onClick={() => setChannelFilter('web')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                channelFilter === 'web'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ویب آرڈرز' : isRoman ? 'Web Orders' : 'Web Orders'}</span>
            </button>

            <button
              type="button"
              onClick={() => setChannelFilter('offline')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                channelFilter === 'offline'
                  ? 'bg-slate-800 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'آف لائن ڈیلز' : isRoman ? 'Offline Deals' : 'Offline Deals'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase text-slate-400 font-bold">
              <th className="py-2.5 px-3">Job #</th>
              <th className="py-2.5 px-3">{isUrdu ? 'گاہک / کلب' : isRoman ? 'Customer / Club' : 'Customer / Club'}</th>
              <th className="py-2.5 px-3">{isUrdu ? 'چینل' : isRoman ? 'Channel' : 'Channel'}</th>
              <th className="py-2.5 px-3 text-right">{isUrdu ? 'تعداد' : isRoman ? 'Qty' : 'Qty'}</th>
              <th className="py-2.5 px-3">{isUrdu ? 'موجودہ اسٹیشن' : isRoman ? 'Current Station' : 'Current Station'}</th>
              <th className="py-2.5 px-3">{isUrdu ? 'کس کے پاس رکا ہے' : isRoman ? 'Responsible ("Stuck With")' : 'Responsible ("Stuck With")'}</th>
              <th className="py-2.5 px-3">{isUrdu ? 'شیڈول' : isRoman ? 'Schedule' : 'Schedule'}</th>
              <th className="py-2.5 px-3 text-right">{isUrdu ? 'کارروائی' : isRoman ? 'Action' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-slate-400 font-mono">
                  No matching jobs found.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => {
                const resp = getResponsiblePerson(job);
                const sched = getScheduleStatus(job.delivery_date, !job.isActive);
                const isWeb = !!(job.inquiry || job.design_request);

                return (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition group"
                  >
                    {/* Job Number with Emergency flag if set */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        {job.priority === 'Emergency' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span>#{job.job_no}</span>
                      </div>
                    </td>

                    {/* Customer & Club */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {job.party}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {job.client || 'Standard Production'}
                      </div>
                    </td>

                    {/* Channel Tag: Web Order vs Offline Job */}
                    <td className="py-3 px-3">
                      {isWeb ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80">
                          <Globe className="w-3 h-3" />
                          <span>Web Order</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80">
                          <Briefcase className="w-3 h-3" />
                          <span>Offline Job</span>
                        </span>
                      )}
                    </td>

                    {/* Total Quantity */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white text-right">
                      {job.totalQty ? `${job.totalQty} pcs` : '—'}
                    </td>

                    {/* Current Station */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                        {job.currentStage || 'Pending'}
                      </span>
                    </td>

                    {/* Responsible ("Stuck With") */}
                    <td className="py-3 px-3">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {resp.label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {resp.department}
                        {resp.isHold && resp.holdReason && ` (Hold: ${resp.holdReason})`}
                      </div>
                    </td>

                    {/* Schedule Pill */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border ${sched.badgeClass}`}
                      >
                        {sched.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/jobs/${job.job_no}`}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-600 hover:text-blue-600 transition inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
