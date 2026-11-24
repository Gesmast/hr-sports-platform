'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AttendanceStatus, AppRole } from '@/lib/types';
import { ChevronDown, Coffee, Power, Radio, Check } from 'lucide-react';

interface AttendanceDropdownProps {
  currentRole: AppRole;
  userName: string;
  userId: string;
}

export function AttendanceDropdown({ currentRole, userName, userId }: AttendanceDropdownProps) {
  const { t, isUrdu } = useI18n();
  const [status, setStatus] = useState<AttendanceStatus>('online');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // The Owner is strictly exempt from attendance logging
  if (currentRole === 'owner') {
    return null;
  }

  useEffect(() => {
    // Load persisted status from local state or DB
    const saved = localStorage.getItem(`hr_attendance_status_${userId}`) as AttendanceStatus;
    if (saved && (saved === 'online' || saved === 'break' || saved === 'offline')) {
      setStatus(saved);
    }

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userId]);

  const handleStatusChange = async (newStatus: AttendanceStatus) => {
    if (newStatus === status || loading) return;
    setLoading(true);

    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toISOString().slice(0, 10);

      // Persist in localStorage for instant local session responsiveness
      setStatus(newStatus);
      localStorage.setItem(`hr_attendance_status_${userId}`, newStatus);

      // In production, also dispatch to Supabase attendance_logs and notify owner:
      const payload = {
        userId,
        userName,
        role: currentRole,
        previousStatus: status,
        newStatus,
        timestamp: now.toISOString(),
        timeStr,
        date: dateStr,
      };

      // Call API route
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Fallback gracefully if offline
      });
    } catch (err) {
      console.error('Failed to log attendance change', err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const statusConfig = {
    online: {
      label: t.attendance.online,
      dotClass: 'bg-emerald-500 animate-pulse',
      icon: Radio,
      badgeClass: 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30',
    },
    break: {
      label: t.attendance.break,
      dotClass: 'bg-amber-400',
      icon: Coffee,
      badgeClass: 'text-amber-400 border-amber-900/50 bg-amber-950/30',
    },
    offline: {
      label: t.attendance.offline,
      dotClass: 'bg-zinc-500',
      icon: Power,
      badgeClass: 'text-zinc-400 border-zinc-700 bg-zinc-900/50',
    },
  };

  const currentConfig = statusConfig[status];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-base border border-border bg-surface hover:bg-surface-elevated transition shadow-2xs text-ink"
        aria-expanded={open}
      >
        <span className={`w-2 h-2 rounded-full ${currentConfig.dotClass}`} />
        <span className={isUrdu ? 'font-urdu text-[15px] font-semibold leading-none' : 'font-sans'}>
          {currentConfig.label}
        </span>
        <ChevronDown className="w-3 h-3 text-muted opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-base border border-border bg-surface-elevated shadow-xl z-50 py-1 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-border/50 text-[10px] uppercase font-mono tracking-wider text-muted">
            {t.attendance.status}
          </div>

          <button
            type="button"
            onClick={() => handleStatusChange('online')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition hover:bg-surface text-ink ${
              status === 'online' ? 'bg-surface font-semibold' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className={isUrdu ? 'font-urdu' : 'font-sans'}>{t.attendance.online}</span>
            </div>
            {status === 'online' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('break')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition hover:bg-surface text-ink ${
              status === 'break' ? 'bg-surface font-semibold' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className={isUrdu ? 'font-urdu' : 'font-sans'}>{t.attendance.break}</span>
            </div>
            {status === 'break' && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('offline')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition hover:bg-surface text-ink ${
              status === 'offline' ? 'bg-surface font-semibold' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              <span className={isUrdu ? 'font-urdu' : 'font-sans'}>{t.attendance.offline}</span>
            </div>
            {status === 'offline' && <Check className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
        </div>
      )}
    </div>
  );
}
