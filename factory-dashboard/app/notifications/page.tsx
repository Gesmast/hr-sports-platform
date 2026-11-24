'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';
import { useNotifications, NotificationItem } from '@/lib/notifications/notification-context';
import { translateNotification } from '@/lib/notifications/translate';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Clock,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldAlert,
  FileText,
  Package,
  CheckCheck,
  Inbox,
  RefreshCw,
  Trash2,
  Calendar,
  Search,
  X,
  SlidersHorizontal,
  UserCheck,
  CheckSquare,
  Square,
  Layers,
  Check,
  Minus,
} from 'lucide-react';

type DateFilterType = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';

interface TabOption {
  id: string;
  label: string;
  urduLabel?: string;
  romanLabel?: string;
  icon?: any;
  matches: (n: NotificationItem) => boolean;
}

export default function NotificationsPage() {
  const { t, isUrdu, isRoman, locale } = useI18n();
  const { currentRole, currentUser } = useRole();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    batchMarkAsRead,
    deleteNotification,
    batchDelete,
    clearNotifications,
    refreshNotifications,
  } = useNotifications();
  const router = useRouter();

  // Filter States
  const [activeTabId, setActiveTabId] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Multi-Select State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Dynamic Role-Adaptive Tab Suite
  const roleTabs = useMemo<TabOption[]>(() => {
    switch (currentRole) {
      case 'owner':
        return [
          { id: 'all', label: 'Executive Milestones', urduLabel: 'انتظامی سنگ میل', romanLabel: 'Executive Milestones', matches: () => true },
          { id: 'inquiries', label: 'New Inquiries', urduLabel: 'نئی انکوائریز', romanLabel: 'Nayi Inquiries', matches: (n) => n.event_type === 'new_inquiry' || n.event_type === 'contact_message' },
          { id: 'overdue', label: '🚨 Overdue SLA Breaches', urduLabel: '🚨 زائد المیعاد ایس ایل اے', romanLabel: '🚨 Overdue SLA', matches: (n) => Boolean(n.is_urgent) || n.event_type.includes('overdue') },
          { id: 'orders', label: 'Production Orders', urduLabel: 'پروڈکشن آرڈرز', romanLabel: 'Production Orders', matches: (n) => n.event_type.includes('order') || Boolean(n.job_no) },
        ];
      case 'hamza':
        return [
          { id: 'all', label: 'Operations Triage Feed', urduLabel: 'آپریشنز فیڈ', romanLabel: 'Operations Feed', matches: () => true },
          { id: 'triage', label: 'Triage Queue', urduLabel: 'ٹریج کیو', romanLabel: 'Triage Queue', matches: (n) => n.event_type === 'new_inquiry' || n.title.includes('Unassigned') },
          { id: 'overdue', label: '🚨 Overdue (By Staff)', urduLabel: '🚨 زائد المیعاد (عملہ)', romanLabel: '🚨 Overdue (Staff)', matches: (n) => Boolean(n.is_urgent) || n.event_type.includes('overdue') },
          { id: 'designs', label: 'Approved Designs', urduLabel: 'منظور شدہ ڈیزائنز', romanLabel: 'Approved Designs', matches: (n) => n.event_type === 'design_approved' },
          { id: 'orders', label: 'Orders & Allotment', urduLabel: 'آرڈرز و تفویض', romanLabel: 'Orders aur Jobs', matches: (n) => n.event_type.includes('order') || Boolean(n.job_no) },
        ];
      case 'usman':
        return [
          { id: 'all', label: 'CAD Design Workspace', urduLabel: 'ڈیزائن ورک اسپیس', romanLabel: 'Design Workspace', matches: () => true },
          { id: 'assigned', label: 'New Assignments', urduLabel: 'نئی تفویض', romanLabel: 'Nayi Jobs', matches: (n) => n.event_type === 'designer_assigned' },
          { id: 'messages', label: 'My Client Messages', urduLabel: 'کلائنٹ پیغامات', romanLabel: 'Client Messages', matches: (n) => n.event_type === 'client_message' },
          { id: 'approvals', label: 'Mockup Approvals', urduLabel: 'ماک اپ منظوری', romanLabel: 'Mockup Approvals', matches: (n) => n.event_type === 'design_approved' },
          { id: 'specs', label: 'Revision Requests', urduLabel: 'ترمیمی درخواستیں', romanLabel: 'Revision Requests', matches: (n) => n.event_type === 'client_spec_changed' },
        ];
      case 'umair':
        return [
          { id: 'all', label: 'Commercial Queue', urduLabel: 'تجارتی کیو', romanLabel: 'Commercial Queue', matches: () => true },
          { id: 'quotes_pending', label: 'Quotes Required', urduLabel: 'مطلوبہ کوٹیشنز', romanLabel: 'Quotes Chahiye', matches: (n) => n.event_type === 'design_approved' || n.event_type.includes('quote') },
          { id: 'orders_accepted', label: 'Orders Initiated', urduLabel: 'جاری شدہ آرڈرز', romanLabel: 'Orders Shuru', matches: (n) => n.event_type === 'order_created' },
          { id: 'billing', label: 'Billed & Invoiced', urduLabel: 'بل اور انوائس', romanLabel: 'Bill aur Invoice', matches: (n) => n.event_type.includes('bill') || n.event_type.includes('invoice') },
        ];
      default: // Floor roles (mubasher, ashfaq, cutter, printer, heat_transfer, aamir)
        return [
          { id: 'all', label: 'Shop Floor Feed', urduLabel: 'شاپ فلور فیڈ', romanLabel: 'Shop Floor Feed', matches: () => true },
          { id: 'stations', label: 'Station Queue', urduLabel: 'اسٹیشن کیو', romanLabel: 'Station Queue', matches: (n) => n.event_type === 'order_stage_update' },
          { id: 'qc', label: 'QC Handovers', urduLabel: 'کوالٹی معائنہ', romanLabel: 'QC Check', matches: (n) => n.event_type.includes('qc') || n.event_type.includes('quality') },
          { id: 'holds', label: 'Urgent Holds', urduLabel: 'فوری تعطل', romanLabel: 'Urgent Holds', matches: (n) => Boolean(n.is_urgent) },
        ];
    }
  }, [currentRole]);

  const activeTab = useMemo(() => {
    return roleTabs.find((t) => t.id === activeTabId) || roleTabs[0];
  }, [roleTabs, activeTabId]);

  const getNotificationIcon = (type: string, isUrgent?: boolean) => {
    if (isUrgent) return <ShieldAlert className="w-4 h-4 text-rose-500" />;
    switch (type) {
      case 'client_message':
      case 'staff_message':
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case 'new_inquiry':
      case 'client_spec_changed':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'designer_assigned':
        return <UserCheck className="w-4 h-4 text-indigo-500" />;
      case 'order_created':
      case 'order_stage_update':
      case 'order_dispatched':
        return <Package className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await refreshNotifications();
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  const handleOpenItem = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.inquiry_id || item.request_no) {
      router.push(`/inquiries/${encodeURIComponent(item.inquiry_id || item.request_no || '')}`);
    } else if (item.job_no || item.job_id) {
      router.push(`/jobs/${encodeURIComponent(String(item.job_no || item.job_id))}`);
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    await deleteNotification(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDeletingId(null);
  };

  // Multi-Select Handlers
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const handleBatchMarkAsRead = async () => {
    const ids = Array.from(selectedIds);
    await batchMarkAsRead(ids);
    setSelectedIds(new Set());
  };

  const handleBatchDelete = async () => {
    const ids = Array.from(selectedIds);
    const confirmPrompt = isUrdu
      ? `کیا آپ واقعی ${ids.length} منتخب کردہ نوٹیفیکیشنز حذف کرنا چاہتے ہیں؟`
      : `Permanently delete ${ids.length} selected notification${ids.length > 1 ? 's' : ''}?`;
    if (window.confirm(confirmPrompt)) {
      await batchDelete(ids);
      setSelectedIds(new Set());
    }
  };

  const handleClearRead = async () => {
    const confirmPrompt = isUrdu
      ? 'کیا آپ تمام پڑھے گئے نوٹیفیکیشنز صاف کرنا چاہتے ہیں؟'
      : 'Clear all read notifications?';
    if (window.confirm(confirmPrompt)) {
      await clearNotifications('delete_read');
      setSelectedIds(new Set());
    }
  };

  const handleClearAll = async () => {
    const confirmPrompt = isUrdu
      ? 'کیا آپ واقعی تمام نوٹیفیکیشنز مستقل طور پر حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔'
      : 'Are you sure you want to delete ALL notifications? This action cannot be undone.';
    if (window.confirm(confirmPrompt)) {
      await clearNotifications('delete_all');
      setSelectedIds(new Set());
    }
  };

  // Date & Filter calculation
  const filteredNotifications = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfWeek = now.getTime() - 7 * 86400000;
    const startOfMonth = now.getTime() - 30 * 86400000;

    return notifications.filter((n) => {
      // 1. Unread filter
      if (unreadOnly && n.read) return false;

      // 2. Role-Adaptive Tab filter
      if (!activeTab.matches(n)) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = n.title?.toLowerCase().includes(q);
        const matchMsg = n.message?.toLowerCase().includes(q);
        const matchCust = n.customer_name?.toLowerCase().includes(q);
        const matchComp = n.company_name?.toLowerCase().includes(q);
        const matchReq = n.request_no?.toLowerCase().includes(q);
        const matchJob = String(n.job_no || '').toLowerCase().includes(q);
        if (!matchTitle && !matchMsg && !matchCust && !matchComp && !matchReq && !matchJob) {
          return false;
        }
      }

      // 4. Date filter
      const notifTime = new Date(n.created_at).getTime();
      if (dateFilter === 'today' && notifTime < startOfToday) {
        return false;
      }
      if (dateFilter === 'yesterday' && (notifTime < startOfYesterday || notifTime >= startOfToday)) {
        return false;
      }
      if (dateFilter === 'week' && notifTime < startOfWeek) {
        return false;
      }
      if (dateFilter === 'month' && notifTime < startOfMonth) {
        return false;
      }
      if (dateFilter === 'custom') {
        if (customStartDate) {
          const start = new Date(customStartDate).getTime();
          if (notifTime < start) return false;
        }
        if (customEndDate) {
          const end = new Date(customEndDate).getTime() + 86400000;
          if (notifTime >= end) return false;
        }
      }

      return true;
    });
  }, [notifications, unreadOnly, activeTab, searchQuery, dateFilter, customStartDate, customEndDate]);

  const readCount = notifications.filter((n) => n.read).length;
  const hasActiveFilters = activeTabId !== 'all' || unreadOnly || Boolean(searchQuery) || dateFilter !== 'all';

  const resetAllFilters = () => {
    setActiveTabId('all');
    setUnreadOnly(false);
    setSearchQuery('');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSelectedIds(new Set());
  };

  const isAllSelected = filteredNotifications.length > 0 && selectedIds.size === filteredNotifications.length;
  const isPartiallySelected = selectedIds.size > 0 && !isAllSelected;
  const isSelectionActive = selectedIds.size > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* ── Top Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink flex items-center gap-2">
            <Bell className="w-6 h-6 text-muted" />
            <span>
              {isUrdu
                ? 'آپریشنل نوٹیفیکیشنز و انتباہات'
                : isRoman
                ? 'Factory Notifications aur Alerts'
                : 'Operational Notifications & Alerts'}
            </span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                {unreadCount} {isUrdu ? 'غیر پڑھے' : isRoman ? 'naye' : 'unread'}
              </span>
            )}
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {isUrdu
              ? currentRole === 'owner'
                ? 'کاروباری سنگ میل، اہم ایس ایل اے خلاف ورزیاں، اور پروڈکشن آرڈرز کا جائزہ۔'
                : currentRole === 'hamza'
                ? 'آپریشنز کیو ٹریج، ڈیزائنر تفویض، اور عملے کی ایس ایل اے نگرانی۔'
                : currentRole === 'usman'
                ? 'تفویض شدہ انکوائری تھری ڈی ماک اپس، کلائنٹ پیغامات اور منظوری۔'
                : currentRole === 'umair'
                ? 'زیر التواء کوٹیشنز، تجارتی آرڈرز اور بلنگ کلیئرنس۔'
                : 'ورک سٹیشن مینوفیکچرنگ، معائنہ کوالٹی اور ہولڈ الرٹس۔'
              : isRoman
              ? currentRole === 'owner'
                ? 'Business milestones, urgent SLA alerts aur production orders ka overview.'
                : currentRole === 'hamza'
                ? 'Inquiry triage, designer assignment aur staff SLA tracking.'
                : currentRole === 'usman'
                ? 'Assigned CAD mockups, revision requests aur customer approvals.'
                : currentRole === 'umair'
                ? 'Pending quotes, accepted orders aur billing clearance.'
                : 'Workstation production line arrivals, QC inspections aur defect alerts.'
              : currentRole === 'owner'
              ? 'Executive business milestones, critical SLA breaches, and production order releases.'
              : currentRole === 'hamza'
              ? 'Operational queue triage, designer assignment tracking, and staff SLA escalations.'
              : currentRole === 'usman'
              ? 'Assigned inquiry CAD mockups, revision requests, and direct customer approvals.'
              : currentRole === 'umair'
              ? 'Pending quote requests, accepted commercial orders, and billing clearance.'
              : 'Workstation production line arrivals, AQL 1.0 inspections, and defect holds.'}
          </p>
        </div>

        {/* Global Bulk Actions */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSync}
            className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-muted hover:text-ink transition cursor-pointer"
            title={isUrdu ? 'نوٹیفیکیشنز تازہ کریں' : isRoman ? 'Notifications refresh karo' : 'Refresh notifications'}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing || loading ? 'animate-spin' : ''}`} />
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsRead()}
              className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-xs font-mono font-bold text-ink transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isUrdu ? 'تمام پڑھے نشان زد کریں' : isRoman ? 'Sab Parh Liye' : 'Mark All Read'}</span>
            </button>
          )}

          {readCount > 0 && (
            <button
              type="button"
              onClick={handleClearRead}
              className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 text-xs font-mono font-semibold text-muted transition cursor-pointer flex items-center gap-1.5"
              title={isUrdu ? 'پڑھے گئے نوٹیفیکیشنز حذف کریں' : isRoman ? 'Parhay huye notifications delete karo' : 'Delete all read notifications'}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{isUrdu ? `پڑھے گئے صاف کریں (${readCount})` : isRoman ? `Parhay Huye Hatao (${readCount})` : `Clear Read (${readCount})`}</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 text-xs font-mono font-semibold text-muted transition cursor-pointer flex items-center gap-1.5"
              title={isUrdu ? 'تمام نوٹیفیکیشنز مستقل طور پر حذف کریں' : isRoman ? 'Saaray notifications delete karo' : 'Delete all notifications permanently'}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{isUrdu ? 'تمام حذف کریں' : isRoman ? 'Sab Khatam Karo' : 'Clear All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Search, Date, and Role-Adaptive Tabs Controls (Darker shade of white container #F1F3F6) ── */}
      <div className="rounded-2xl border border-slate-300/80 dark:border-zinc-800 bg-[#F1F3F6] dark:bg-[#16171A] p-4 sm:p-5 space-y-4 shadow-xs">
        {/* Row 1: Search & Date Range */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input (Highlighted pure white with crisp border & shadow) */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isUrdu
                  ? 'گاہک، کمپنی، انکوائری # یا جاب نمبر سے تلاش کریں...'
                  : isRoman
                  ? 'Customer, company, #INQ ya Job number search karo...'
                  : 'Search by customer, company, #INQ, or Job...'
              }
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border-2 border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-600 bg-white dark:bg-[#0D0E11] text-ink text-xs font-medium placeholder:text-muted/70 focus:outline-hidden focus:border-ink dark:focus:border-white shadow-xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Date Filters (Crisp elevated white pills) */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 md:pb-0">
            <Calendar className="w-3.5 h-3.5 text-muted shrink-0 mr-1" />
            {(['all', 'today', 'yesterday', 'week', 'month', 'custom'] as DateFilterType[]).map((d) => {
              const labels: Record<DateFilterType, { en: string; ur: string; roman: string }> = {
                all: { en: 'All Time', ur: 'تمام وقت', roman: 'All Time' },
                today: { en: 'Today', ur: 'آج', roman: 'Aaj' },
                yesterday: { en: 'Yesterday', ur: 'کل', roman: 'Kal' },
                week: { en: 'Last 7D', ur: 'آخری 7 دن', roman: 'Pichlay 7 Din' },
                month: { en: 'Last 30D', ur: 'آخری 30 دن', roman: 'Pichlay 30 Din' },
                custom: { en: 'Custom Date', ur: 'مخصوص تاریخ', roman: 'Custom Date' },
              };
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDateFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition cursor-pointer ${
                    dateFilter === d
                      ? 'bg-ink text-surface dark:bg-white dark:text-black font-bold shadow-xs'
                      : 'bg-white dark:bg-[#1E2025] border border-slate-300/80 dark:border-zinc-700 text-ink/80 hover:text-ink hover:bg-slate-50 dark:hover:bg-[#25282E] font-medium shadow-2xs'
                  }`}
                >
                  {isUrdu ? labels[d].ur : isRoman ? labels[d].roman : labels[d].en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Custom Date Pickers (visible if custom selected - responsive flex-col on mobile so date pickers don't overflow screen) */}
        {dateFilter === 'custom' && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-[#1E2025] border border-slate-300 dark:border-zinc-700 text-xs shadow-2xs animate-in fade-in duration-150">
            {/* Start Date */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-muted font-bold text-xs shrink-0 min-w-[42px] sm:min-w-0">
                {isUrdu ? 'سے:' : 'From:'}
              </span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full sm:w-auto flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-surface text-ink text-xs font-mono focus:border-ink dark:focus:border-white focus:outline-hidden"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-muted font-bold text-xs shrink-0 min-w-[42px] sm:min-w-0">
                {isUrdu ? 'تک:' : 'To:'}
              </span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full sm:w-auto flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-surface text-ink text-xs font-mono focus:border-ink dark:focus:border-white focus:outline-hidden"
              />
            </div>

            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer underline self-end sm:self-auto py-1 sm:py-0 sm:ml-1"
              >
                {isUrdu ? 'تاریخیں صاف کریں' : 'Clear Dates'}
              </button>
            )}
          </div>
        )}

        {/* Row 3: Role-Adaptive Tabs & Unread Checkbox */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-2.5 border-t border-slate-300/70 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-medium overflow-x-auto">
            {roleTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                  activeTabId === tab.id
                    ? 'bg-ink text-surface dark:bg-white dark:text-black font-bold shadow-xs'
                    : 'bg-white dark:bg-[#1E2025] border border-slate-300/80 dark:border-zinc-700 text-ink/80 hover:text-ink hover:bg-slate-50 dark:hover:bg-[#25282E] font-medium shadow-2xs'
                }`}
              >
                {isUrdu ? (tab.urduLabel || tab.label) : isRoman ? (tab.romanLabel || tab.label) : tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-ink/80 hover:text-ink font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="rounded border-slate-300 text-ink focus:ring-0 cursor-pointer"
              />
              <span>{isUrdu ? 'صرف غیر پڑھے' : isRoman ? 'Sirf Unread Dekho' : 'Show Unread Only'}</span>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-muted hover:text-ink font-semibold underline cursor-pointer"
              >
                {isUrdu ? 'فلٹرز دوبارہ ترتیب دیں' : isRoman ? 'Filters Reset Karo' : 'Reset Filters'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Gmail-Style Top Action Bar (Darker shade of white container #F1F3F6) ── */}
      <div
        className={`px-3.5 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 text-xs ${
          isSelectionActive
            ? 'bg-ink text-surface dark:bg-white dark:text-black border-ink shadow-md'
            : 'bg-[#F1F3F6] dark:bg-[#16171A] border-slate-300/80 dark:border-zinc-800 text-ink/80 shadow-xs'
        }`}
      >
        {/* Left Side: Master Checkbox & Contextual Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Master Checkbox Toggle */}
          <button
            type="button"
            onClick={isSelectionActive ? () => setSelectedIds(new Set()) : handleSelectAll}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
              isSelectionActive
                ? 'bg-white/20 hover:bg-white/30 text-surface dark:bg-black/10 dark:text-black'
                : 'bg-white dark:bg-[#1E2025] border border-slate-300 dark:border-zinc-700 hover:border-ink hover:bg-slate-50 text-ink shadow-2xs'
            }`}
            title={
              isSelectionActive
                ? isUrdu
                  ? 'انتخاب ختم کریں'
                  : isRoman
                  ? 'Selection khatam karo'
                  : 'Deselect all'
                : isUrdu
                ? 'تمام منتخب کریں'
                : isRoman
                ? 'Sab select karo'
                : 'Select all visible'
            }
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4" />
            ) : isPartiallySelected ? (
              <Minus className="w-4 h-4 stroke-[3]" />
            ) : (
              <Square className="w-4 h-4 opacity-50" />
            )}
          </button>

          {/* Active Selection Mode */}
          {isSelectionActive ? (
            <>
              <span className="font-mono font-bold text-xs pl-1 pr-2 border-r border-white/20 dark:border-black/20">
                {selectedIds.size} {isUrdu ? 'منتخب' : isRoman ? 'selected' : 'selected'}
              </span>

              <button
                type="button"
                onClick={handleBatchMarkAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 font-semibold transition cursor-pointer"
                title={isUrdu ? 'منتخب کردہ کو پڑھا ہوا نشان لگائیں' : isRoman ? 'Parh liya mark karo' : 'Mark selected as read'}
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>{isUrdu ? 'پڑھا ہوا نشان لگائیں' : isRoman ? 'Parh Liya' : 'Mark Read'}</span>
              </button>

              <button
                type="button"
                onClick={handleBatchDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 dark:text-rose-700 font-semibold transition cursor-pointer"
                title={isUrdu ? 'منتخب کردہ نوٹیفیکیشنز حذف کریں' : isRoman ? 'Selected delete karo' : 'Delete selected notifications'}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400 dark:text-rose-600" />
                <span>{isUrdu ? 'حذف کریں' : isRoman ? 'Hatao' : 'Delete'}</span>
              </button>

              {!isAllSelected && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2 py-1 rounded-lg hover:bg-white/15 dark:hover:bg-black/15 text-[11px] font-mono transition cursor-pointer underline decoration-dotted"
                >
                  {isUrdu
                    ? `تمام منتخب کریں (${filteredNotifications.length})`
                    : isRoman
                    ? `Sab select karo (${filteredNotifications.length})`
                    : `Select all (${filteredNotifications.length})`}
                </button>
              )}
            </>
          ) : (
            /* Inactive Selection Mode: Clean Counter & Quick Selection */
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink">
                {filteredNotifications.length === 0
                  ? isUrdu
                    ? 'کوئی اپ ڈیٹ نہیں'
                    : isRoman
                    ? 'Koyi update nahi'
                    : 'No updates'
                  : isUrdu
                  ? `${filteredNotifications.length} نوٹیفیکیشنز`
                  : isRoman
                  ? `${filteredNotifications.length} updates`
                  : `${filteredNotifications.length} updates`}
              </span>
              <span className="text-muted/60 text-[11px] hidden sm:inline">&bull;</span>
              <span className="text-muted text-[11px] hidden sm:inline">
                {isUrdu
                  ? 'کسی کارڈ پر ہوور کریں یا منتخب کرنے کے لیے باکس پر کلک کریں'
                  : isRoman
                  ? 'Card select karne ke liye box par click karein'
                  : 'Hover any card or click square to select'}
              </span>
              {filteredNotifications.some((n) => !n.read) && (
                <button
                  type="button"
                  onClick={() => {
                    const unreadIds = filteredNotifications.filter((n) => !n.read).map((n) => n.id);
                    setSelectedIds(new Set(unreadIds));
                  }}
                  className="text-[11px] font-mono text-muted hover:text-ink underline decoration-dotted transition cursor-pointer ml-1"
                >
                  {isUrdu ? 'غیر پڑھے منتخب کریں' : isRoman ? 'Unread select karo' : 'Select unread'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Deselect button (if active) OR Summary Count */}
        <div className="flex items-center gap-2">
          {isSelectionActive ? (
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 text-xs font-semibold transition cursor-pointer"
              title={isUrdu ? 'انتخاب منسوخ کریں' : isRoman ? 'Cancel karo' : 'Cancel selection'}
            >
              <X className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'منسوخ' : isRoman ? 'Cancel' : 'Cancel'}</span>
            </button>
          ) : (
            <span className="text-[11px] font-mono text-muted">
              {unreadCount > 0
                ? isUrdu
                  ? `${unreadCount} غیر پڑھے`
                  : isRoman
                  ? `${unreadCount} naye`
                  : `${unreadCount} unread`
                : isUrdu
                ? 'سب اپ ڈیٹ ہیں'
                : isRoman
                ? 'Sab clear hai'
                : 'All caught up'}
            </span>
          )}
        </div>
      </div>

      {/* ── Notifications Feed Container (Darker shade of white canvas #F1F3F6) ── */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#F1F3F6] dark:bg-[#16171A] border border-slate-300/80 dark:border-zinc-800 space-y-3 shadow-xs">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-muted space-y-3 rounded-xl border border-dashed border-border bg-surface">
            <Inbox className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-sm font-semibold">
              {isUrdu
                ? 'آپ کے منتخب کردہ فلٹر سے مماثل کوئی نوٹیفیکیشن موجود نہیں۔'
                : 'No operational updates match your current filter.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface-elevated text-xs font-semibold text-ink hover:bg-surface transition cursor-pointer"
              >
                <span>{isUrdu ? 'تمام فلٹرز دوبارہ ترتیب دیں' : isRoman ? 'Saaray Filters Reset Karo' : 'Reset All Filters'}</span>
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isSelected = selectedIds.has(item.id);
            const translated = translateNotification(item, locale);

            // Dynamic color-coded left border accent
            const getLeftAccent = () => {
              if (isSelected) return 'border-l-4 border-l-ink dark:border-l-white';
              if (item.is_urgent) return 'border-l-4 border-l-rose-500';
              switch (item.event_type) {
                case 'client_message':
                case 'staff_message':
                  return 'border-l-4 border-l-sky-500';
                case 'new_inquiry':
                case 'client_spec_changed':
                  return 'border-l-4 border-l-purple-500';
                case 'designer_assigned':
                  return 'border-l-4 border-l-indigo-500';
                case 'order_created':
                case 'order_stage_update':
                case 'order_dispatched':
                  return 'border-l-4 border-l-emerald-500';
                default:
                  return 'border-l-4 border-l-amber-500';
              }
            };

            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative group ${getLeftAccent()} ${
                  isSelected
                    ? 'bg-ink/[0.06] dark:bg-white/[0.08] border-ink shadow-sm ring-2 ring-ink/20'
                    : !item.read
                    ? 'bg-white dark:bg-[#1E2025] border-slate-300/90 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-ink/50'
                    : 'bg-[#F8F9FA] dark:bg-[#1A1C20] border-slate-200 dark:border-zinc-800 opacity-90 hover:opacity-100 hover:bg-white dark:hover:bg-[#1E2025] shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                  {/* Mobile Only: Dedicated Always-Visible Select Checkbox (Positioned directly to the left next to the icon) */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleSelect(item.id, e)}
                    className={`sm:hidden w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer select-none mt-1 ${
                      isSelected
                        ? 'bg-ink text-surface dark:bg-white dark:text-black border border-ink shadow-xs'
                        : 'border-2 border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#1E2025] hover:border-ink text-muted/70 shadow-2xs'
                    }`}
                    title={isSelected ? (isUrdu ? 'انتخاب ختم کریں' : 'Click to deselect') : (isUrdu ? 'منتخب کریں' : 'Click to select')}
                    aria-label={isSelected ? 'Deselect notification' : 'Select notification'}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Square className="w-3.5 h-3.5 opacity-40" />
                    )}
                  </button>

                  {/* Mobile Only: Dedicated Notification Icon (Always visible next to the select button) */}
                  <div className="sm:hidden w-9 h-9 rounded-xl border flex items-center justify-center transition shrink-0 bg-surface-elevated border-border shadow-2xs mt-0.5">
                    {getNotificationIcon(item.event_type, item.is_urgent)}
                  </div>

                  {/* Desktop Only (>= sm): Gmail-Style Morphing Avatar / Checkbox Slot on Hover */}
                  <div
                    onClick={(e) => handleToggleSelect(item.id, e)}
                    className="hidden sm:block relative w-9 h-9 rounded-xl shrink-0 cursor-pointer select-none group/box mt-0.5"
                    title={isSelected ? (isUrdu ? 'انتخاب ختم کریں' : 'Click to deselect') : (isUrdu ? 'منتخب کریں' : 'Click to select')}
                  >
                    {/* Default Icon: Shown when NOT selected and NOT hovered (unless in multi-select mode) */}
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-150 bg-surface-elevated border-border shadow-2xs ${
                        isSelected
                          ? 'opacity-0 scale-75 pointer-events-none'
                          : isSelectionActive
                          ? 'opacity-0 scale-75 pointer-events-none'
                          : 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-75'
                      }`}
                    >
                      {getNotificationIcon(item.event_type, item.is_urgent)}
                    </div>

                    {/* Gmail-Style Hover / Selection Checkbox Slot */}
                    <div
                      className={`absolute inset-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
                        isSelected
                          ? 'opacity-100 scale-100 bg-ink text-surface dark:bg-white dark:text-black border border-ink shadow-2xs'
                          : isSelectionActive
                          ? 'opacity-100 scale-100 border-2 border-border/80 hover:border-ink bg-surface hover:bg-surface-elevated'
                          : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 border-2 border-border/80 hover:border-ink bg-surface shadow-2xs'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-muted group-hover/box:text-ink transition-colors opacity-40" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs ${!item.read ? 'font-bold text-ink' : 'font-semibold text-ink/80'}`}>
                        {translated.title}
                      </span>

                      {/* SLA Overdue Attribution Badge */}
                      {item.is_urgent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isUrdu ? 'زائد المیعاد ایس ایل اے' : 'Overdue SLA'}</span>
                        </span>
                      )}

                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                      <span className="text-[10px] font-mono text-muted">
                        {new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>

                    <p className="text-xs text-muted leading-relaxed line-clamp-2">{translated.message}</p>

                    <div className="flex items-center gap-2 text-[10px] text-muted font-mono pt-0.5 flex-wrap">
                      {(item.customer_name || item.company_name) && (
                        <span className="text-ink font-semibold">
                          {item.customer_name || item.company_name}
                        </span>
                      )}
                      {item.request_no && (
                        <span className="text-sky-600 dark:text-sky-400 font-semibold">
                          #{item.request_no}
                        </span>
                      )}
                      {item.job_no && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Job #{item.job_no}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Open & Delete */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border group-hover:bg-ink group-hover:text-surface text-xs font-semibold font-mono transition cursor-pointer shadow-2xs">
                    <span>{isUrdu ? 'ورک اسپیس کھولیں' : isRoman ? 'Kholo' : 'Open Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Individual Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-lg border border-transparent hover:border-rose-500/30 hover:bg-rose-500/10 text-muted hover:text-rose-600 transition cursor-pointer"
                    title={isUrdu ? 'نوٹیفیکیشن حذف کریں' : isRoman ? 'Delete karo' : 'Delete notification'}
                    aria-label={isUrdu ? 'نوٹیفیکیشن حذف کریں' : isRoman ? 'Delete notification' : 'Delete notification'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
