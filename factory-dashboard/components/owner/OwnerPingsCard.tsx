'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageSquare,
  AlertCircle,
  FileText,
  User,
  Clock,
  ExternalLink,
  X,
  Send,
  Plus,
  Paperclip,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';

export interface OwnerPingNotice {
  id: string;
  senderName: string;
  senderRole: string;
  jobNo?: number;
  party?: string;
  title: string;
  message: string;
  images?: string[];
  createdAt: string;
  isRead: boolean;
  priority: 'urgent' | 'normal';
  targetUserId?: string;
}

// Full multilingual dictionary for known executive notices
const PING_I18N: Record<
  string,
  {
    ur: { title: string; message: string; role: string; time: string };
    roman: { title: string; message: string; role: string; time: string };
  }
> = {
  ping_hafeez_01: {
    ur: {
      title: '۳۰ میٹر اضافی پولی اسپینڈیکس کپڑا درکار ہے',
      message: 'کٹنگ میں کپڑے کے رول میں ۴ میٹر نقص پایا گیا ہے۔ اسٹور سے نیا رول جاری کرنے کی فوری منظوری دیں تاکہ پرنٹنگ میں تاخیر نہ ہو۔',
      role: 'پروڈکشن انچارج',
      time: '۱۵ منٹ پہلے',
    },
    roman: {
      title: 'Poly Spandex fabric ke 30 meter mazeed chahiye',
      message: 'Cutting mein fabric roll ke 4 meter mein kharabi nikli hai. Store se naya roll lene ki foran approval chahiye taake printing late na ho.',
      role: 'Production In-Charge',
      time: '15 mins pehle',
    },
  },
  ping_hafeez_02: {
    ur: {
      title: 'سینے کی ناپ اور سائزنگ کی تصدیق ہو گئی',
      message: 'گاہک نے واٹس ایپ پر نیا سائز چارٹ بھیجا ہے۔ پیٹرن میں تمام ضروری تبدیلیاں کر کے لیزر کٹر پر لوڈ کر دی گئی ہیں۔',
      role: 'ڈیزائنر',
      time: '۱ گھنٹہ پہلے',
    },
    roman: {
      title: 'Chest measurement sizing confirm ho gayi',
      message: 'Client ne WhatsApp par updated size chart bheja hai. Saari pattern adjustments complete hain aur laser cutter par load hain.',
      role: 'Designer',
      time: '1 ghanta pehle',
    },
  },
  ping_hafeez_03: {
    ur: {
      title: '۸ جرسیز پر گلے کی ربنگ کا شیڈ مختلف ہے',
      message: 'ربنگ کا رنگ سبلیمیشن کے مقابلے میں قدرے گہرا ہے۔ آگے بڑھانے یا دوبارہ پرنٹ کرنے کے لیے آپ کے فیصلے کا انتظار ہے۔',
      role: 'کوالٹی ہیڈ',
      time: '۲ گھنٹے پہلے',
    },
    roman: {
      title: '8 jerseys par neck ribbing ka shade alag hai',
      message: 'Ribbing ka color body sublimation se thora dark hai. Aap ke faislay ka intezar hai ke aage chalayein ya dobara print karein.',
      role: 'QC Head',
      time: '2 ghante pehle',
    },
  },
  ping_hafeez_04: {
    ur: {
      title: 'گاہک کی رضامندی سے ڈلیوری کی تاریخ تبدیل ہو گئی',
      message: 'ٹورنامنٹ کی تاریخوں کے باعث گاہک نے بدھ کے بجائے جمعرات کو بھیجنے کی درخواست کی۔ ہدف کو تبدیل کر دیا گیا ہے۔',
      role: 'کوآرڈینیٹر',
      time: '۳ گھنٹے پہلے',
    },
    roman: {
      title: 'Customer ki ijazat se delivery reschedule ho gayi',
      message: 'Customer ne tournament ki wajah se Budh ke bajaye Jumerat ko dispatch karne ki request ki thi. Target adjust kar diya gaya hai.',
      role: 'Coordinator',
      time: '3 ghante pehle',
    },
  },
  ping_hafeez_05: {
    ur: {
      title: 'بینک ٹرانسفر کے ذریعے ۷۰ فیصد ایڈوانس ادائیگی موصول',
      message: 'میزان بینک اکاؤنٹ میں رقم کی تصدیق ہو گئی۔ کٹنگ اور ہیٹ ٹرانسفر کے لیے کلیئر کر دیا گیا۔',
      role: 'اکاؤنٹس آفیسر',
      time: '۴ گھنٹے پہلے',
    },
    roman: {
      title: 'IBFT se 70% advance payment receive ho gayi',
      message: 'Meezan Bank account mein payment verify ho gayi. Fauran cutting aur heat transfer ke liye clear kar diya gaya.',
      role: 'Accounts Officer',
      time: '4 ghante pehle',
    },
  },
  ping_hassan_01: {
    ur: {
      title: 'کراچی کارگو ڈسپیچ ریٹس کا موازنہ',
      message: '۲۰۰ کٹس کی کراچی ترسیل کے لیے ایئر کارگو بمقابلہ ڈائیوو لاجسٹکس کے ریٹس جائزے اور منظوری کے لیے تیار ہیں۔',
      role: 'کوآرڈینیٹر',
      time: '۲۰ منٹ پہلے',
    },
    roman: {
      title: 'Karachi cargo dispatch rate comparison',
      message: 'Air cargo vs Daewoo logistics rates for 200 kits dispatch to Karachi ready for your approval.',
      role: 'Coordinator',
      time: '20 mins pehle',
    },
  },
  ping_hassan_02: {
    ur: {
      title: 'سی این سی لیزر مشین کی کولنگ ٹیوب تبدیل',
      message: 'لیزر کٹر بیڈ کی باقاعدہ دیکھ بھال اور مرمت مکمل ہو چکی ہے۔ مشین ۱۰۰ فیصد صلاحیت پر رواں ہے۔',
      role: 'پروڈکشن انچارج',
      time: '۱ گھنٹہ پہلے',
    },
    roman: {
      title: 'Laser cutting machine cooling tube replaced',
      message: 'Scheduled preventive maintenance done on CNC cutter bed. Running smoothly at 100% capacity.',
      role: 'Production In-Charge',
      time: '1 ghanta pehle',
    },
  },
  ping_hassan_03: {
    ur: {
      title: 'سبلیمیشن پیپر کے ۵۰۰ میٹر ریلز وصول ہو گئیں',
      message: 'ستارہ ملز سے سپلائی کی تصدیق مکمل۔ پرنٹنگ اسٹیشن کے لیے اجراء کی رسید تیار ہے۔',
      role: 'اسٹور منیجر',
      time: '۲ گھنٹے پہلے',
    },
    roman: {
      title: '500m Sublimation paper reels received',
      message: 'Delivery verified from Sitara Mills. Release order signed for Printing station.',
      role: 'Store Manager',
      time: '2 ghante pehle',
    },
  },
  ping_hassan_04: {
    ur: {
      title: 'سلائی لائن کی تمام مشینوں کا کیلیبریشن چیک مکمل',
      message: '۱۴ ٹیبلز پر روزانہ کا ۸ نکاتی میژرمنٹ چیک مکمل ہو گیا ہے۔ سلائی کی درستگی اے کیو ایل کے مطابق ہے۔',
      role: 'کوالٹی ہیڈ',
      time: '۴ گھنٹے پہلے',
    },
    roman: {
      title: 'Stitching line sewing gauge calibrated',
      message: 'Daily 8-point measurement check completed across 14 stitching tables. All within tolerance.',
      role: 'QC Head',
      time: '4 ghante pehle',
    },
  },
};

