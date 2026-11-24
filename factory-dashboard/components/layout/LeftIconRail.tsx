'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';
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
  Sparkles,
  Settings,
  ChevronRight,
  Menu,
} from 'lucide-react';

interface LeftIconRailProps {
  onOpenDrawer: () => void;
  isDrawerOpen: boolean;
}

export function LeftIconRail({ onOpenDrawer, isDrawerOpen }: LeftIconRailProps) {
  const pathname = usePathname();
  const { isUrdu } = useI18n();

  // Clean categorized sections for the rail:
  // 1. Separate Inquiries and Jobs (Orders)
  // 2. Full floor stations
  // 3. Commercial & Admin
  // 4. Website Management
  const railSections = [
    {
      group: isUrdu ? 'مرکزی' : 'Main',
      items: [
        { name: isUrdu ? 'ڈیش بورڈ' : 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: isUrdu ? 'انکوائریز' : 'Inquiries', href: '/inquiries', icon: MessageSquareText },
        { name: isUrdu ? 'جابز' : 'Jobs', href: '/jobs', icon: Layers },
        { name: isUrdu ? 'ڈیزائن' : 'Design', href: '/design-desk', icon: Palette },
        { name: isUrdu ? 'کوآرڈینیٹر' : 'Coord', href: '/coordinator', icon: Compass },
        { name: isUrdu ? 'پروموشنز' : 'Promos', href: '/promotions', icon: Mail },
      ],
    },
    {
      group: isUrdu ? 'فلور' : 'Floor',
      items: [
        { name: isUrdu ? 'کٹنگ' : 'Cutting', href: '/stations/cutting', icon: Scissors },
        { name: isUrdu ? 'پرنٹنگ' : 'Printing', href: '/stations/printing', icon: Printer },
        { name: isUrdu ? 'ہیٹ' : 'Heat', href: '/stations/heat-transfer', icon: Flame },
        { name: isUrdu ? 'سٹچنگ' : 'Stitching', href: '/stations/stitching', icon: Shirt },
        { name: isUrdu ? 'کوالٹی' : 'QC', href: '/stations/qc', icon: CheckCircle },
        { name: isUrdu ? 'پیکنگ' : 'Packing', href: '/stations/packing', icon: Package },
        { name: isUrdu ? 'ڈسپیچ' : 'Dispatch', href: '/stations/dispatch', icon: Truck },
      ],
    },
    {
      group: isUrdu ? 'سٹاک' : 'Admin',
      items: [
        { name: isUrdu ? 'سٹور' : 'Store', href: '/store', icon: Boxes },
        { name: isUrdu ? 'بلنگ' : 'Accounts', href: '/accounts', icon: Receipt },
        { name: isUrdu ? 'تجزیات' : 'Reports', href: '/analytics', icon: BarChart3 },
        { name: isUrdu ? 'حاضری' : 'Staff', href: '/attendance-report', icon: Users },
        { name: isUrdu ? 'صارفین' : 'Users', href: '/attendance-report/users', icon: UserCog },
      ],
    },
    {
      group: isUrdu ? 'ویب' : 'Web',
      items: [
        { name: isUrdu ? 'تھیم' : 'Theme', href: '/website-management/theme-editor', icon: Sparkles },
        { name: isUrdu ? 'پالیسیاں' : 'Policies', href: '/website-management/policies', icon: FileText },
        { name: isUrdu ? 'سیٹنگز' : 'Settings', href: '/website-management/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-[72px] sm:w-20 bg-white dark:bg-surface border-r border-slate-200/80 dark:border-slate-800 flex flex-col items-center h-full shrink-0 z-30 select-none shadow-xs overflow-hidden">
      
      {/* Top Fixed Area: Menu Button that opens the overlay drawer */}
      <div className="pt-3 pb-2 px-2 flex flex-col items-center w-full shrink-0 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-surface z-10">
        <button
          type="button"
          onClick={onOpenDrawer}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer shadow-xs group ${
            isDrawerOpen
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 hover:border-blue-300'
          }`}
          title="Open Full Navigation Menu (Drawer)"
        >
          <Menu className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Scrollable Rail Area: Smooth scrolling with all sections and stations accessible */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden py-3 px-2 flex flex-col items-center gap-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {railSections.map((sec, secIdx) => (
          <div key={sec.group} className="w-full flex flex-col items-center gap-2">
            {secIdx > 0 && (
              <div className="w-8 h-[1px] bg-slate-200/80 dark:bg-slate-800 my-0.5" />
            )}
            
            {/* Section tiny group pill */}
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
              {sec.group}
            </span>

            {/* Icons within this group */}
            <div className="flex flex-col items-center gap-2.5 w-full">
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative flex flex-col items-center justify-center w-full"
                    title={item.name}
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                    
                    <span className={`text-[9px] font-mono tracking-tight mt-0.5 text-center transition-colors truncate max-w-full px-1 ${
                      isActive ? 'text-blue-600 font-bold' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom Expand Arrow indicator */}
        <div className="pt-2 pb-1 w-full flex justify-center">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="w-9 h-9 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-600 transition flex items-center justify-center cursor-pointer"
            title="Open Drawer with Full Names"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
