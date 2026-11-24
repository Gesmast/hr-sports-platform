'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useNotifications, NotificationItem } from '@/lib/notifications/notification-context';
import { translateNotification } from '@/lib/notifications/translate';
import {
  Bell,
  CheckCheck,
  MessageSquare,
  FileText,
  Package,
  AlertTriangle,
  Inbox,
  UserCheck,
} from 'lucide-react';

export function NotificationBell() {
  const { isUrdu, isRoman, locale } = useI18n();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterUnread, setFilterUnread] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Desktop hover open
  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  // Desktop hover close with small grace delay
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Click on the bell icon: on both mobile and desktop, directly opens the full page!
  const handleBellClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
    router.push('/notifications');
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    setIsOpen(false);

    if (item.inquiry_id || item.request_no) {
      router.push(`/inquiries/${encodeURIComponent(item.inquiry_id || item.request_no || '')}`);
    } else if (item.job_no || item.job_id) {
      router.push(`/jobs/${encodeURIComponent(String(item.job_no || item.job_id))}`);
    } else {
      router.push('/notifications');
    }
  };

  const displayedList = filterUnread
    ? notifications.filter((n) => !n.read)
    : notifications.slice(0, 12);

  const getIcon = (eventType: string, isUrgent?: boolean) => {
    if (isUrgent) return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
    switch (eventType) {
      case 'client_message':
      case 'staff_message':
        return <MessageSquare className="w-3.5 h-3.5 text-sky-500" />;
      case 'new_inquiry':
      case 'client_spec_changed':
        return <FileText className="w-3.5 h-3.5 text-purple-500" />;
      case 'designer_assigned':
        return <UserCheck className="w-3.5 h-3.5 text-indigo-500" />;
      case 'order_created':
      case 'order_stage_update':
      case 'order_dispatched':
        return <Package className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bell Trigger Button:
          - Desktop: Hover opens preview popup; Click opens full /notifications page.
          - Mobile: Click directly opens full /notifications page without dropdown.
      */}
      <button
        type="button"
        onClick={handleBellClick}
        className="relative flex items-center justify-center w-8 h-8 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition text-ink cursor-pointer"
        aria-label="Notifications"
        title="View all operational notifications"
      >
        <Bell className="w-4 h-4 text-muted hover:text-ink transition" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel: Hidden on Mobile (< md), opens on desktop hover */}
      {isOpen && (
        <div className="hidden md:block absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-surface shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Dropdown Header */}
          <div className="p-3.5 border-b border-border bg-surface-elevated/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink">
                {isUrdu ? 'نوٹیفیکیشنز' : isRoman ? 'Notifications' : 'Notifications'}
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {unreadCount} {isUrdu ? 'نئے' : isRoman ? 'naye' : 'new'}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="text-[11px] font-semibold text-muted hover:text-ink flex items-center gap-1 transition cursor-pointer"
              >
                <CheckCheck className="w-3 h-3 text-emerald-500" />
                <span>{isUrdu ? 'تمام پڑھے نشان لگائیں' : isRoman ? 'Sab Parh Liye' : 'Mark all read'}</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 px-3.5 py-2 border-b border-border bg-surface text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterUnread(false)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                !filterUnread ? 'bg-ink text-surface font-bold' : 'text-muted hover:text-ink'
              }`}
            >
              {isUrdu ? 'تمام' : isRoman ? 'Saaray' : 'All'} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterUnread(true)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                filterUnread ? 'bg-ink text-surface font-bold' : 'text-muted hover:text-ink'
              }`}
            >
              {isUrdu ? 'غیر پڑھے' : isRoman ? 'Unread' : 'Unread'} ({unreadCount})
            </button>
          </div>

          {/* Notifications Scroll List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {displayedList.length === 0 ? (
              <div className="p-8 text-center text-muted space-y-2">
                <Inbox className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">
                  {filterUnread
                    ? isUrdu
                      ? 'کوئی غیر پڑھا نوٹیفیکیشن نہیں'
                      : isRoman
                      ? 'Koyi naya unread alert nahi hai'
                      : 'No unread notifications'
                    : isUrdu
                    ? 'ابھی کوئی نوٹیفیکیشن نہیں'
                    : isRoman
                    ? 'Abhi koyi notification nahi hai'
                    : 'No notifications yet'}
                </p>
              </div>
            ) : (
              displayedList.map((item) => {
                const translated = translateNotification(item, locale);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3 text-left hover:bg-surface-elevated transition cursor-pointer flex items-start gap-2.5 ${
                      !item.read ? 'bg-surface-elevated/40' : ''
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-surface border border-border/50 shrink-0 mt-0.5">
                      {getIcon(item.event_type, item.is_urgent)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${!item.read ? 'font-bold text-ink' : 'font-medium text-ink/80'}`}>
                          {translated.title}
                        </span>
                        {!item.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-relaxed">
                        {translated.message}
                      </p>

                    <div className="flex items-center gap-2 text-[9px] text-muted font-mono mt-1">
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
                      <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>

          {/* Dropdown Footer: Clean summary line */}
          <div className="px-3.5 py-2.5 border-t border-border bg-surface-elevated/40 flex items-center justify-between text-xs text-muted">
            <span className="text-[11px] font-medium">
              {unreadCount > 0
                ? isUrdu
                  ? `${unreadCount} غیر پڑھے الرٹس`
                  : isRoman
                  ? `${unreadCount} naye alerts`
                  : `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}`
                : isUrdu
                ? 'سب اپ ڈیٹ ہیں'
                : isRoman
                ? 'Sab clear hai'
                : 'All caught up'}
            </span>
            <span className="text-[11px] font-mono text-muted flex items-center gap-1">
              {isUrdu
                ? 'مکمل دیکھنے کے لیے کلک کریں ←'
                : isRoman
                ? 'Sab dekhnay ke liye bell par click karein →'
                : 'Click bell for full view \u2192'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
