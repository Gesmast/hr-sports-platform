'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Calendar,
  AlertCircle,
  HelpCircle,
  Receipt,
  Layers,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export type OwnerTileFilter =
  | 'emergency'
  | 'overdue'
  | 'due_soon'
  | 'target_missed'
  | 'qc_decision'
  | 'no_target'
  | 'billing_pending'
  | 'active_orders'
  | null;

interface OwnerKpiTilesProps {
  counts: {
    emergency: number;
    emergencyPassedCount?: number;
    overdue: number;
    dueSoon: number;
    targetMissed: number;
    qcDecision: number;
    qcReworkCount?: number;
    noTarget: number;
    billingPending: number;
    activeOrders: number;
    totalWipUnits: number;
  };
  activeFilter: OwnerTileFilter;
  onSelectFilter: (filter: OwnerTileFilter) => void;
}

export function OwnerKpiTiles({
  counts,
  activeFilter,
  onSelectFilter,
}: OwnerKpiTilesProps) {
  const { isUrdu, isRoman } = useI18n();

  const tiles = [
    {
      id: 'emergency' as OwnerTileFilter,
      label: isUrdu ? 'ایمرجنسی آرڈرز' : isRoman ? 'Emergency Orders' : 'Emergency',
      count: counts.emergency,
      subtext: counts.emergencyPassedCount
        ? isUrdu
          ? `${counts.emergencyPassedCount} وقت گزر چکا`
          : isRoman
          ? `${counts.emergencyPassedCount} time guzar chuka`
          : `${counts.emergencyPassedCount} time passed`
        : counts.emergency > 0
        ? isUrdu
          ? 'ضروری کام جاری'
          : isRoman
          ? 'Zaroori kaam chalu hai'
          : 'Active priorities'
        : isUrdu
        ? 'سب شیڈول پر ہے'
        : isRoman
        ? 'Sab time par hai'
        : 'All on schedule',
      icon: AlertTriangle,
      isDanger: counts.emergency > 0,
      isWarning: false,
    },
    {
      id: 'overdue' as OwnerTileFilter,
      label: isUrdu ? 'تاخیر شدہ ڈلیوری' : isRoman ? 'Delivery Overdue' : 'Overdue Delivery',
      count: counts.overdue,
      subtext: counts.overdue > 0
        ? isUrdu
          ? 'ڈیڈ لائن گزر گئی'
          : isRoman
          ? 'Time guzar chuka hai'
          : 'Past deadline'
        : isUrdu
        ? 'کوئی تاخیر نہیں'
        : isRoman
        ? 'Koi overdue nahi'
        : 'None overdue',
      icon: Clock,
      isDanger: counts.overdue > 0,
      isWarning: false,
    },
    {
      id: 'due_soon' as OwnerTileFilter,
      label: isUrdu ? '۴۸ گھنٹوں میں ڈیڈ لائن' : isRoman ? '48 Ghante Mein Delivery' : 'Due in 48 Hours',
      count: counts.dueSoon,
      subtext: isUrdu ? 'اگلے ۲ دن' : isRoman ? 'Agley 2 dino mein' : 'Next 2 working days',
      icon: Calendar,
      isDanger: false,
      isWarning: counts.dueSoon > 0,
    },
    {
      id: 'target_missed' as OwnerTileFilter,
      label: isUrdu ? 'ہدف نامکمل' : isRoman ? 'Target Miss Hua' : 'Target Missed',
      count: counts.targetMissed,
      subtext: isUrdu ? 'پچھلے ۷ دن کا ریکارڈ' : isRoman ? 'Pichlay 7 din ka record' : 'Past 7 days record',
      icon: TrendingDown,
      isDanger: counts.targetMissed > 0,
      isWarning: false,
    },
    {
      id: 'qc_decision' as OwnerTileFilter,
      label: isUrdu ? 'کوالٹی فیصلہ درکار' : isRoman ? 'QC Approval Chahiye' : 'QC Decision Needed',
      count: counts.qcDecision,
      subtext: counts.qcReworkCount
        ? isUrdu
          ? `${counts.qcReworkCount} ری ورک میں`
          : isRoman
          ? `${counts.qcReworkCount} rework mein`
          : `${counts.qcReworkCount} in rework`
        : isUrdu
        ? 'حفیظ بھائی کی منظوری درکار'
        : isRoman
        ? 'Owner ki approval chahiye'
        : 'Requires Owner approval',
      icon: AlertCircle,
      isDanger: counts.qcDecision > 0,
      isWarning: false,
    },
    {
      id: 'no_target' as OwnerTileFilter,
      label: isUrdu ? 'ہدف طے نہیں ہوا' : isRoman ? 'Target Set Nahi Hua' : 'No Target Set',
      count: counts.noTarget,
      subtext: isUrdu ? 'اسٹیشن پر دستیاب' : isRoman ? 'Station par mojud hai' : 'Available at station',
      icon: HelpCircle,
      isDanger: false,
      isWarning: counts.noTarget > 0,
    },
    {
      id: 'billing_pending' as OwnerTileFilter,
      label: isUrdu ? 'بلنگ باقی ہے' : isRoman ? 'Billing Pending Hai' : 'Billing Pending',
      count: counts.billingPending,
      subtext: isUrdu ? 'بغیر بل ڈسپیچ' : isRoman ? 'Baghair bill dispatch' : 'Dispatched without bill',
      icon: Receipt,
      isDanger: false,
      isWarning: counts.billingPending > 0,
    },
    {
      id: 'active_orders' as OwnerTileFilter,
      label: isUrdu ? 'جاری آرڈرز' : isRoman ? 'Chalu Orders' : 'Active Orders',
      count: counts.activeOrders,
      subtext: isUrdu
        ? `${counts.totalWipUnits.toLocaleString()} کپڑوں پر کام جاری`
        : isRoman
        ? `${counts.totalWipUnits.toLocaleString()} pcs par kaam jari hai`
        : `${counts.totalWipUnits.toLocaleString()} pcs in work`,
      icon: Layers,
      isDanger: false,
      isWarning: false,
      isPrimary: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {tiles.map((tile) => {
        const isSelected = activeFilter === tile.id;
        const Icon = tile.icon;

        // Clean subtle indicator classes
        let statusBadgeClass =
          'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
        if (tile.isDanger) {
          statusBadgeClass =
            'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/40';
        } else if (tile.isWarning) {
          statusBadgeClass =
            'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/40';
        } else if (tile.isPrimary) {
          statusBadgeClass =
            'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/40';
        }

        return (
          <motion.button
            key={tile.id}
            type="button"
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectFilter(isSelected ? null : tile.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group select-none shadow-xs ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30'
                : 'bg-white dark:bg-surface border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
            }`}
          >
            {/* Top row: Label and Icon */}
            <div className="flex items-start justify-between gap-1 w-full">
              <span
                className={`text-[11px] font-semibold tracking-tight truncate ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}
              >
                {tile.label}
              </span>

              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                  isSelected
                    ? 'bg-white/20 border-white/30 text-white'
                    : statusBadgeClass
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Middle row: Big Number */}
            <div className="my-2">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  isSelected
                    ? 'text-white'
                    : tile.isDanger
                    ? 'text-rose-600 dark:text-rose-400'
                    : tile.isWarning
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {tile.count}
              </span>
            </div>

            {/* Bottom row: Subtext info */}
            <div className="w-full">
              <p
                className={`text-[10px] truncate font-medium ${
                  isSelected
                    ? 'text-white/80'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {tile.subtext}
              </p>
            </div>

            {/* Active filter dot indicator */}
            {isSelected && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
