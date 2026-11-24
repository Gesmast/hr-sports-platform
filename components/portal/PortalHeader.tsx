'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PanelLeftClose, PanelLeft, Menu } from 'lucide-react';

interface PortalHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleMobileMenu?: () => void;
  avatarUrl?: string | null;
  fullName?: string;
  userEmail?: string;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black h-16 flex items-center px-3 sm:px-6 justify-between text-black transition-colors shadow-xs">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Drawer Toggle (< md) */}
        <button
          type="button"
          onClick={onToggleMobileMenu || onToggleCollapse}
          className="md:hidden p-2 rounded-xl text-black hover:bg-zinc-200 border border-black transition cursor-pointer flex items-center gap-1.5"
          title="Open Portal Menu"
          aria-label="Open Portal Menu"
        >
          <Menu className="w-5 h-5 text-black" />
          <span className="text-xs font-mono font-bold uppercase hidden xs:inline">Menu</span>
        </button>

        {/* Desktop Sidebar Minimize / Expand Toggle Button (>= md) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 rounded-xl text-black hover:bg-zinc-200 border border-black transition cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <PanelLeft className="w-5 h-5 text-black" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-black" />
          )}
        </button>

        <span className="text-black/30 font-bold hidden sm:inline">|</span>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-black text-black bg-zinc-100 hover:bg-zinc-200 border-2 border-black transition group cursor-pointer shadow-xs"
          title="Return to Public Website Home"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-black shrink-0" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden font-mono">Home</span>
        </Link>
      </div>

      {/* Right side: Client Portal Badge */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black bg-zinc-100 px-2.5 py-1 rounded-lg border border-gray-300">
          Client Portal
        </span>
      </div>
    </header>
  );
};