function getPingTranslation(
  ping: OwnerPingNotice,
  isUrdu: boolean,
  isRoman: boolean
): { title: string; message: string; role: string; time: string } {
  if (isUrdu && PING_I18N[ping.id]?.ur) {
    return PING_I18N[ping.id].ur;
  }
  if (isRoman && PING_I18N[ping.id]?.roman) {
    return PING_I18N[ping.id].roman;
  }
  return {
    title: ping.title,
    message: ping.message,
    role: ping.senderRole,
    time: ping.createdAt,
  };
}

interface OwnerPingsCardProps {
  pings?: OwnerPingNotice[];
  onMarkRead?: (id: string) => void;
  onSendPing?: (ping: { title: string; message: string; jobNo?: number; images?: string[]; priority: 'urgent' | 'normal' }) => void;
}

export function OwnerPingsCard({
  pings: customPings,
  onMarkRead,
}: OwnerPingsCardProps) {
  const { isUrdu, isRoman } = useI18n();
  const { currentUser } = useRole();

  const isHassan = currentUser?.name?.includes('Hassan');

  // Muhammad Hafeez (CEO) vs Hassan (Operations Director) default pings
  const hafeezPings: OwnerPingNotice[] = [
    {
      id: 'ping_hafeez_01',
      senderName: 'Mubasher',
      senderRole: 'Production In-Charge',
      jobNo: 248,
      party: 'ZEE SPORTS',
      title: 'Need extra 30m Poly Spandex fabric',
      message: 'Cutting found a 4-meter defect run in the fabric roll. Need quick approval to issue fresh roll from Store so printing is not delayed.',
      images: [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=60',
      ],
      createdAt: '15 mins ago',
      isRead: false,
      priority: 'urgent',
    },
    {
      id: 'ping_hafeez_02',
      senderName: 'Usman',
      senderRole: 'Designer',
      jobNo: 260,
      party: 'London Athletics',
      title: 'Sizing chest measurement confirmed',
      message: 'Client sent updated size table via WhatsApp. All pattern adjustments are done and loaded onto the laser cutter.',
      createdAt: '1 hour ago',
      isRead: false,
      priority: 'normal',
    },
    {
      id: 'ping_hafeez_03',
      senderName: 'Ashfaq',
      senderRole: 'QC Head',
      jobNo: 211,
      party: 'FC Bavaria',
      title: 'Neck ribbing shade mismatch on 8 jerseys',
      message: 'Batch ribbing color is slightly darker than body sublimation. Awaiting your decision to proceed or re-print collars.',
      createdAt: '2 hours ago',
      isRead: true,
      priority: 'urgent',
    },
    {
      id: 'ping_hafeez_04',
      senderName: 'Hamza',
      senderRole: 'Coordinator',
      jobNo: 245,
      party: 'Al-Madina Academy',
      title: 'Delivery rescheduled with customer approval',
      message: 'Customer requested dispatch on Thursday instead of Wednesday due to team tournament dates. Target adjusted.',
      createdAt: '3 hours ago',
      isRead: true,
      priority: 'normal',
    },
    {
      id: 'ping_hafeez_05',
      senderName: 'Umair',
      senderRole: 'Accounts Officer',
      jobNo: 239,
      party: 'Rawalpindi CC',
      title: '70% advance payment received via IBFT',
      message: 'Payment verified in Meezan Bank account. Cleared for immediate cutting and heat transfer.',
      createdAt: '4 hours ago',
      isRead: true,
      priority: 'normal',
    },
  ];

  const hassanPings: OwnerPingNotice[] = [
    {
      id: 'ping_hassan_01',
      senderName: 'Hamza',
      senderRole: 'Coordinator',
      jobNo: 248,
      party: 'ZEE SPORTS',
      title: 'Karachi cargo dispatch rate comparison',
      message: 'Air cargo vs Daewoo logistics rates for 200 kits dispatch to Karachi ready for your approval.',
      createdAt: '20 mins ago',
      isRead: false,
      priority: 'urgent',
    },
    {
      id: 'ping_hassan_02',
      senderName: 'Mubasher',
      senderRole: 'Production In-Charge',
      jobNo: 260,
      party: 'London Athletics',
      title: 'Laser cutting machine cooling tube replaced',
      message: 'Scheduled preventive maintenance done on CNC cutter bed. Running smoothly at 100% capacity.',
      createdAt: '1 hour ago',
      isRead: false,
      priority: 'normal',
    },
    {
      id: 'ping_hassan_03',
      senderName: 'Aamir',
      senderRole: 'Store Manager',
      party: 'Sitara Mills Raw Material',
      title: '500m Sublimation paper reels received',
      message: 'Delivery verified from Sitara Mills. Release order signed for Printing station.',
      createdAt: '2 hours ago',
      isRead: true,
      priority: 'normal',
    },
    {
      id: 'ping_hassan_04',
      senderName: 'Ashfaq',
      senderRole: 'QC Head',
      party: 'Stitching Line Calibration',
      title: 'Stitching line sewing gauge calibrated',
      message: 'Daily 8-point measurement check completed across 14 stitching tables. All within tolerance.',
      createdAt: '4 hours ago',
      isRead: true,
      priority: 'normal',
    },
  ];

  const activePings = customPings || (isHassan ? hassanPings : hafeezPings);
  const [selectedPing, setSelectedPing] = useState<OwnerPingNotice | null>(null);
  const [showAllModal, setShowAllModal] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent'>('all');

  const unreadCount = activePings.filter((p) => !p.isRead).length;
  const urgentCount = activePings.filter((p) => p.priority === 'urgent').length;

  const filteredPings = activePings.filter((p) => {
    if (filterType === 'unread') return !p.isRead;
    if (filterType === 'urgent') return p.priority === 'urgent';
    return true;
  });

  // In the compact sidebar card: show up to 4 items cleanly with a scrollable or "View All" footer
  const visiblePings = filteredPings.slice(0, 4);
  const hasMore = filteredPings.length > 4 || activePings.length > 4;

  return (
    <div className="bg-white dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {isUrdu
                ? 'اسٹاف کے ضروری پیغامات'
                : isRoman
                ? 'Staff Ke Zaroori Paighamat'
                : 'Staff Pings & Important Notes'}
            </h3>
          </div>
        </div>

        {unreadCount > 0 ? (
          <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full">
            {unreadCount} {isUrdu ? 'نئے' : isRoman ? 'Naye' : 'New'}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-400">
            {isUrdu ? 'تمام دیکھے جا چکے' : isRoman ? 'Sab parh liye' : 'All caught up'}
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        {isUrdu
          ? 'فلور سپروائزرز، ڈیزائنرز اور انچارجز کی طرف سے براہ راست حفیظ بھائی کے نام پیغامات۔'
          : isRoman
          ? 'Supervisors, designers aur floor heads ki taraf se direct alerts aur zaroori messages.'
          : 'Direct messages and urgent alerts sent to you by supervisors, designers, and floor heads.'}
      </p>

      {/* Filter Tabs in Card Header */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer text-center ${
            filterType === 'all'
              ? 'bg-white dark:bg-surface text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isUrdu ? 'سب' : isRoman ? 'Sab' : 'All'} ({activePings.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('unread')}
          className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer text-center ${
            filterType === 'unread'
              ? 'bg-white dark:bg-surface text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isUrdu ? 'نئے' : isRoman ? 'Naye' : 'Unread'} ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('urgent')}
          className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer text-center ${
            filterType === 'urgent'
              ? 'bg-white dark:bg-surface text-rose-600 dark:text-rose-400 shadow-2xs'
              : 'text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
          }`}
        >
          {isUrdu ? 'ارجنٹ' : isRoman ? 'Urgent' : 'Urgent'} ({urgentCount})
        </button>
      </div>

      {/* Pings List (Scrollable if many) */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {visiblePings.length === 0 ? (
          <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No pings matching filter.
          </div>
        ) : (
          visiblePings.map((p) => {
            const tr = getPingTranslation(p, isUrdu, isRoman);
            return (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => {
                  setSelectedPing(p);
                  if (onMarkRead && !p.isRead) onMarkRead(p.id);
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  !p.isRead
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-900/60 shadow-2xs'
                    : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        p.priority === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {p.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({tr.role.split(' ')[0]})
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {tr.time}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {p.jobNo && (
                      <span className="font-mono text-blue-600 dark:text-blue-400 mr-1.5 font-bold">
                        Job #{p.jobNo}:
                      </span>
                    )}
                    <span>{tr.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {tr.message}
                  </p>
                </div>

                {p.images && p.images.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold pt-1">
                    <Paperclip className="w-3 h-3" />
                    <span>
                      {p.images.length}{' '}
                      {isUrdu
                        ? 'تصویر منسلک ہے'
                        : isRoman
                        ? 'tasveer sath lagi hai'
                        : 'photo attached'}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })
        )}
      </div>

      {/* View All / Archive Button when there are more than 4 or on demand */}
      <button
        type="button"
        onClick={() => setShowAllModal(true)}
        className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition text-xs font-bold font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
      >
        <span>
          {isUrdu
            ? `پچھلے تمام پیغامات دیکھیں (کل ${activePings.length})`
            : isRoman
            ? `Pichlay Tamam Paighamat Dekho (${activePings.length} Total)`
            : `View Full Notice History (${activePings.length} Total)`}
        </span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* DETAIL MODAL: View full ping, message, attached photos, and open job */}
      <AnimatePresence>
        {selectedPing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPing(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-lg bg-surface dark:bg-surface rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6 space-y-4 select-none"
            >
              {(() => {
                const tr = getPingTranslation(selectedPing, isUrdu, isRoman);
                return (
                  <>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                              selectedPing.priority === 'urgent'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {selectedPing.priority === 'urgent'
                              ? isUrdu ? 'ارجنٹ الرٹ' : isRoman ? 'Urgent Alert' : 'Urgent Ping'
                              : isUrdu ? 'اسٹاف نوٹ' : isRoman ? 'Staff Note' : 'Staff Note'}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{tr.time}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                          {tr.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedPing(null)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sender & Job Row */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {isUrdu ? 'ارسال کنندہ:' : isRoman ? 'From:' : 'From:'} {selectedPing.senderName} ({tr.role})
                        </span>
                      </div>

                      {selectedPing.jobNo && (
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          Job #{selectedPing.jobNo} {selectedPing.party ? `• ${selectedPing.party}` : ''}
                        </span>
                      )}
                    </div>

                    {/* Full Message Body */}
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                      {tr.message}
                    </div>
                  </>
                );
              })()}

              {/* Attached Photos (if any) */}
              {selectedPing.images && selectedPing.images.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                    Attached Floor Photos:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPing.images.map((img, idx) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        className="w-24 h-24 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:opacity-90 hover:scale-105 transition shadow-2xs block"
                      >
                        <img src={img} alt="Attached snapshot" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {selectedPing.jobNo ? (
                  <Link
                    href={`/jobs/${selectedPing.jobNo}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Open Job #{selectedPing.jobNo}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => setSelectedPing(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL ARCHIVE MODAL: View all pings, search, filter */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-2xl bg-white dark:bg-surface rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6 space-y-4 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Staff Pings & Important Notes Ledger
                    </h3>
                    <p className="text-xs text-slate-500">
                      All messages, inquiries, and floor alerts sent directly to Owner
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Tabs inside Modal */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All ({activePings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('unread')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    filterType === 'unread'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('urgent')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    filterType === 'urgent'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Urgent Alerts ({urgentCount})
                </button>
              </div>

              {/* Scrollable Full List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[250px]">
                {filteredPings.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No pings found in this category.
                  </div>
                ) : (
                  filteredPings.map((p) => {
                    const tr = getPingTranslation(p, isUrdu, isRoman);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPing(p);
                          if (onMarkRead && !p.isRead) onMarkRead(p.id);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                          !p.isRead
                            ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-900/60 shadow-2xs hover:border-blue-300'
                            : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                p.priority === 'urgent' ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'
                              }`}
                            />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {p.senderName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              • {tr.role}
                            </span>
                            {p.jobNo && (
                              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/80 px-2 py-0.5 rounded-lg">
                                Job #{p.jobNo} {p.party ? `(${p.party})` : ''}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {tr.time}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {tr.title}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {tr.message}
                        </p>

                        {p.images && p.images.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold pt-0.5">
                            <Paperclip className="w-3 h-3" />
                            <span>
                              {p.images.length}{' '}
                              {isUrdu
                                ? 'تصویر منسلک ہے'
                                : isRoman
                                ? 'tasveer sath lagi hai'
                                : 'photo attached'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAllModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
