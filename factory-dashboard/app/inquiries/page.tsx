'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { SlaTimerBadge } from '@/components/shared/SlaTimerBadge';
import {
  MessageSquareText,
  Search,
  Filter,
  Clock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Loader2,
  Globe,
  PenTool,
} from 'lucide-react';

export default function InquiriesListPage() {
  const { t, isUrdu, isRoman } = useI18n();
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'design' | 'approved'>('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInquiries() {
      try {
        const res = await fetch('/api/data/inquiries');
        if (res.ok) {
          const data = await res.json();
          const list: any[] = [];

          // 1. Map Website Direct Inquiries
          if (data.inquiries && data.inquiries.length > 0) {
            data.inquiries.forEach((iq: any) => {
              const partyName = iq.user?.company_name || iq.user?.full_name || 'Website Customer';
              list.push({
                id: iq.id,
                source: 'website',
                ref: iq.reference_id,
                party: partyName,
                club: iq.garment_type,
                garment: iq.garment_type,
                qty: iq.quantity,
                createdAt: iq.created_at,
                isMet: iq.status === 'converted' || iq.status === 'quoted',
                status: iq.status === 'converted' ? 'Converted Order' : iq.status === 'quoted' ? 'Quotation Sent' : 'New Web Inquiry',
                rawStatus: iq.status,
                assignedDesigner: iq.designer?.full_name || 'Unassigned',
                assignedAccounts: iq.accounts?.full_name || 'Umair',
                lastMsg: `Web Order • Qty: ${iq.quantity} pcs`,
              });
            });
          }

          // 2. Map CAD Design Requests
          if (data.requests && data.requests.length > 0) {
            data.requests.forEach((r: any) => {
              list.push({
                id: r.id,
                source: 'cad_spec',
                ref: r.request_no || 'REQ-' + r.id.slice(-4),
                party: r.client_party || 'CLIENT PARTY',
                club: r.club_name || r.requirement || 'Production Spec',
                garment: r.product || r.requirement || 'Garment Set',
                qty: r.order_qty || 45,
                createdAt: r.created_at || new Date().toISOString(),
                isMet: r.design_status === 'Approved',
                status: r.design_status,
                rawStatus: r.design_status,
                assignedDesigner: r.designer || 'Usman',
                assignedAccounts: r.job_no ? 'Umair' : null,
                lastMsg: `Revision #${r.revision_no} • Status: ${r.design_status}`,
              });
            });
          }

          setItems(list);
        }
      } catch (err) {
        console.error('Failed to load real inquiries', err);
      } finally {
        setLoading(false);
      }
    }
    loadInquiries();
  }, []);

  const filtered = items.filter((inq) => {
    if (activeTab === 'urgent' && inq.isMet) return false;
    if (activeTab === 'design' && (inq.status === 'Approved' || inq.rawStatus === 'converted')) return false;
    if (activeTab === 'approved' && inq.status !== 'Approved' && inq.rawStatus !== 'converted') return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        inq.ref.toLowerCase().includes(q) ||
        inq.party.toLowerCase().includes(q) ||
        inq.club.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            {isUrdu ? 'ویب سائٹ انکوائریز و لیڈز مینجمنٹ' : isRoman ? 'Inquiries aur Website Leads Ledger' : 'Website Inquiries & Design Leads Ledger'}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            {isUrdu
              ? 'ویب سائٹ سے آنے والی انکوائریز، 8 گھنٹے کی رسپانس گھڑیال، ڈیزائن چیٹ اور اکاؤنٹس کوٹیشن ہینڈ اوور۔'
              : isRoman
              ? 'Website inquiries, 8h response clock, design chat aur quotation record.'
              : 'Unified ledger of website customer submissions, CAD design specs, and quotation handovers.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/jobs"
            className="px-3 py-1.5 rounded-base border border-border bg-surface hover:bg-surface-elevated text-xs font-semibold text-ink flex items-center gap-1.5 transition shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'پروڈکشن جابز دیکھیں' : isRoman ? 'Production Jobs Dekho' : 'View Production Jobs'}</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 border border-border p-1 rounded-base bg-surface overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition whitespace-nowrap ${
              activeTab === 'all' ? 'bg-ink text-surface font-bold' : 'text-muted hover:text-ink'
            }`}
          >
            {isUrdu ? 'تمام' : isRoman ? 'Sab' : 'All'} ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('urgent')}
            className={`px-3 py-1 text-xs font-medium rounded transition whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'urgent' ? 'bg-rose-500 text-white font-bold' : 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{isUrdu ? 'زیر التواء / منتظر کارروائی' : isRoman ? 'Action Chahiye' : 'Pending Action'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {items.filter((i) => !i.isMet).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-3 py-1 text-xs font-medium rounded transition whitespace-nowrap ${
              activeTab === 'design' ? 'bg-ink text-surface font-bold' : 'text-muted hover:text-ink'
            }`}
          >
            {isUrdu ? 'ڈیزائن کے مراحل میں' : isRoman ? 'Design Desk Mein' : 'In Design Desk'}
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1 text-xs font-medium rounded transition whitespace-nowrap ${
              activeTab === 'approved' ? 'bg-ink text-surface font-bold' : 'text-muted hover:text-ink'
            }`}
          >
            {isUrdu ? 'منظور شدہ' : isRoman ? 'Approved / Ready' : 'Approved / Converted'}
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isUrdu ? 'انکوائری تلاش کریں...' : isRoman ? 'Ref # ya Party ka naam dhoondo...' : 'Search by Ref # or Client...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-base border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:border-ink transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-base bg-surface overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated border-b border-border text-[10px] font-mono uppercase text-muted tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Ref #</th>
                <th className="py-2.5 px-3">{isUrdu ? 'کسٹمر / پارٹی' : isRoman ? 'Client / Source' : 'Client / Source'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'پروڈکٹ و مقدار' : isRoman ? 'Product & Qty' : 'Product & Qty'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'مقرر کردہ' : isRoman ? 'Assigned To' : 'Assigned To'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'حالت' : isRoman ? 'Status' : 'Status'}</th>
                <th className="py-2.5 px-3">{isUrdu ? 'SLA رسپانس' : isRoman ? 'Reply SLA' : 'Response SLA'}</th>
                <th className="py-2.5 px-3 text-right">{isUrdu ? 'کارروائی' : isRoman ? 'Action' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted font-mono">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-ink" />
                    <span>Loading unified inquiries & design leads...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted font-mono">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-surface-elevated transition">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-ink">{inq.ref}</div>
                      <div className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                        {inq.source === 'website' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Globe className="w-2.5 h-2.5" />
                            <span>Web Lead</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                            <PenTool className="w-2.5 h-2.5" />
                            <span>CAD Spec</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-ink">{inq.party}</div>
                      <div className="text-[11px] text-muted">{inq.club}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-ink">{inq.garment}</div>
                      <div className="font-mono text-muted">{inq.qty} pcs</div>
                    </td>
                    <td className="py-3 px-3 text-muted">
                      <div>{inq.assignedDesigner}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          inq.status === 'Approved' || inq.rawStatus === 'converted'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : inq.status === 'Hold'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <SlaTimerBadge
                        createdAt={inq.createdAt}
                        isFirstResponseMet={inq.isMet}
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/inquiries/${inq.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border border-border bg-surface hover:bg-ink hover:text-surface transition shadow-2xs"
                      >
                        <span>{isUrdu ? 'دیکھیں' : 'Inspect'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
