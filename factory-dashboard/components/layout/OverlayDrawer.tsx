'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';
import {
  LayoutDashboard,
  MessageSquareText,
  Compass,
  Palette,
  Scissors,
  Printer,
  Flame,
  Shirt,
  CheckCircle,
  Package,
  Truck,
  Boxes,
  Receipt,
  Layers,
  BarChart3,
  Users,
  UserCog,
  FileText,
  Mail,
  Globe,
  Settings,
  Sparkles,
  X,
  Crown,
  Shield,
  LogOut,
} from 'lucide-react';

interface OverlayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OverlayDrawer({ isOpen, onClose }: OverlayDrawerProps) {
  const pathname = usePathname();
  const { isUrdu, isRoman } = useI18n();
  const { currentUser, currentRole, logout } = useRole();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean navigation groups with separate Inquiries and Jobs (Orders), plus Website Management
  const navGroups = [
    {
      title: isUrdu ? 'مرکزی آپریشنز' : isRoman ? 'Main Operations' : 'MAIN OPERATIONS',
      items: [
        { name: isUrdu ? 'ڈیش بورڈ' : isRoman ? 'Dashboard' : 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: isUrdu ? 'انکوائریز' : isRoman ? 'Inquiries' : 'Inquiries Desk', href: '/inquiries', icon: MessageSquareText },
        { name: isUrdu ? 'جابز (آرڈرز)' : isRoman ? 'Jobs (Orders)' : 'Jobs (Production Orders)', href: '/jobs', icon: Layers },
        { name: isUrdu ? 'کوآرڈینیٹر' : isRoman ? 'Coordinator' : 'Operations Coordinator', href: '/coordinator', icon: Compass },
        { name: isUrdu ? 'ڈیزائن ڈیسک' : isRoman ? 'Design Desk' : 'Design Desk', href: '/design-desk', icon: Palette },
        { name: isUrdu ? 'پروموشنز و نیوز' : isRoman ? 'Promotions' : 'Promotions & News', href: '/promotions', icon: Mail },
      ],
    },
    {
      title: isUrdu ? 'پروڈکشن فلور (10 سٹیشنز)' : isRoman ? 'Production Floor' : 'PRODUCTION FLOOR (10 STATIONS)',
      items: [
        { name: isUrdu ? 'کٹنگ سٹیشن' : isRoman ? 'Cutting' : 'Cutting Station', href: '/stations/cutting', icon: Scissors },
        { name: isUrdu ? 'پرنٹنگ و سبلیمیشن' : isRoman ? 'Printing' : 'Printing & Sublimation', href: '/stations/printing', icon: Printer },
        { name: isUrdu ? 'ہیٹ ٹرانسفر' : isRoman ? 'Heat Transfer' : 'Heat Transfer', href: '/stations/heat-transfer', icon: Flame },
        { name: isUrdu ? 'سٹچنگ لائن' : isRoman ? 'Stitching' : 'Stitching Line', href: '/stations/stitching', icon: Shirt },
        { name: isUrdu ? 'کوالٹی چیک (QC)' : isRoman ? 'Quality (QC)' : 'Quality Inspection (QC)', href: '/stations/qc', icon: CheckCircle },
        { name: isUrdu ? 'پیکنگ اور فنش' : isRoman ? 'Packing' : 'Packing & Finish', href: '/stations/packing', icon: Package },
        { name: isUrdu ? 'ڈسپیچ فلور' : isRoman ? 'Dispatch' : 'Dispatch Floor', href: '/stations/dispatch', icon: Truck },
      ],
    },
    {
      title: isUrdu ? 'کمرشل و انوینٹری' : isRoman ? 'Commercial & Stock' : 'COMMERCIAL & INVENTORY',
      items: [
        { name: isUrdu ? 'سٹور و میٹریل' : isRoman ? 'Store aur Stock' : 'Store & Materials', href: '/store', icon: Boxes },
        { name: isUrdu ? 'اکاؤنٹس و بلنگ' : isRoman ? 'Accounts' : 'Accounts & Billing', href: '/accounts', icon: Receipt },
      ],
    },
    {
      title: isUrdu ? 'انتظامیہ اور رپورٹس' : isRoman ? 'Management & Reports' : 'MANAGEMENT & STAFF',
      items: [
        { name: isUrdu ? 'تجزیات' : isRoman ? 'Analytics' : 'Factory Analytics', href: '/analytics', icon: BarChart3 },
        { name: isUrdu ? 'ملازمین کی حاضری' : isRoman ? 'Attendance' : 'Staff Attendance', href: '/attendance-report', icon: Users },
        { name: isUrdu ? 'صارفین کی ترتیب' : isRoman ? 'Users Setting' : 'User Management', href: '/attendance-report/users', icon: UserCog },
      ],
    },
    {
      title: isUrdu ? 'ویب سائٹ مینجمنٹ' : isRoman ? 'Website Management' : 'WEBSITE MANAGEMENT',
      items: [
        { name: isUrdu ? 'تھیم ایڈیٹر' : isRoman ? 'Theme Editor' : 'Visual Theme Editor', href: '/website-management/theme-editor', icon: Sparkles },
        { name: isUrdu ? 'پالیسیاں' : isRoman ? 'Policies' : 'Company Policies', href: '/website-management/policies', icon: FileText },
        { name: isUrdu ? 'ای میل سیٹنگز' : isRoman ? 'Email Settings' : 'Email & System Settings', href: '/website-management/settings', icon: Settings },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Drawer Panel Sliding Smoothly Above the Main Page */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 w-80 sm:w-88 bg-white dark:bg-surface border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col select-none overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                  HR
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {isUrdu ? 'فیکٹری مینو' : isRoman ? 'Factory Navigation' : 'Factory Operations'}
                  </h2>
                  <p className="text-[10px] font-mono text-slate-400">
                    {isUrdu ? 'تمام سیکشنز اور سٹیشنز' : isRoman ? 'Sabhi Sections' : 'All Sections & Stations'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shadow-2xs"
                aria-label="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Navigation Groups */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {navGroups.map((group) => (
                <div key={group.title} className="space-y-1.5">
                  <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    {group.title}
                  </div>

                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs font-semibold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                              isActive
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white'
                            }`}
                          />
                          <span className="flex-1 truncate">{item.name}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Current User & Role Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'HR'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {currentUser?.name || 'Authorized Staff'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1">
                    {currentRole === 'owner' && <Crown className="w-2.5 h-2.5 text-amber-500" />}
                    <span>{currentUser?.title || currentRole}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
