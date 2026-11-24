'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppRole } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  title: string;
  department: string;
  description: string;
  permissions?: string[];
}

// Verified production staff records directly matching database profiles
export const PRESET_STAFF: StaffProfile[] = [
  {
    id: '757946e1-ad09-42ee-ae90-e3961dc2ec6b',
    name: 'Muhammad Hafeez',
    email: 'owner@thehrsports.com',
    role: 'owner',
    title: 'Owner & CEO',
    department: 'Executive Management',
    description: 'Full system visibility, employee attendance calendar, commercial control, user management',
    permissions: ['all', 'management', 'commercial', 'floor', 'users', 'attendance'],
  },
  {
    id: '8bd37771-69c7-498a-8927-b31a1b3e4e8c',
    name: 'Hassan',
    email: 'owner2@thehrsports.com',
    role: 'owner',
    title: 'Operations Director',
    department: 'Executive Management',
    description: 'Executive management and operational oversight',
    permissions: ['all', 'management', 'commercial', 'floor'],
  },
  {
    id: '3fc87ef4-6d51-48b3-9354-c8bc86fc47cf',
    name: 'Hamza',
    email: 'coordinator1@thehrsports.com',
    role: 'hamza',
    title: 'Operations Coordinator',
    department: 'Operations & Planning',
    description: 'Inquiry triage, designer assignment, target scheduling, job allotment',
    permissions: ['inquiries_triage', 'jobs_schedule', 'design_view', 'floor_view'],
  },
  {
    id: '332956b9-3ed6-4903-90a8-6d1128a15505',
    name: 'Usman',
    email: 'designer1@thehrsports.com',
    role: 'usman',
    title: 'Design & Order Desk',
    department: 'Textile CAD Design',
    description: 'Client design chat, 3D mockups, allow client approval gate, job creation',
    permissions: ['design_chat', 'mockup_upload', 'approval_unlock', 'tech_pack'],
  },
  {
    id: '77ff6ccf-e822-4e50-947c-0f9f594cf66d',
    name: 'Shahzaib',
    email: 'designer2@thehrsports.com',
    role: 'usman',
    title: 'CAD Pattern Designer',
    department: 'Design Department',
    description: 'Sublimation vector artwork and pattern grading',
    permissions: ['design_chat', 'mockup_upload', 'approval_unlock', 'tech_pack'],
  },
  {
    id: '19431ba9-397a-4131-99e6-c5cdc5c43d27',
    name: 'Faizan',
    email: 'designer3@thehrsports.com',
    role: 'usman',
    title: 'Design Specialist',
    department: 'Design Department',
    description: 'Mockup proofing and design inquiry queue',
    permissions: ['design_chat', 'mockup_upload', 'approval_unlock', 'tech_pack'],
  },
  {
    id: '370233b1-095c-4a7d-817f-99365d7037f9',
    name: 'Muhammad Umair',
    email: 'accounts1@thehrsports.com',
    role: 'umair',
    title: 'Accounts & Commercials',
    department: 'Commercials & Finance',
    description: 'Delivery & quantity confirmation, auto-assigned pending quotes, 24h formal quotes, invoices',
    permissions: ['accounts_chat', 'issue_quotes', 'pricing_calculator', 'invoices'],
  },
  {
    id: '27f37d24-e376-4349-8bf9-9df1a0d92b37',
    name: 'Mubasher',
    email: 'production1@thehrsports.com',
    role: 'mubasher',
    title: 'Production In-Charge',
    department: 'Manufacturing Plant',
    description: 'Stage entries, line balance, cutting/printing/stitching/dispatch overview',
    permissions: ['floor_management', 'stations_all', 'jobs_progress'],
  },
  {
    id: '358625de-a670-4fb7-aa2f-b8f237f5fb39',
    name: 'Ashfaq',
    email: 'qc1@thehrsports.com',
    role: 'ashfaq',
    title: 'Quality Department Lead',
    department: 'Quality Assurance',
    description: 'QC kiosk, defect inspection, pass/rework/reject counters, AQL 1.0 audit',
    permissions: ['qc_kiosk', 'aql_audit', 'pass_reject', 'clearance'],
  },
  {
    id: '1af77292-b9b5-4bf9-95a0-4964d1bfa2ac',
    name: 'Shahmeer',
    email: 'cutting1@thehrsports.com',
    role: 'cutter' as any,
    title: 'Cutting Master',
    department: 'Cutting Station',
    description: 'Marker planning, fabric lay inspection, and fabric bundle cutting',
    permissions: ['station_cutting', 'marker_view'],
  },
  {
    id: 'a33fa6e0-1a83-4e48-9704-454bd022f01e',
    name: 'Ruban Ali',
    email: 'printing1@thehrsports.com',
    role: 'printer' as any,
    title: 'Sublimation & Printing Master',
    department: 'Printing Station',
    description: 'Plotter sublimation printing and paper transfer',
    permissions: ['station_printing', 'artwork_view'],
  },
  {
    id: '5668cb54-614d-4f5d-af18-d185d6ccc95e',
    name: 'Aamir',
    email: 'store1@thehrsports.com',
    role: 'aamir',
    title: 'Store & Inventory Master',
    department: 'Warehouse & Store',
    description: 'Raw materials inventory, fabric rolls, trims, and job BOM release',
    permissions: ['store_view', 'bom_release', 'inventory_manage'],
  },
];

