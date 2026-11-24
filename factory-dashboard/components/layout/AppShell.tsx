'use client';

import React, { useState, useEffect } from 'react';
import { useRole } from '@/lib/auth/role-context';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { Header } from '@/components/layout/Header';
import { LeftIconRail } from '@/components/layout/LeftIconRail';
import { OverlayDrawer } from '@/components/layout/OverlayDrawer';
import { NotificationProvider } from '@/lib/notifications/notification-context';
import { NotificationToastContainer } from '@/components/notifications/NotificationToast';
import { MissedAlertsModal } from '@/components/notifications/MissedAlertsModal';
import { RoleSelector } from '@/components/shared/RoleSelector';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { X } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // If not authenticated, display the Login Screen directly (SSR & Client match seamlessly)
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Authenticated: Render master factory operations shell with slim left rail and overlay drawer
  return (
    <NotificationProvider>
      <div className="h-screen h-[100dvh] max-h-screen bg-bg text-ink flex flex-col font-sans selection:bg-ink selection:text-surface antialiased overflow-hidden">
        {/* Top Navigation Bar with Drawer Toggle Button */}
        <Header
          isCollapsed={false}
          onToggleCollapse={() => setIsDrawerOpen((prev) => !prev)}
          onToggleMobileMenu={() => setIsDrawerOpen(true)}
        />

        {/* Master Application Frame: Slim Left Icon Rail + Content Canvas */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* Left Icon Rail (Matches Reference Mockup: 72px rail with clean squircle action icons) */}
          <LeftIconRail
            isDrawerOpen={isDrawerOpen}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />

          {/* Main Content Pane (Independent scroll pane with clean Cool Ice Gray canvas) */}
          <main className="flex-1 overflow-y-auto h-full min-h-0 p-4 sm:p-6 lg:p-8 bg-[#F4F6F9] dark:bg-bg transition min-w-0">
            {children}
          </main>
        </div>

        {/* Smooth Motion Overlay Drawer (Slides above the main page when opened) */}
        <OverlayDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        {/* Real-time Slide-in Toast Notifications */}
        <NotificationToastContainer />

        {/* On-Login Missed Activity Modal */}
        <MissedAlertsModal />
      </div>
    </NotificationProvider>
  );
}
