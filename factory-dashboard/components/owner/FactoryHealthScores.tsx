'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Building2,
  Users,
  ChevronDown,
  Sparkles,
  Download,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  Printer,
  TrendingUp,
} from 'lucide-react';
import { printAuditReportToPdf } from '@/lib/pdf/audit-pdf-printer';
import { useI18n } from '@/lib/i18n/context';

export type ReportDateFilter = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

export function FactoryHealthScores() {
  const { isUrdu, isRoman } = useI18n();
  const [viewMode, setViewMode] = useState<'departments' | 'staff'>('staff');
  const [dateFilter, setDateFilter] = useState<ReportDateFilter>('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  // AI Narrative Audit State
  const [auditLanguage, setAuditLanguage] = useState<'roman' | 'ur' | 'en'>('roman');
  const [promptTargetStaff, setPromptTargetStaff] = useState<any | 'all' | null>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [activeAuditData, setActiveAuditData] = useState<{
    staffMember?: any;
    staffName?: string;
    role?: string;
    score?: number;
    report: string;
    language: 'roman' | 'ur' | 'en';
  } | null>(null);

  // 1. Role-Specific Tailored Staff Performance Data
  // NOTE: Every designer is strictly "Designer" — no "Lead" or hierarchy.
  const staffReports = [
    {
      id: 'hamza',
      name: 'Hamza',
      role: 'Operations Coordinator',
      category: 'Coordination & Floor Targets',
      overallScore: 96,
      avatarColor: 'bg-sky-600',
      status: 'online',
      metrics: [
        { label: 'Inquiries Assigned', value: '42', sub: 'Assigned <24h', good: true },
        { label: 'Avg Assignment Speed', value: '3h 15m', sub: 'Well within 24h limit', good: true },
        { label: 'Active Jobs Scheduled', value: '50', sub: 'Daily Target Plan set', good: true },
        { label: 'Unassigned Pending', value: '0', sub: 'Zero backlog', good: true },
      ],
      detailedBreakdown: {
        roleDescription: 'Responsible for receiving incoming website leads, assigning them to designers within 24 hours, and scheduling daily target piece quotas across all 10 floor stations.',
        kpis: [
          { name: '24-Hour Assignment SLA Met', score: '97.6%', status: 'optimal' },
          { name: 'Floor Daily Targets Dispatched On-Time', score: '100%', status: 'optimal' },
          { name: 'Active Rush Emergencies Managed', score: '1 Order (Job #248)', status: 'normal' },
        ],
      },
    },
    {
      id: 'usman',
      name: 'Usman',
      role: 'Designer',
      category: 'Design & Customer Orders',
      overallScore: 94,
      avatarColor: 'bg-purple-600',
      status: 'online',
      metrics: [
        { label: 'Inquiries Handled', value: '18', sub: 'Website portal leads', good: true },
        { label: 'Offline Jobs Created', value: '12', sub: 'Direct WhatsApp deals', good: true },
        { label: 'Converted to Orders', value: '14', sub: '77.7% Conversion rate', good: true },
        { label: '8-Hour Chat Response', value: '94%', sub: 'Avg 2h 40m reply', good: true },
      ],
      detailedBreakdown: {
        roleDescription: 'Handles direct customer vector CAD design, 3D proofing, WhatsApp client intake, and converts approved quotes into live factory job cards.',
        kpis: [
          { name: '8-Hour First Response Compliance', score: '94.2%', status: 'optimal' },
          { name: 'Client Design Revisions per Job', score: '1.4 Revisions (Fast approval)', status: 'optimal' },
          { name: 'Offline WhatsApp Deals Allotted', score: '12 Jobs ($18,400 total value)', status: 'optimal' },
        ],
      },
    },
    {
      id: 'shahzaib',
      name: 'Shahzaib',
      role: 'Designer',
      category: 'Design & Customer Orders',
      overallScore: 91,
      avatarColor: 'bg-indigo-600',
      status: 'online',
      metrics: [
        { label: 'Inquiries Handled', value: '14', sub: 'Website portal leads', good: true },
        { label: 'Offline Jobs Created', value: '8', sub: 'Direct WhatsApp deals', good: true },
        { label: 'Converted to Orders', value: '10', sub: '71.4% Conversion rate', good: true },
        { label: '8-Hour Chat Response', value: '88%', sub: 'Avg 4h 10m reply', good: false },
      ],
      detailedBreakdown: {
        roleDescription: 'Drafts sublimation jersey vector files, color separations, and handles team crest embroidery sizing.',
        kpis: [
          { name: '8-Hour First Response Compliance', score: '88.0%', status: 'warning' },
          { name: 'Design Proofs Approved by Buyer', score: '10 of 14', status: 'optimal' },
          { name: 'Pending Buyer Sign-Offs', score: '4 Inquiries', status: 'normal' },
        ],
      },
    },
    {
      id: 'faizan',
      name: 'Faizan',
      role: 'Designer',
      category: 'Design & Customer Orders',
      overallScore: 93,
      avatarColor: 'bg-blue-600',
      status: 'online',
      metrics: [
        { label: 'Inquiries Handled', value: '11', sub: 'Website portal leads', good: true },
        { label: 'Offline Jobs Created', value: '6', sub: 'Direct WhatsApp deals', good: true },
        { label: 'Converted to Orders', value: '8', sub: '72.7% Conversion rate', good: true },
        { label: '8-Hour Chat Response', value: '96%', sub: 'Avg 1h 50m reply', good: true },
      ],
      detailedBreakdown: {
        roleDescription: 'Creates tailored grading tables, tracksuit patterns, and fleece hoodie vector specifications.',
        kpis: [
          { name: '8-Hour First Response Compliance', score: '96.4%', status: 'optimal' },
          { name: 'Pattern Accuracy (Zero Cutting Defects)', score: '100%', status: 'optimal' },
          { name: 'Active Design Requests', score: '3 In Review', status: 'normal' },
        ],
      },
    },
    {
      id: 'umair',
      name: 'Umair',
      role: 'Accounts & Commercials',
      category: 'Pricing & Billing',
      overallScore: 95,
      avatarColor: 'bg-emerald-600',
      status: 'online',
      metrics: [
        { label: 'Quotations Prepared', value: '38', sub: 'Pricing issued', good: true },
        { label: 'Quotations Pending', value: '2', sub: 'Within SLA clock', good: true },
        { label: 'Orders Fully Billed', value: '45', sub: 'Commercial invoices sent', good: true },
        { label: 'Billing Pending', value: '2', sub: 'Dispatched without bill', good: false },
      ],
      detailedBreakdown: {
        roleDescription: 'Calculates fabric costings, issues customer price quotations, generates commercial export invoices, and reconciles payments upon dispatch.',
        kpis: [
          { name: 'Quotation Release Turnaround', score: 'Avg 2h 20m from Design Sign-Off', status: 'optimal' },
          { name: 'Post-Dispatch Invoicing Accuracy', score: '98.5%', status: 'optimal' },
          { name: 'Uninvoiced Dispatches', score: '2 Jobs awaiting final bill', status: 'warning' },
        ],
      },
    },
    {
      id: 'mubasher',
      name: 'Mubasher',
      role: 'Production In-Charge',
      category: 'Floor Pieces & Stitching',
      overallScore: 89,
      avatarColor: 'bg-orange-600',
      status: 'online',
      metrics: [
        { label: 'Pieces Assigned', value: '1,450', sub: 'Target pieces across lines', good: true },
        { label: 'Pieces Stitched', value: '1,280', sub: 'Completed output', good: true },
        { label: 'Rework Units Cleared', value: '42', sub: 'Fixed and re-entered', good: true },
        { label: 'Line Backlog', value: '840 pcs', sub: 'In cutting/printing queue', good: false },
      ],
      detailedBreakdown: {
        roleDescription: 'Directs physical stitching lines, allocates daily operator pieces, oversees sewing throughput, and clears rework flagged by QC.',
        kpis: [
          { name: 'Daily Stitching Target Completion', score: '88.3%', status: 'moderate' },
          { name: 'Rework Turnaround Speed', score: 'Same-day fix (under 24h)', status: 'optimal' },
          { name: 'Stitching Operator Attendance', score: '94% (32/34 Present)', status: 'optimal' },
        ],
      },
    },
    {
      id: 'ashfaq',
      name: 'Ashfaq',
      role: 'QC Head',
      category: 'Quality & Rework Inspection',
      overallScore: 98,
      avatarColor: 'bg-rose-600',
      status: 'online',
      metrics: [
        { label: 'Pieces Inspected', value: '390', sub: 'Passed 10-point check', good: true },
        { label: 'Defects Flagged', value: '8', sub: '1.8% Defect rate', good: true },
        { label: 'Rework Re-inspected', value: '14', sub: '100% Cleared on fix', good: true },
        { label: 'Pending Approvals', value: '1', sub: 'Awaiting Owner decision', good: true },
      ],
      detailedBreakdown: {
        roleDescription: 'Final authority on garment quality, logo embroidery registration, color fastness, stitch tension, and buyer packaging specifications.',
        kpis: [
          { name: 'First-Pass Quality Yield', score: '98.2%', status: 'optimal' },
          { name: 'Defect Detection Rate', score: '100% (Zero export claims)', status: 'optimal' },
          { name: 'Average QC Inspection Time', score: '45 seconds per piece', status: 'optimal' },
        ],
      },
    },
    {
      id: 'aamir',
      name: 'Aamir',
      role: 'Store Keeper',
      category: 'Raw Materials & Trims',
      overallScore: 92,
      avatarColor: 'bg-teal-600',
      status: 'online',
      metrics: [
        { label: 'Fabric Rolls Issued', value: '48', sub: 'Polyester & Spandex', good: true },
        { label: 'Rolls in Stock', value: '320', sub: 'Healthy inventory level', good: true },
        { label: 'Shortage Alerts', value: '2', sub: 'Poly Spandex 240 GSM low', good: false },
        { label: 'Trims Packets Released', value: '110', sub: 'Zippers, neck tapes, tags', good: true },
      ],
      detailedBreakdown: {
        roleDescription: 'Maintains roll stock, manages Poly Spandex and Interlock reserves, issues zipper/thread trims, and flags raw material shortages.',
        kpis: [
          { name: 'Cutting Roll Delivery Speed', score: 'Within 30 mins of request', status: 'optimal' },
          { name: 'Inventory Shortage Prevention', score: '2 Active warnings handled', status: 'warning' },
          { name: 'Roll Quality Verification', score: '98.2%', status: 'optimal' },
        ],
      },
    },
  ];

  // 2. Department-Specific Production Data (Physical 10 Stages)
  const departmentScores = [
    { stageKey: 'cutting', name: 'Cutting Department', head: 'Cutter Master', inQueue: 840, done: 320, defectRate: '1.2%', score: 86, status: 'bottleneck' },
    { stageKey: 'printing', name: 'Printing & Sublimation', head: 'Printer Lead', inQueue: 210, done: 260, defectRate: '0.8%', score: 94, status: 'optimal' },
    { stageKey: 'heatTransfer', name: 'Heat Transfer Press', head: 'Heat Press Team', inQueue: 150, done: 180, defectRate: '0.4%', score: 92, status: 'optimal' },
    { stageKey: 'stitching', name: 'Stitching Assembly Line', head: 'Mubasher', inQueue: 420, done: 310, defectRate: '2.1%', score: 89, status: 'moderate' },
    { stageKey: 'quality', name: 'Quality Inspection (QC)', head: 'Ashfaq', inQueue: 85, done: 390, defectRate: '1.8%', score: 98, status: 'optimal' },
    { stageKey: 'clipping', name: 'Clipping & Thread Trim', head: 'Clipping Floor', inQueue: 60, done: 240, defectRate: '0.0%', score: 95, status: 'optimal' },
    { stageKey: 'press', name: 'Steam Iron & Press', head: 'Press Section', inQueue: 75, done: 210, defectRate: '0.1%', score: 96, status: 'optimal' },
    { stageKey: 'finishing', name: 'Finishing Line', head: 'Finishing Lead', inQueue: 40, done: 190, defectRate: '0.0%', score: 97, status: 'optimal' },
    { stageKey: 'packing', name: 'Packaging Desk', head: 'Packing Lead', inQueue: 110, done: 280, defectRate: '0.0%', score: 94, status: 'optimal' },
    { stageKey: 'dispatch', name: 'Dispatch & Shipping', head: 'Umair / Gate Lead', inQueue: 113, done: 340, defectRate: '0.0%', score: 99, status: 'optimal' },
  ];

  // Trigger AI Performance Audit with selected language
  const handleGenerateAudit = async (staffMember?: any, langOverride?: 'roman' | 'ur' | 'en') => {
    const lang = langOverride || auditLanguage;
    try {
      setIsGeneratingAudit(true);
      const res = await fetch('/api/admin/audit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: staffMember?.id,
          dateFilter,
          customFrom,
          customTo,
          language: lang,
          staffData: staffMember,
          allStaff: staffReports,
        }),
      });

      const data = await res.json();
      if (data.report) {
        setActiveAuditData({
          staffMember,
          staffName: staffMember?.name,
          role: staffMember?.role,
          score: staffMember?.overallScore,
          report: data.report,
          language: lang,
        });
      }
    } catch (e) {
      console.error('Error generating audit:', e);
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  // Instant High-Resolution PDF Download / Print (Zero delay, full Urdu & Nastaliq support)
  const handleDownloadPdf = () => {
    if (!activeAuditData) return;
    printAuditReportToPdf({
      title: 'Executive Performance Audit',
      period: dateFilter,
      staffName: activeAuditData.staffName,
      role: activeAuditData.role,
      score: activeAuditData.score,
      reportText: activeAuditData.report,
      language: activeAuditData.language,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & CONTROLS: DATE FILTER & VIEW TOGGLE
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {isUrdu
                ? 'فیکٹری صحت اور عملے کی کارکردگی کا رجسٹر'
                : isRoman
                ? 'Factory Health aur Staff Performance Ledger'
                : 'Factory Health & Staff Performance Ledger'}
            </h3>
            <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {isUrdu ? 'لائیو آڈٹ' : isRoman ? 'Live Audit' : 'Live In-House Audit'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {isUrdu
              ? 'کوآرڈینیشن، ڈیزائن کنورژن، کوٹیشن ٹرن اراؤنڈ اور فلور آؤٹ پٹ کا انفرادی جائزہ۔'
              : isRoman
              ? 'Coordination, design conversion, quote speed aur production output ka tareekh ke mutabiq hisaab.'
              : 'Individual role KPIs (coordination, design conversions, quotation turnaround, and floor output) evaluated by date.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Quick Date Filters */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-xs font-semibold">
            {[
              { id: 'today', label: isUrdu ? 'آج' : isRoman ? 'Aaj' : 'Today' },
              { id: 'yesterday', label: isUrdu ? 'کل' : isRoman ? 'Kal' : 'Yesterday' },
              { id: 'this_week', label: isUrdu ? 'اس ہفتے' : isRoman ? 'Is Hafte' : 'This Week' },
              { id: 'this_month', label: isUrdu ? 'اس مہینے' : isRoman ? 'Is Mahine' : 'This Month' },
              { id: 'custom', label: isUrdu ? 'اپنی مرضی کی تاریخ' : isRoman ? 'Custom Tareekh' : 'Custom' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setDateFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                  dateFilter === f.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* AI Narrative Dossier Generator Button */}
          <button
            type="button"
            disabled={isGeneratingAudit}
            onClick={() => setPromptTargetStaff('all')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isGeneratingAudit ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>
              {isUrdu ? 'فیکٹری آڈٹ رپورٹ' : isRoman ? 'AI Factory Report' : 'AI Factory Dossier'}
            </span>
          </button>

          {/* View Toggle (Staff vs 10 Departments) */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('staff')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'staff'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'اسٹاف رپورٹس (۸)' : isRoman ? 'Staff Reports (8)' : 'Staff Reports (8)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('departments')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'departments'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isUrdu ? '۱۰ مراحل' : isRoman ? '10 Marahil' : '10 Stages'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Pickers */}
      {dateFilter === 'custom' && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">From:</span>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">To:</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Showing performance records between selected dates
          </span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. VIEW 1: ROLE-SPECIFIC DETAILED STAFF CARDS
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'staff' ? (
        <div className="space-y-3">
          {staffReports.map((staff) => {
            const isExpanded = expandedStaffId === staff.id;

            return (
              <div
                key={staff.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-xs"
              >
                {/* Main Card Header / Summary Row */}
                <div
                  onClick={() => setExpandedStaffId(isExpanded ? null : staff.id)}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  {/* Left: Staff Identity & Role Category */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl ${staff.avatarColor} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {staff.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {staff.name}
                        </h4>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {staff.role}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono capitalize ml-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              staff.status === 'online'
                                ? 'bg-emerald-500'
                                : staff.status === 'break'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{staff.status}</span>
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        {staff.category}
                      </p>
                    </div>
                  </div>

                  {/* Middle: 4 Role-Specific Quick Metrics with High Contrast Labels */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 shrink-0">
                    {staff.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 tracking-tight block">
                          {m.label}
                        </span>
                        <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                          {m.value}
                        </span>
                        <span
                          className={`text-[11px] block truncate font-medium ${
                            m.good
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-amber-600 dark:text-amber-400 font-bold'
                          }`}
                        >
                          {m.sub}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Right: Actions, Overall Score Badge & Expand Chevron */}
                  <div className="flex items-center gap-3 justify-between lg:justify-end shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPromptTargetStaff(staff);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>Audit Report</span>
                    </button>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-bold">
                        Role Score
                      </span>
                      <span
                        className={`text-sm font-black font-mono px-2 py-0.5 rounded-lg inline-block ${
                          staff.overallScore >= 94
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : staff.overallScore >= 90
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {staff.overallScore}%
                      </span>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Audit Ledger */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      <strong className="text-slate-900 dark:text-white">Core Responsibility: </strong>
                      {staff.detailedBreakdown.roleDescription}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {staff.detailedBreakdown.kpis.map((kpi, kIdx) => (
                        <div
                          key={kIdx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-1"
                        >
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
                            {kpi.name}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            {kpi.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            3. VIEW 2: 10 MANUFACTURING STAGES (Physical Production)
            ───────────────────────────────────────────────────────────── */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                <th className="py-3 px-3">Stage / Department</th>
                <th className="py-3 px-3">Supervisor</th>
                <th className="py-3 px-3 text-right">In Queue</th>
                <th className="py-3 px-3 text-right">Done in Filter</th>
                <th className="py-3 px-3 text-right">Defect Rate</th>
                <th className="py-3 px-3 text-center">Efficiency Score</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departmentScores.map((dept, idx) => (
                <tr
                  key={dept.stageKey}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px] font-bold">
                        0{idx + 1}.
                      </span>
                      <span>{dept.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                    {dept.head}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white text-right">
                    {dept.inQueue.toLocaleString()} pcs
                  </td>

                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold text-right">
                    +{dept.done} pcs
                  </td>

                  <td className="py-3 px-3 font-mono text-right text-slate-600 dark:text-slate-400">
                    {dept.defectRate}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-2 max-w-[130px] mx-auto">
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.score >= 90
                              ? 'bg-emerald-500'
                              : dept.score >= 80
                              ? 'bg-blue-600'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${dept.score}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {dept.score}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        dept.status === 'optimal'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : dept.status === 'moderate'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {dept.status === 'optimal'
                        ? 'Optimal'
                        : dept.status === 'moderate'
                        ? 'Moderate'
                        : 'Bottleneck'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. PRE-GENERATION LANGUAGE PROMPT MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {promptTargetStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPromptTargetStaff(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Select Audit Report Language
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {promptTargetStaff === 'all'
                        ? 'For Factory-Wide Dossier'
                        : `For ${promptTargetStaff.name} (${promptTargetStaff.role})`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPromptTargetStaff(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose the language you want the AI auditor to write this report in before generating:
              </p>

              {/* 3 Language Options */}
              <div className="space-y-2">
                {[
                  {
                    id: 'roman',
                    title: 'Roman Urdu (Recommended)',
                    desc: 'Aam factory guftagu (e.g. "Hamza ne 42 inquiries time par assign kiye")',
                    badge: 'Fast & Easy',
                  },
                  {
                    id: 'ur',
                    title: 'اردو رسم الخط (Urdu Script)',
                    desc: 'روایتی اردو لکھائی دائیں سے بائیں (RTL format)',
                    badge: 'Urdu',
                  },
                  {
                    id: 'en',
                    title: 'English (Export Ready)',
                    desc: 'Standard international audit for global records',
                    badge: 'Official',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      const selectedLang = opt.id as any;
                      setAuditLanguage(selectedLang);
                      const target = promptTargetStaff === 'all' ? undefined : promptTargetStaff;
                      setPromptTargetStaff(null);
                      handleGenerateAudit(target, selectedLang);
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/40 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                      {opt.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setPromptTargetStaff(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          5. AI NARRATIVE AUDIT MODAL (Paragraph Evaluation + PDF Export)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeAuditData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAuditData(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6 space-y-4 max-h-[88vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {activeAuditData.staffName
                          ? `${activeAuditData.staffName} — Executive Performance Audit`
                          : 'Comprehensive Factory Staff Audit Dossier'}
                      </h3>
                      {activeAuditData.score !== undefined && (
                        <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {activeAuditData.score}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      Audit Period: {dateFilter.toUpperCase()} • Generated for Hafeez Bhai (Owner)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language Switcher inside Modal */}
                  <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      disabled={isGeneratingAudit}
                      onClick={() => {
                        setAuditLanguage('roman');
                        handleGenerateAudit(activeAuditData.staffMember, 'roman');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-xs ${
                        activeAuditData.language === 'roman'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Roman Urdu
                    </button>
                    <button
                      type="button"
                      disabled={isGeneratingAudit}
                      onClick={() => {
                        setAuditLanguage('ur');
                        handleGenerateAudit(activeAuditData.staffMember, 'ur');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-xs ${
                        activeAuditData.language === 'ur'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      اردو (Urdu)
                    </button>
                    <button
                      type="button"
                      disabled={isGeneratingAudit}
                      onClick={() => {
                        setAuditLanguage('en');
                        handleGenerateAudit(activeAuditData.staffMember, 'en');
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-xs ${
                        activeAuditData.language === 'en'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      English
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveAuditData(null)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Narrative Content Body (Formatted Prose & Bullets) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed whitespace-pre-wrap select-text">
                <div
                  className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 ${
                    activeAuditData.language === 'ur'
                      ? 'font-sans text-sm sm:text-base leading-loose text-right'
                      : 'font-mono text-[11px] sm:text-xs'
                  }`}
                  dir={activeAuditData.language === 'ur' ? 'rtl' : 'ltr'}
                >
                  {isGeneratingAudit ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="font-sans text-xs">
                        {activeAuditData.language === 'ur'
                          ? 'اردو آڈٹ رپورٹ تیار کی جا رہی ہے...'
                          : 'Generating audit report...'}
                      </span>
                    </div>
                  ) : (
                    activeAuditData.report
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-slate-400 font-mono">
                  Export ready in PDF (Industrial Format)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Download / Print PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveAuditData(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
