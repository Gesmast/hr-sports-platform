'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { RoleSelector } from '@/components/shared/RoleSelector';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Bell, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  unreadCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleMobileMenu?: () => void;
}

export function Header({
  unreadCount = 0,
  isCollapsed = false,
  onToggleCollapse,
  onToggleMobileMenu,
}: HeaderProps) {
  const { t, isUrdu, isRoman } = useI18n();
  const { currentUser, currentRole, logout } = useRole();

  return (
    <header className="sticky top-0 z-40 w-full shrink-0 border-b border-border bg-surface/95 backdrop-blur-md px-3 sm:px-6 py-2.5 transition">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Navigation Toggles & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Drawer Toggle (< md) */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-ink hover:bg-surface-hover hover:text-accent border border-border transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Open Factory Navigation Menu"
            aria-label="Open Menu"
          >
            <Menu className="w-4 h-4 text-current" />
            <span className="text-xs font-mono font-bold uppercase hidden xs:inline">Menu</span>
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-7 w-20 sm:h-8 sm:w-24">
              <Image
                src="/logo.png"
                alt="HR SPORTS"
                fill
                className="object-contain object-left dark:invert"
                priority
              />
            </div>
            <div className="hidden xl:block border-l border-border pl-2.5">
              <div className="text-xs font-extrabold tracking-tight text-ink flex items-center gap-1.5">
                <span className={isUrdu ? 'font-urdu' : 'font-sans'}>{t.brand}</span>
              </div>
              <div className="text-[9px] uppercase font-mono tracking-wider text-muted-light -mt-0.5">
                {t.brandSub}
              </div>
            </div>
          </Link>

          {/* Dynamic Role Switcher in Header (Desktop only - on mobile it lives in the Hamburger Drawer) */}
          <div className="hidden md:block ml-0.5 sm:ml-2">
            <RoleSelector />
          </div>
        </div>

        {/* Right Navigation & Control Suite */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Toggle Dropdown with Country Flags (Desktop only - on mobile it lives in the Hamburger Drawer) */}
          <div className="hidden md:block">
            <LanguageToggle />
          </div>

          {/* Light / Dark Mode Switch */}
          <ThemeToggle />

          {/* Operational Notification Bell */}
          <NotificationBell />

          {/* Sign Out Button (Desktop only - on mobile user clicks their profile in drawer) */}
          <button
            onClick={logout}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl border border-border bg-surface hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 transition text-muted cursor-pointer"
            title={isUrdu ? 'لاگ آؤٹ کریں' : isRoman ? 'Sign Out / Bahar Niklo' : 'Sign Out / Switch Station'}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

