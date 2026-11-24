'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquareText,
  Package,
  PlusCircle,
  Globe,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Users,
} from 'lucide-react';
import { signOut } from '@/app/actions/auth';

interface PortalSidebarProps {
  isCollapsed: boolean;
  companyName?: string;
  userEmail?: string;
  fullName?: string;
  avatarUrl?: string | null;
  isGoogle?: boolean;
  userRole?: string;
  onNavigate?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  isCollapsed,
  companyName = 'OEM Client',
  userEmail = '',
  fullName = '',
  avatarUrl = null,
  isGoogle = false,
  userRole,
  onNavigate,
}) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initial = (fullName?.[0] || companyName?.[0] || userEmail?.[0] || 'U').toUpperCase();

  // Close menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Main navigation items
  const navItems = [
    {
      label: 'Production Overview',
      href: '/portal',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Inquiries & Quotes',
      href: '/portal/inquiries',
      icon: MessageSquareText,
      exact: false,
    },
    {
      label: 'Orders & Tracking',
      href: '/portal/orders',
      icon: Package,
      exact: false,
    },
    ...(userRole === 'owner'
      ? [
          {
            label: 'Staff & Attendance',
            href: '/portal/staff-attendance',
            icon: Users,
            exact: false,
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`bg-white transition-all duration-300 ease-in-out text-black select-none ${
        isCollapsed ? 'w-[76px] p-2 space-y-3' : 'w-64 p-3.5 space-y-3.5'
      }`}
    >
      {/* ── 1. Account Profile Card (No thick black outline) ── */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          title={isCollapsed ? `${fullName || companyName} (Click for Account Menu)` : 'Click for Account & Security Menu'}
          className={`w-full rounded-2xl transition cursor-pointer group text-left ${
            isCollapsed
              ? 'p-1 flex items-center justify-center hover:scale-105'
              : 'p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-gray-200/90 hover:border-gray-300 shadow-2xs flex items-center justify-between'
          } ${isMenuOpen ? 'ring-1 ring-gray-300 bg-zinc-100' : ''}`}
        >
          {isCollapsed ? (
            /* Minimized Mode: ONLY SHOW THE AVATAR IMAGE */
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName || companyName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-2xs group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-200 text-black font-mono font-black flex items-center justify-center text-xs shadow-2xs border border-gray-200 group-hover:scale-105 transition-transform">
                  {initial}
                </div>
              )}
              {isGoogle && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-xs border border-gray-300"
                  title="Google Account"
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            /* Expanded Mode: Full Card with Image, Name, and Arrow */
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || companyName}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-200 text-black font-mono font-black flex items-center justify-center text-xs shadow-xs border border-gray-200">
                    {initial}
                  </div>
                )}
                {isGoogle && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white flex items-center justify-center shadow-xs border border-gray-300"
                    title="Google Account"
                  >
                    <svg className="w-2 h-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-black text-xs text-black truncate leading-tight">
                  {fullName || companyName}
                </div>
                <div className="text-[10px] font-mono text-zinc-600 truncate font-bold">
                  {userEmail}
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-black shrink-0 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          )}
        </button>

        {/* Popover Box (Appears when Account Card is clicked - soft borders, no heavy black outline) */}
        {isMenuOpen && (
          <div
            className={`absolute top-full mt-2 z-50 bg-white border border-gray-200/90 rounded-2xl shadow-xl p-2 text-black animate-in fade-in zoom-in-95 duration-150 ${
              isCollapsed ? 'left-0 min-w-[240px]' : 'left-0 right-0 min-w-[240px]'
            }`}
          >
            {/* Header: User Email & Name */}
            <div className="px-3 py-2 border-b border-gray-200 mb-1.5 bg-zinc-50 rounded-xl">
              <div className="font-black text-xs text-black truncate">
                {fullName || companyName}
              </div>
              <div className="text-[10px] font-mono text-zinc-600 truncate font-bold mt-0.5">
                {userEmail}
              </div>
              {isGoogle && (
                <div className="inline-flex items-center gap-1 text-[9px] font-mono uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 mt-1 font-black">
                  <span>Google Account</span>
                </div>
              )}
            </div>

            {/* Menu Links */}
            <div className="space-y-0.5">
              <Link
                href="/portal/profile"
                onClick={() => { setIsMenuOpen(false); onNavigate?.(); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 border border-transparent hover:border-gray-200 transition"
              >
                <Settings className="w-4 h-4 text-black shrink-0" />
                <span>Account Profile</span>
              </Link>

              <Link
                href="/portal/profile"
                onClick={() => { setIsMenuOpen(false); onNavigate?.(); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 border border-transparent hover:border-gray-200 transition"
              >
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>Security & Password</span>
              </Link>

              <Link
                href="/"
                onClick={() => { setIsMenuOpen(false); onNavigate?.(); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-zinc-100 border border-transparent hover:border-gray-200 transition"
              >
                <Globe className="w-4 h-4 text-black shrink-0" />
                <span>Public Website</span>
              </Link>
            </div>

            <div className="border-t border-gray-200 my-1.5" />

            {/* Log Out Button inside Popup */}
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-black text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-red-600 shrink-0" />
                <span>Log out</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── 2. Navigation Items ── */}
      <div className="space-y-1">
        {!isCollapsed && (
          <div className="px-2 pt-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
            Navigation
          </div>
        )}

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavigate?.()}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl text-xs font-bold transition group ${
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                } ${
                  isActive
                    ? 'bg-zinc-200 text-black border-2 border-black shadow-xs font-black'
                    : 'text-black hover:bg-zinc-100 border border-transparent hover:border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-black" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── 3. Action Button: Request New Quote (Pure black & white) ── */}
      <div className="pt-1">
        <Link
          href="/request-a-quote"
          onClick={() => onNavigate?.()}
          title={isCollapsed ? 'Request New Quote' : undefined}
          className={`flex items-center rounded-xl text-xs font-bold bg-black hover:bg-zinc-800 text-white border border-black transition shadow-sm cursor-pointer ${
            isCollapsed ? 'justify-center p-2.5' : 'justify-center gap-2 w-full py-2.5 px-3'
          }`}
        >
          <PlusCircle className="w-4 h-4 shrink-0 text-white" />
          {!isCollapsed && <span className="text-white font-bold">Request New Quote</span>}
        </Link>
      </div>
    </aside>
  );
};
