'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import {
  Layers,
  Search,
  Filter,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Loader2,
  PackageCheck,
} from 'lucide-react';

export default function MasterJobsPage() {
  const { t, isUrdu, isRoman } = useI18n();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dispatched'>('active');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    dispatched: 0,
  });

  const getStageDisplay = (stage: string) => {
    const stageMap: Record<string, { en: string; ur: string; roman: string; color: string }> = {
      cutting: { en: 'Cutting Line', ur: 'کٹنگ لائن', roman: 'Cutting Line', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
      printing: { en: 'Sublimation Printing', ur: 'سبلیمیشن پرنٹنگ', roman: 'Sublimation Printing', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
      heatTransfer: { en: 'Heat Transfer Press', ur: 'ہیٹ ٹرانسفر پریس', roman: 'Heat Transfer Press', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' },
      stitching: { en: 'Stitching Floor', ur: 'سلائی فلور', roman: 'Stitching Floor', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
      quality: { en: 'QC Inspection', ur: 'کوالٹی معائنہ', roman: 'Quality Check (QC)', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' },
      clipping: { en: 'Clipping & Trim', ur: 'تراش و کٹائی', roman: 'Clipping & Trim', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' },
      press: { en: 'Press & Ironing', ur: 'پریس و استری', roman: 'Pressing aur Ironing', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30' },
      finishing: { en: 'Finishing Line', ur: 'فنشنگ لائن', roman: 'Finishing Line', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
      packing: { en: 'Packing Desk', ur: 'پیکنگ ڈیسک', roman: 'Packing Desk', color: 'bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/30' },
      dispatch: { en: 'Ready for Dispatch', ur: 'تیار برائے روانگی', roman: 'Dispatch Ready', color: 'bg-amber-600/10 text-amber-700 dark:text-amber-300 border-amber-600/30' },
      Dispatched: { en: 'Dispatched & Complete', ur: 'روانہ شدہ و مکمل', roman: 'Dispatch Ho Chuki', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
      'Pending Start': { en: 'Pending Start', ur: 'شروع ہونا باقی', roman: 'Pending Start', color: 'bg-surface-elevated text-muted border-border' },
      Complete: { en: 'Complete', ur: 'مکمل', roman: 'Mukammal', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
    };

    const found = stageMap[stage];
    if (found) {
      return {
        label: isUrdu ? found.ur : isRoman ? found.roman : found.en,
        color: found.color,
      };
    }
    return {
      label: stage,
      color: 'bg-surface-elevated text-ink border-border',
    };
  };

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/api/data/jobs');
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && data.jobs.length > 0) {
            setCounts({
              total: data.totalCount || data.count || data.jobs.length,
              active: data.activeCount || data.jobs.filter((j: any) => j.isActive).length,
              dispatched: data.dispatchedCount || data.jobs.filter((j: any) => !j.isActive).length,
            });

            setJobs(
              data.jobs.map((j: any) => ({
                id: j.id,
                jobNo: j.job_no,
                party: j.party || 'DIRECT CLIENT',
                client: j.client || 'Standard Production',
                orderDate: j.order_date || j.created_at?.slice(0, 10) || '2026-10-17',
                deliveryDate: j.delivery_date || 'TBD',
                priority: j.priority || 'Normal',
                quotationStatus: j.quotation_status || 'Approved',
                billingStatus: j.billing_status || 'Bill Pending',
                product: j.items?.[0]?.product || 'Garment Set',
                qty: j.totalQty || j.items?.reduce((acc: number, it: any) => acc + (Number(it.qty) || 0), 0) || 45,
                currentStage: j.currentStage || 'Cutting',
                isActive: j.isActive ?? (j.currentStage !== 'Dispatched'),
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to load real jobs', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    // Status filter
    if (statusFilter === 'active' && !j.isActive) return false;
    if (statusFilter === 'dispatched' && j.isActive) return false;

    // Priority filter
    if (priorityFilter !== 'all' && j.priority.toLowerCase() !== priorityFilter) return false;

    // Search query
    if (search) {
      const q = search.toLowerCase();
      return (
        String(j.jobNo).includes(q) ||
        j.party.toLowerCase().includes(q) ||
        j.client.toLowerCase().includes(q) ||
        j.product.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ماسٹر جابز لیجر' : isRoman ? 'Master Job Execution Ledger' : 'Master Job Execution Ledger'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            {isUrdu ? 'پروڈکشن ماسٹر جابز لیجر' : isRoman ? 'Master Production Jobs Ledger' : 'Master Production Jobs Ledger'}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            {isUrdu
              ? 'تمام فعال جابز کی مکمل تفصیل، ڈلیوری تاریخ، مرحلہ وار پیش رفت اور انوائسنگ ریکارڈ۔'
              : isRoman
              ? 'Factory ki saari jobs, stages ka live status aur delivery record.'
              : 'Unified ledger of all factory jobs, real stage WIP status, and delivery schedules.'}
          </p>
        </div>

        <Link
          href="/jobs/new"
          className="px-3.5 py-2 rounded-base bg-ink text-surface hover:opacity-90 text-xs font-bold flex items-center gap-2 transition shadow-2xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'نیا جاب نمبر بنائیں' : isRoman ? 'Nayi Job Banao' : 'Create Production Job'}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 border border-border p-1 rounded-base bg-surface">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 text-xs rounded transition flex items-center gap-1.5 ${
              statusFilter === 'active'
                ? 'bg-ink text-surface font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span>{isUrdu ? 'پروڈکشن میں فعال' : isRoman ? 'Floor Par Chalu' : 'Active in Production'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-300 font-mono font-bold">
              {counts.active}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs rounded transition flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-ink text-surface font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span>{isUrdu ? 'تمام جابز' : isRoman ? 'Sab Jobs' : 'All Jobs'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-elevated text-muted font-mono">
              {counts.total}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('dispatched')}
            className={`px-3 py-1.5 text-xs rounded transition flex items-center gap-1.5 ${
              statusFilter === 'dispatched'
                ? 'bg-ink text-surface font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span>{isUrdu ? 'روانہ شدہ' : isRoman ? 'Dispatch Ho Chuki' : 'Dispatched'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono font-bold">
              {counts.dispatched}
            </span>
          </button>
        </div>

        {/* Priority & Search */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border p-1 rounded-base bg-surface">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                priorityFilter === 'all' ? 'bg-ink text-surface font-bold' : 'text-muted hover:text-ink'
              }`}
            >
              {isUrdu ? 'تمام' : isRoman ? 'Sab' : 'All'}
            </button>
            <button
              onClick={() => setPriorityFilter('urgent')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                priorityFilter === 'urgent' ? 'bg-rose-500 text-white font-bold' : 'text-rose-500 hover:bg-rose-500/10'
              }`}
            >
              {isUrdu ? 'فوری' : isRoman ? 'Urgent' : 'Urgent'}
            </button>
          </div>

          <div className="relative min-w-[240px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isUrdu
                  ? 'جاب نمبر یا پارٹی تلاش کریں...'
                  : isRoman
                  ? 'Job #, Party ya Product dhoondo...'
                  : 'Search Job #, Party, Product...'
              }
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-base border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
            />
          </div>
        </div>
      </div>

      {/* Master Table */}
      <div className="border border-border rounded-base bg-surface overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated border-b border-border text-[10px] font-mono uppercase text-muted tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Job #</th>
                <th className="py-2.5 px-3">{isUrdu ? 'پارٹی / کلائنٹ' : isRoman ? 'Party / Client' : 'Party / Client'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'پروڈکٹ و مقدار' : isRoman ? 'Product aur Qty' : 'Product & Qty'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'آرڈر تاریخ' : isRoman ? 'Order Date' : 'Order Date'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'ڈلیوری تاریخ' : isRoman ? 'Delivery Date' : 'Delivery Date'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'موجودہ مرحلہ' : isRoman ? 'Mojooda Station' : 'Current Station'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'کوٹیشن' : isRoman ? 'Quote' : 'Quotation'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'بلنگ' : isRoman ? 'Billing' : 'Billing'}</th>
                <th className="py-2.5 px-3 text-right">{isUrdu ? 'کارروائی' : isRoman ? 'Action' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted font-mono">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-ink" />
                    <span>
                      {isUrdu
                        ? 'جابز لوڈ ہو رہی ہیں...'
                        : isRoman
                        ? 'Jobs ledger load ho raha hai...'
                        : 'Loading real jobs ledger...'}
                    </span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted font-mono">
                    {isUrdu
                      ? 'کوئی جاب موجود نہیں'
                      : isRoman
                      ? 'Koyi matching job nahi mili.'
                      : 'No jobs match the current filter.'}
                  </td>
                </tr>
              ) : (
                filtered.map((j) => {
                  const stageInfo = getStageDisplay(j.currentStage);

                  return (
                    <tr key={j.id} className="hover:bg-surface-elevated transition">
                      <td className="py-3 px-3 font-mono font-extrabold text-ink text-sm">
                        #{j.jobNo}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-ink">{j.party}</div>
                        <div className="text-[11px] text-muted font-mono">{j.client}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-ink">{j.product}</div>
                        <div className="font-mono text-muted">{j.qty} pcs</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted">{j.orderDate}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-ink">{j.deliveryDate}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${stageInfo.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              j.currentStage === 'Dispatched' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'
                            }`}
                          />
                          <span>{stageInfo.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            j.quotationStatus === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {j.quotationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-muted border border-border bg-surface">
                          {j.billingStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/jobs/${j.jobNo}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border border-border bg-surface hover:bg-ink hover:text-surface transition shadow-2xs"
                        >
                          <span>{isUrdu ? 'تفصیل' : isRoman ? 'Dekho' : 'Inspect'}</span>
                          <ArrowRight className="w-3 h-3" />
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
    </div>
  );
}
