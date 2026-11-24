'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PortalHeader } from './PortalHeader';
import { PortalSidebar } from './PortalSidebar';

interface PortalShellProps {
  companyName: string;
  userEmail: string;
  fullName: string;
  avatarUrl: string | null;
  isGoogle: boolean;
  userRole?: string;
  children: React.ReactNode;
}

export const PortalShell: React.FC<PortalShellProps> = ({
  companyName,
  userEmail,
  fullName,
  avatarUrl,
  isGoogle,
  userRole,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portal_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('portal_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-black flex flex-col font-sans selection:bg-black selection:text-white antialiased">
      <PortalHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        avatarUrl={avatarUrl}
        fullName={fullName}
        userEmail={userEmail}
      />

      {/* Mobile Slide-over Drawer for Phone & Tablet (< md) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Sheet */}
          <div className="relative w-[280px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col border-r-2 border-black z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b-2 border-black flex items-center justify-between bg-zinc-100">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-black">Client Portal Menu</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg border border-black hover:bg-zinc-200 text-black cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <PortalSidebar
                isCollapsed={false}
                companyName={companyName}
                userEmail={userEmail}
                fullName={fullName}
                avatarUrl={avatarUrl}
                isGoogle={isGoogle}
                userRole={userRole}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row w-full">
        {/* Desktop Collapsible Sidebar Container with persistent black line separator */}
        <div className="hidden md:block shrink-0 border-r-2 border-black bg-white transition-all duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
          <PortalSidebar
            isCollapsed={isCollapsed}
            companyName={companyName}
            userEmail={userEmail}
            fullName={fullName}
            avatarUrl={avatarUrl}
            isGoogle={isGoogle}
            userRole={userRole}
          />
        </div>

        {/* Main Content Area: Responsive padding stretching to full width */}
        <main className="flex-1 px-3 sm:px-6 py-4 max-w-7xl mx-auto w-full transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};
