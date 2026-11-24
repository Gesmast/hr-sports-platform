'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRole, PRESET_STAFF, StaffProfile } from '@/lib/auth/role-context';
import { AppRole } from '@/lib/types';
import { useI18n } from '@/lib/i18n/context';
import {
  Shield,
  ChevronDown,
  Check,
  Crown,
  Compass,
  Palette,
  Receipt,
  Factory,
  Scissors,
  CheckCircle,
  Boxes,
  Eye,
} from 'lucide-react';

interface RoleSelectorProps {
  compact?: boolean;
  className?: string;
}

export function RoleSelector({ compact = false, className = '' }: RoleSelectorProps) {
  const { currentUser, currentRole, switchUser, switchRole } = useRole();
  const { t, isUrdu, isRoman } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeLabel = (staff: StaffProfile) => {
    switch (staff.role) {
      case 'owner':
        return 'OWNER';
      case 'hamza':
        return 'COORDINATOR';
      case 'usman':
        return 'DESIGNER';
      case 'umair':
        return 'ACCOUNTS';
      case 'mubasher':
        return 'IN-CHARGE';
      case 'ashfaq':
        return 'QUALITY (QC)';
      case 'cutter' as any:
        return 'CUTTER';
      case 'printer' as any:
        return 'PRINTER';
      case 'aamir':
        return 'STORE';
      default:
        return String(staff.role).toUpperCase();
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3.5 h-3.5 text-amber-500" />;
      case 'hamza':
        return <Compass className="w-3.5 h-3.5 text-blue-500" />;
      case 'usman':
        return <Palette className="w-3.5 h-3.5 text-purple-500" />;
      case 'umair':
        return <Receipt className="w-3.5 h-3.5 text-emerald-500" />;
      case 'mubasher':
        return <Factory className="w-3.5 h-3.5 text-orange-500" />;
      case 'supervisor':
        return <Scissors className="w-3.5 h-3.5 text-cyan-500" />;
      case 'ashfaq':
        return <CheckCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'aamir':
        return <Boxes className="w-3.5 h-3.5 text-indigo-500" />;
      case 'viewer':
      default:
        return <Eye className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button: Sleek Pill in compact mode, Detailed Card in standard mode */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-hover transition text-left cursor-pointer shadow-2xs group"
          title={isUrdu ? 'کردار تبدیل کریں' : 'Switch active role'}
        >
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-surface-elevated shrink-0">
            {getRoleIcon(currentRole)}
          </div>
          <span className="font-mono text-[11px] uppercase font-bold text-ink">
            {getRoleBadgeLabel(currentUser)}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-muted transition-transform group-hover:text-ink ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-hover transition text-left cursor-pointer shadow-2xs group"
          title="Switch active company role & view permissions"
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 shrink-0">
            {getRoleIcon(currentRole)}
          </div>

          <div className="hidden sm:block">
            <div className="text-xs font-bold text-ink leading-tight flex items-center gap-1.5">
              <span>{currentUser.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold uppercase border border-amber-500/30">
                {getRoleBadgeLabel(currentUser)}
              </span>
            </div>
            <div className="text-[10px] font-mono text-muted-light uppercase leading-none mt-0.5">
              {currentUser.title}
            </div>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-muted transition-transform group-hover:text-ink ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {/* Dropdown Menu - Centered & Full Width on mobile, pinned to right on desktop */}
      {isOpen && (
        <div
          className={`fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-auto max-w-md mx-auto sm:w-80 max-h-[75vh] overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl z-[99999] p-1.5 divide-y divide-border/60 animate-in fade-in zoom-in-95 duration-100`}
        >
          <div className="px-3 py-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-light font-bold">
              {isUrdu ? 'کمپنی کردار منتخب کریں' : isRoman ? 'Apna Role Switch Karo' : 'Switch Active Company Role'}
            </div>
          </div>

          <div className="py-1 space-y-0.5">
            {PRESET_STAFF.map((staff) => {
              const isSelected = staff.id === currentUser.id;
              const badgeLabel = getRoleBadgeLabel(staff);
              return (
                <button
                  key={staff.id}
                  onClick={() => {
                    if (switchUser) {
                      switchUser(staff.id);
                    } else {
                      switchRole(staff.role, staff.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-surface-hover text-ink'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="shrink-0">{getRoleIcon(staff.role)}</div>
                    <span className="text-xs font-bold truncate">{staff.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-surface-elevated text-muted border border-border'
                      }`}
                    >
                      {badgeLabel}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-current shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
