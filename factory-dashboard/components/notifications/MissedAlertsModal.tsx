'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useNotifications, NotificationItem } from '@/lib/notifications/notification-context';
import { useRole } from '@/lib/auth/role-context';
import { translateNotification } from '@/lib/notifications/translate';
import {
  Bell,
  MessageSquare,
  FileText,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  Clock,
  CheckCheck,
} from 'lucide-react';

export function MissedAlertsModal() {
  const { isUrdu, isRoman, locale } = useI18n();
  const { showMissedModal, missedNotifications, closeMissedModal, markAllAsRead, markAsRead } = useNotifications();
  const { currentUser } = useRole();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | 'messages' | 'inquiries' | 'orders'>('all');

  if (!showMissedModal || missedNotifications.length === 0) return null;

  const handleOpenItem = (item: NotificationItem) => {
    markAsRead(item.id);
    closeMissedModal();

    if (item.inquiry_id || item.request_no) {
      router.push(`/inquiries/${encodeURIComponent(item.inquiry_id || item.request_no || '')}`);
    } else if (item.job_no || item.job_id) {
      router.push(`/jobs/${encodeURIComponent(String(item.job_no || item.job_id))}`);
    } else {
      router.push('/notifications');
    }
  };

  const getFilteredItems = () => {
    if (activeTab === 'messages') {
      return missedNotifications.filter((n) => n.event_type.includes('message') || n.event_type.includes('contact'));
    }
    if (activeTab === 'inquiries') {
      return missedNotifications.filter(
        (n) => n.event_type.includes('inquiry') || n.event_type.includes('spec') || n.event_type.includes('design') || n.event_type.includes('quote')
      );
    }
    if (activeTab === 'orders') {
      return missedNotifications.filter((n) => n.event_type.includes('order') || n.event_type.includes('dispatch') || Boolean(n.job_no));
    }
    return missedNotifications;
  };

  const filteredItems = getFilteredItems();

  const counts = {
    all: missedNotifications.length,
    messages: missedNotifications.filter((n) => n.event_type.includes('message') || n.event_type.includes('contact')).length,
    inquiries: missedNotifications.filter((n) => n.event_type.includes('inquiry') || n.event_type.includes('spec') || n.event_type.includes('design') || n.event_type.includes('quote')).length,
    orders: missedNotifications.filter((n) => n.event_type.includes('order') || n.event_type.includes('dispatch') || Boolean(n.job_no)).length,
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 ${isUrdu ? 'font-urdu' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      <div
        className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-start justify-between bg-surface-elevated/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-ink">
                  {isUrdu ? `خوش آمدید، ${currentUser.name}` : isRoman ? `Welcome back, ${currentUser.name}!` : `Welcome back, ${currentUser.name}`}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {missedNotifications.length} {isUrdu ? 'غیر پڑھے' : isRoman ? 'unread' : 'unread'}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {isUrdu
                  ? 'یہاں آپ کی غیر حاضری کے دوران ہونے والی تمام آپریشنل سرگرمیوں کا خلاصہ موجود ہے۔'
                  : isRoman
                  ? 'Aap ke offline hone ke doraan aane wali zaroori factory updates:'
                  : 'Here is a summary of operational activity that occurred while you were away.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMissedModal}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-elevated transition cursor-pointer"
            aria-label={isUrdu ? 'بند کریں' : isRoman ? 'Band karo' : 'Close'}
            title={isUrdu ? 'بند کریں' : isRoman ? 'Band karo' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border bg-surface text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-ink text-surface font-bold'
                : 'text-muted hover:text-ink hover:bg-surface-elevated'
            }`}
          >
            <span>{isUrdu ? 'تمام اپ ڈیٹس' : isRoman ? 'Saari Updates' : 'All Updates'}</span>
            <span className="text-[10px] opacity-80">({counts.all})</span>
          </button>

          {counts.messages > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'bg-ink text-surface font-bold'
                  : 'text-muted hover:text-ink hover:bg-surface-elevated'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>{isUrdu ? 'پیغامات' : isRoman ? 'Messages' : 'Messages'}</span>
              <span className="text-[10px] opacity-80">({counts.messages})</span>
            </button>
          )}

          {counts.inquiries > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'inquiries'
                  ? 'bg-ink text-surface font-bold'
                  : 'text-muted hover:text-ink hover:bg-surface-elevated'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>{isUrdu ? 'انکوائریز' : 'Inquiries'}</span>
              <span className="text-[10px] opacity-80">({counts.inquiries})</span>
            </button>
          )}

          {counts.orders > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-ink text-surface font-bold'
                  : 'text-muted hover:text-ink hover:bg-surface-elevated'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>{isUrdu ? 'پروڈکشن آرڈرز' : 'Orders'}</span>
              <span className="text-[10px] opacity-80">({counts.orders})</span>
            </button>
          )}
        </div>

        {/* Scrollable Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-border/40">
          {filteredItems.map((item) => {
            const translated = translateNotification(item, locale);
            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="group p-3.5 rounded-xl hover:bg-surface-elevated transition cursor-pointer flex items-start justify-between gap-4 pt-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink group-hover:text-ink transition">
                      {translated.title}
                    </span>
                    {item.is_urgent && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/30">
                        {isUrdu ? 'فوری' : isRoman ? 'URGENT' : 'URGENT'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {translated.message}
                  </p>

                <div className="flex items-center gap-2 text-[10px] text-muted font-mono pt-1">
                  {(item.customer_name || item.company_name) && (
                    <span className="text-ink font-medium">
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
                  <span>&bull;</span>
                  <span>{new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              </div>

              <div className="shrink-0 self-center">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted group-hover:text-ink transition">
                  {isUrdu ? 'کھولیں' : isRoman ? 'Kholo' : 'Open'} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-elevated/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeMissedModal}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-surface hover:bg-surface-elevated text-ink transition cursor-pointer"
          >
            {isUrdu ? 'بعد میں دیکھیں' : isRoman ? 'Baad Mein Dekho' : 'Review Later'}
          </button>

          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-ink text-surface hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>
              {isUrdu
                ? `تمام پڑھے نشان لگائیں (${missedNotifications.length})`
                : isRoman
                ? `Sab Parh Liye (${missedNotifications.length})`
                : `Mark All as Read (${missedNotifications.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