interface RoleContextType {
  currentUser: StaffProfile;
  currentRole: AppRole;
  isAuthenticated: boolean;
  isMounted: boolean;
  switchRole: (role: AppRole, staffId?: string) => void;
  switchUser: (staffId: string) => void;
  loginWithEmail: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; field?: 'email' | 'password' | 'general'; error?: string }>;
  logout: () => void;
  staffList: StaffProfile[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<StaffProfile>(PRESET_STAFF[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    currentUserIdRef.current = isAuthenticated ? currentUser.id : null;
  }, [isAuthenticated, currentUser]);

  // Session check strictly on session level (closed browser = re-login required)
  useEffect(() => {
    setIsMounted(true);
    try {
      // Clear legacy long-lived storage so closing browser mandates new login
      localStorage.removeItem('hr_sports_auto_auth');
      localStorage.removeItem('hr_sports_auth_session');

      const authSession = sessionStorage.getItem('hr_sports_auth_session');
      if (authSession) {
        const parsed = JSON.parse(authSession);
        const found = PRESET_STAFF.find((s) => s.id === parsed.id || s.email?.toLowerCase() === parsed.email?.toLowerCase());
        if (found) {
          setCurrentUser(found);
          setIsAuthenticated(true);
          return;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Heartbeat & browser unload handler
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;

    // Send initial heartbeat
    const sendHeartbeat = () => {
      let sessionStart: string | undefined;
      try {
        const sessionData = sessionStorage.getItem('hr_sports_auth_session');
        if (sessionData) {
          sessionStart = JSON.parse(sessionData).loginTime;
        }
      } catch {}

      fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'heartbeat', userId: currentUser.id, sessionStart }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.valid === false) {
            sessionStorage.removeItem('hr_sports_auth_session');
            setIsAuthenticated(false);
            window.location.href = `/login?revoked=${encodeURIComponent(data.message || 'Session expired')}`;
          }
        })
        .catch(() => {});
    };
    sendHeartbeat();

    // Periodic heartbeat every 30s
    const interval = setInterval(sendHeartbeat, 30000);

    // When browser tab/window closes, mark offline
    const handleUnload = () => {
      const uid = currentUserIdRef.current;
      if (uid) {
        const payload = JSON.stringify({ action: 'logout', userId: uid });
        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/attendance', blob);
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [isAuthenticated, currentUser?.id]);

  const loginWithEmail = async (
    emailInput: string,
    passwordInput?: string
  ): Promise<{ success: boolean; field?: 'email' | 'password' | 'general'; error?: string }> => {
    const trimmedEmail = emailInput.trim().toLowerCase();
    const password = passwordInput?.trim() || '';

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return { success: false, field: 'email', error: 'Please enter a valid work email address.' };
    }

    if (trimmedEmail === 'admin@site.com' || trimmedEmail === 'test@test.com') {
      return { success: false, field: 'email', error: 'This email is not permitted to access factory systems.' };
    }

    if (!password || password.length < 6) {
      return { success: false, field: 'password', error: 'Password must be at least 6 characters.' };
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          field: data.field || 'general',
          error: data.message || 'Authentication failed. Please verify your credentials.',
        };
      }

      // Successful password verification and profile detection
      const userProfile: StaffProfile = data.user;
      setCurrentUser(userProfile);
      setIsAuthenticated(true);

      // Store in sessionStorage so closing browser closes session
      sessionStorage.setItem(
        'hr_sports_auth_session',
        JSON.stringify({
          id: userProfile.id,
          email: userProfile.email,
          role: userProfile.role,
          name: userProfile.name,
          loginTime: new Date().toISOString(),
        })
      );

      return { success: true };
    } catch (err: any) {
      console.error('Login request failed:', err);
      return {
        success: false,
        field: 'general',
        error: 'Unable to connect to the authentication server. Please try again.',
      };
    }
  };

  const switchUser = (staffId: string) => {
    const found = PRESET_STAFF.find((s) => s.id === staffId);
    if (found) {
      setCurrentUser(found);
      try {
        sessionStorage.setItem(
          'hr_sports_auth_session',
          JSON.stringify({
            id: found.id,
            email: found.email,
            role: found.role,
            name: found.name,
            loginTime: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore
      }
    }
  };

  const switchRole = (newRole: AppRole, staffId?: string) => {
    if (staffId) {
      switchUser(staffId);
      return;
    }
    const found = PRESET_STAFF.find((s) => s.role === newRole);
    if (found) {
      setCurrentUser(found);
      try {
        sessionStorage.setItem(
          'hr_sports_auth_session',
          JSON.stringify({
            id: found.id,
            email: found.email,
            role: found.role,
            name: found.name,
            loginTime: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore
      }
    }
  };

  const logout = () => {
    // Record logout time before session clear
    if (currentUser?.id) {
      fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logout',
          userId: currentUser.id,
        }),
      }).catch(() => {});
    }

    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('hr_sports_auth_session');
      if (currentUser?.id) {
        sessionStorage.removeItem(`hr_sports_missed_modal_seen_${currentUser.id}`);
      }
      localStorage.removeItem('hr_sports_auto_auth');
      localStorage.removeItem('hr_sports_auth_session');
      const supabase = createClient();
      supabase.auth.signOut().catch(() => {});
    } catch {
      // Ignore
    }
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        isAuthenticated,
        isMounted,
        switchRole,
        switchUser,
        loginWithEmail,
        logout,
        staffList: PRESET_STAFF,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
