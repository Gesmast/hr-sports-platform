'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';
import { AppRole } from '@/lib/types';
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
  Film,
  FileText,
  Globe,
  Mail,
  Settings,
  ChevronDown,
  LogOut,
  Shield,
  Crown,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: string[];
  badge?: string;
  badgeAlert?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  userRole?: AppRole;
  pendingInquiriesCount?: number;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({
  userRole: propRole,
  pendingInquiriesCount = 4,
  isCollapsed = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const { t, isUrdu, isRoman } = useI18n();
  const { currentRole, currentUser, logout } = useRole();
  const userRole = propRole || currentRole;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'HR';
  };

  const getRoleTheme = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          label: 'Owner & CEO',
          badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          avatarBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white',
        };
      case 'hamza':
        return {
          label: 'Operations Coordinator',
          badgeClass: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
          avatarBg: 'bg-gradient-to-br from-sky-400 to-sky-600 text-white',
        };
      case 'usman':
        return {
          label: 'Designer',
          badgeClass: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
          avatarBg: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
        };
      case 'umair':
        return {
          label: 'Accounts & Commercials',
          badgeClass: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
          avatarBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white',
        };
      case 'mubasher':
        return {
          label: 'Production In-Charge',
          badgeClass: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
          avatarBg: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
        };
      case 'ashfaq':
        return {
          label: 'QC',
          badgeClass: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30',
          avatarBg: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white',
        };
      case 'cutter':
        return {
          label: 'Cutting Master',
          badgeClass: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
          avatarBg: 'bg-gradient-to-br from-rose-400 to-rose-600 text-white',
        };
      case 'printer':
        return {
          label: 'Sublimation Master',
          badgeClass: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30',
          avatarBg: 'bg-gradient-to-br from-indigo-400 to-indigo-600 text-white',
        };
      case 'heat_transfer':
      case 'heatpress':
        return {
          label: 'Heat Transfer',
          badgeClass: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
          avatarBg: 'bg-gradient-to-br from-amber-500 to-red-600 text-white',
        };
      case 'aamir':
        return {
          label: 'Store Keeper',
          badgeClass: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
          avatarBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white',
        };
      default:
        return {
          label: role,
          badgeClass: 'bg-surface-elevated text-muted border-border',
          avatarBg: 'bg-gradient-to-br from-zinc-700 to-zinc-900 text-white',
        };
    }
  };

  const roleTheme = getRoleTheme(userRole);

  const navGroups: NavGroup[] = [
    {
      title: isUrdu ? 'آپریشنز و انکوائریز' : isRoman ? 'OPERATIONS AUR LEADS' : 'OPERATIONS & INQUIRIES',
      items: [
        {
          name: t.nav.dashboard,
          href: '/',
          icon: LayoutDashboard,
          roles: ['owner', 'hamza', 'usman', 'mubasher', 'ashfaq', 'umair', 'aamir'],
        },
        {
          name: t.nav.inquiries,
          href: '/inquiries',
          icon: MessageSquareText,
          badge: pendingInquiriesCount > 0 ? String(pendingInquiriesCount) : undefined,
          badgeAlert: true,
          roles: ['owner', 'hamza', 'usman', 'umair'],
        },
        {
          name: t.nav.coordinator,
          href: '/coordinator',
          icon: Compass,
          roles: ['owner', 'hamza'],
        },
        {
          name: t.nav.designDesk,
          href: '/design-desk',
          icon: Palette,
          roles: ['owner', 'usman', 'hamza'],
        },
        {
          name: isUrdu ? 'پروموشنز و نیوز لیٹر' : isRoman ? 'Promotions aur News' : 'Promotions & News',
          href: '/promotions',
          icon: Mail,
          roles: ['owner', 'hamza'],
        },
      ],
    },
    {
      title: isUrdu ? 'پروڈکشن فلور' : isRoman ? 'PRODUCTION FLOOR STATIONS' : 'SHOP FLOOR STATIONS',
      items: [
        {
          name: t.nav.cutting,
          href: '/stations/cutting',
          icon: Scissors,
          roles: ['owner', 'mubasher', 'supervisor'],
        },
        {
          name: t.nav.printing,
          href: '/stations/printing',
          icon: Printer,
          roles: ['owner', 'usman', 'mubasher'],
        },
        {
          name: t.nav.heatTransfer,
          href: '/stations/heat-transfer',
          icon: Flame,
          roles: ['owner', 'usman', 'mubasher'],
        },
        {
          name: t.nav.stitching,
          href: '/stations/stitching',
          icon: Shirt,
          roles: ['owner', 'mubasher', 'supervisor'],
        },
        {
          name: t.nav.qc,
          href: '/stations/qc',
          icon: CheckCircle,
          roles: ['owner', 'ashfaq', 'mubasher'],
        },
        {
          name: t.nav.packing,
          href: '/stations/packing',
          icon: Package,
          roles: ['owner', 'mubasher'],
        },
        {
          name: t.nav.dispatch,
          href: '/stations/dispatch',
          icon: Truck,
          roles: ['owner', 'mubasher', 'umair'],
        },
      ],
    },
    {
      title: isUrdu ? 'کمرشل و انوینٹری' : isRoman ? 'COMMERCIAL AUR STOCK' : 'COMMERCIAL & INVENTORY',
      items: [
        {
          name: t.nav.store,
          href: '/store',
          icon: Boxes,
          roles: ['owner', 'aamir', 'mubasher'],
        },
        {
          name: t.nav.accounts,
          href: '/accounts',
          icon: Receipt,
          roles: ['owner', 'umair'],
        },
        {
          name: t.nav.jobs,
          href: '/jobs',
          icon: Layers,
          roles: ['owner', 'hamza', 'usman', 'mubasher', 'umair'],
        },
      ],
    },
    {
      title: isUrdu ? 'انتظامیہ و تجزیات' : isRoman ? 'MANAGEMENT AUR REPORTS' : 'MANAGEMENT & ANALYTICS',
      items: [
        {
          name: t.nav.analytics,
          href: '/analytics',
          icon: BarChart3,
          roles: ['owner', 'hamza'],
        },
        {
          name: t.nav.employeeAttendance,
          href: '/attendance-report',
          icon: Users,
          roles: ['owner'],
        },
        {
          name: (t.nav as any).userManagement || (isUrdu ? 'صارفین کی ترتیب' : isRoman ? 'Users Ki Setting' : 'User Management'),
          href: '/attendance-report/users',
          icon: UserCog,
          roles: ['owner'],
        },
      ],
    },
    {
      title: isUrdu ? 'ویب سائٹ مینجمنٹ' : isRoman ? 'WEBSITE KI SETTINGS' : 'WEBSITE MANAGEMENT',
      items: [
        {
          name: isUrdu ? 'تھیم و مواد ایڈیٹر' : isRoman ? 'Theme aur Content Editor' : 'Visual Theme & Content Editor',
          href: '/website-management/theme-editor',
          icon: Palette,
          roles: ['owner'],
          badge: 'VISUAL',
        },
        {
          name: isUrdu ? 'قانونی پالیسیاں' : isRoman ? 'Company Policies' : 'Policies',
          href: '/website-management/policies',
          icon: FileText,
          roles: ['owner'],
        },
        {
          name: isUrdu ? 'ای میل و سسٹم سیٹنگز' : isRoman ? 'Email aur System Settings' : 'Email & Settings',
          href: '/website-management/settings',
          icon: Settings,
          roles: ['owner'],
        },
      ],
    },
  ];

  return (
    <aside
      className={`border-r-0 md:border-r border-border bg-surface flex flex-col h-full min-h-0 select-none transition-all duration-300 shrink-0 relative z-30 ${
        isCollapsed ? 'w-[72px]' : 'w-full md:w-64'
      }`}
    >
      {/* ── 1. Account Profile Card (Inspired by Client Portal) ── */}
      <div className="relative p-2.5 border-b border-border shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          title={isCollapsed ? `${currentUser.name} (${currentUser.title})` : 'Account & Station Menu'}
          className={`w-full rounded-xl transition cursor-pointer text-left ${
            isCollapsed
              ? 'p-1.5 flex items-center justify-center hover:bg-surface-elevated'
              : 'p-2 bg-surface-elevated/70 hover:bg-surface-elevated border border-border hover:border-ink/30 shadow-2xs flex items-center justify-between'
          } ${isMenuOpen ? 'ring-2 ring-ink/20 bg-surface-elevated' : ''}`}
        >
          {isCollapsed ? (
            /* Minimized Mode: Avatar Icon with matching Role Gradient */
            <div className={`w-10 h-10 rounded-full ${roleTheme.avatarBg} font-mono font-black flex items-center justify-center text-xs shadow-xs border border-white/20`}>
              {getInitials(currentUser.name, currentUser.email)}
            </div>
          ) : (
            /* Expanded Mode: Full Card */
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-9 h-9 rounded-full ${roleTheme.avatarBg} font-mono font-black flex items-center justify-center text-xs shadow-xs shrink-0 border border-white/20`}>
                {getInitials(currentUser.name, currentUser.email)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-ink truncate leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono text-muted truncate mt-0.5">
                  {currentUser.email}
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted shrink-0 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          )}
        </button>

        {/* Popover Account Menu - When collapsed floats outside to the right of the 72px sidebar */}
        {isMenuOpen && (
          <div
            className={`absolute z-[9999] bg-surface border border-border rounded-2xl shadow-2xl p-2 text-ink animate-in fade-in zoom-in-95 duration-150 ${
              isCollapsed
                ? 'left-full ml-3 top-2 min-w-[250px]'
                : 'left-2.5 right-2.5 top-full mt-1.5 min-w-[220px]'
            }`}
          >
            <div className="px-3 py-2 border-b border-border mb-1.5 bg-surface-elevated rounded-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-8 h-8 rounded-full ${roleTheme.avatarBg} font-mono font-black flex items-center justify-center text-[11px] shadow-xs shrink-0 border border-white/20`}>
                  {getInitials(currentUser.name, currentUser.email)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-ink truncate">{currentUser.name}</div>
                  <div className="text-[10px] font-mono text-muted truncate">{currentUser.email}</div>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${roleTheme.badgeClass}`}>
                {userRole === 'owner' ? <Crown className="w-2.5 h-2.5 text-amber-500" /> : <Shield className="w-2.5 h-2.5" />}
                <span>{currentUser.title || roleTheme.label}</span>
              </div>
            </div>

            <div className="space-y-0.5 text-xs">
              {userRole === 'owner' && (
                <Link
                  href="/attendance-report/users"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNavigate?.();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ink hover:bg-surface-elevated transition"
                >
                  <UserCog className="w-4 h-4 text-muted shrink-0" />
                  <span className={isUrdu ? 'font-urdu text-[14px]' : ''}>
                    {isUrdu ? 'صارفین کی ترتیب' : isRoman ? 'Users Ki Setting' : 'User Management'}
                  </span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className={isUrdu ? 'font-urdu text-[14px]' : ''}>
                  {isUrdu ? 'لاگ آؤٹ' : isRoman ? 'Sign Out / Bahar Niklo' : 'Sign Out'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Navigation Items ── */}
      <div className={`flex-1 overflow-y-auto min-h-0 space-y-5 ${isCollapsed ? 'p-2' : 'px-3 py-3'}`}>
        {navGroups.map((group, idx) => {
          // Filter items based on user role
          const visibleItems = group.items.filter((item) =>
            userRole === 'owner' ? true : item.roles.includes(userRole)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {!isCollapsed ? (
                <div
                  className={`px-3 uppercase font-mono tracking-wider text-muted-light font-bold mb-1.5 ${
                    isUrdu ? 'font-urdu text-[12px]' : 'text-[10px]'
                  }`}
                >
                  {group.title}
                </div>
              ) : (
                <div className="my-2 border-t border-border" />
              )}

              {visibleItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                if (isCollapsed) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={item.name}
                      className={`relative flex items-center justify-center w-full h-10 rounded-xl transition ${
                        isActive
                          ? 'bg-accent text-accent-contrast font-bold shadow-xs'
                          : 'text-muted hover:text-ink hover:bg-surface-hover'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.badge && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                      )}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-accent text-accent-contrast font-bold shadow-xs'
                        : 'text-muted hover:text-ink hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className={isUrdu ? 'font-urdu text-[15px] leading-tight font-semibold' : 'font-sans'}>
                        {item.name}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.badgeAlert
                            ? 'bg-rose-500 text-white'
                            : isActive
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-surface-elevated text-ink border border-border'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
