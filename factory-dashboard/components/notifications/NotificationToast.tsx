'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useNotifications, ToastItem } from '@/lib/notifications/notification-context';
import { translateNotification } from '@/lib/notifications/translate';
import {
  MessageSquare,
  FileText,
  Package,
  Layers,
  AlertTriangle,
  X,
  Bell,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export function NotificationToastContainer() {
  const { isUrdu, isRoman, locale } = useI18n();
  const { activeToasts, dismissToast, markAsRead } = useNotifications();
  const router = useRouter();

  if (activeToasts.length === 0) return null;

  const handleClickToast = (toast: ToastItem) => {
    const notif = toast.notification;
    markAsRead(notif.id);
    dismissToast(toast.id);

    // Direct workspace navigation
    if (notif.inquiry_id || notif.request_no) {
      router.push(`/inquiries/${encodeURIComponent(notif.inquiry_id || notif.request_no || '')}`);
    } else if (notif.job_no || notif.job_id) {
      router.push(`/jobs/${encodeURIComponent(String(notif.job_no || notif.job_id))}`);
    } else {
      router.push('/notifications');
    }
  };

  const getIcon = (eventType: string, isUrgent?: boolean) => {
    if (isUrgent) return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    switch (eventType) {
      case 'client_message':
      case 'staff_message':
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case 'new_inquiry':
      case 'client_spec_changed':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'order_created':
      case 'order_stage_update':
      case 'order_dispatched':
        return <Package className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0 ${
        isUrdu ? 'font-urdu' : ''
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {activeToasts.map((toast) => {
        const notif = toast.notification;
        const translated = translateNotification(notif, locale);
        return (
          <div
            key={toast.id}
            onClick={() => handleClickToast(toast)}
            className="pointer-events-auto group relative flex items-start gap-3.5 p-4 rounded-2xl border-2 border-ink/20 dark:border-white/20 bg-surface dark:bg-zinc-900 shadow-2xl hover:border-ink transition-all duration-200 cursor-pointer animate-in slide-in-from-bottom-5 fade-in text-ink ring-1 ring-black/5"
            role="alert"
          >
            {/* Type Indicator Icon */}
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-border/80 shrink-0 mt-0.5">
              {getIcon(notif.event_type, notif.is_urgent)}
            </div>

            {/* Notification Text Body */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-ink truncate">{translated.title}</span>
                {notif.is_urgent && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/30">
                    {isUrdu ? 'فوری' : 'URGENT'}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                {translated.message}
              </p>

              <div className="flex items-center gap-2 mt-2 text-[10px] text-muted font-mono">
                {notif.request_no && (
                  <span className="text-sky-600 dark:text-sky-400 font-bold">
                    #{notif.request_no}
                  </span>
                )}
                {notif.job_no && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Job #{notif.job_no}
                  </span>
                )}
                <span>&bull;</span>
                <span className="text-ink font-semibold group-hover:underline transition flex items-center gap-0.5">
                  {isUrdu ? 'ورک اسپیس کھولیں' : 'Open in Workspace'} <ExternalLink className="w-2.5 h-2.5 ml-0.5 inline" />
                </span>
              </div>
            </div>

            {/* Dismiss X button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissToast(toast.id);
              }}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-elevated border border-transparent hover:border-border transition cursor-pointer"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
