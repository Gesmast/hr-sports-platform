'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRole } from '@/lib/auth/role-context';
import { useI18n } from '@/lib/i18n/context';
import {
  Users,
  Shield,
  ShieldCheck,
  KeyRound,
  UserCheck,
  UserX,
  Edit3,
  Search,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sliders,
  Sparkles,
  ArrowRight,
  Info,
  Building2,
  ExternalLink,
  ShieldAlert,
  Radio,
  ChevronDown,
  X,
  Briefcase,
  Layers,
  ChevronRight,
  CheckSquare,
} from 'lucide-react';

interface StaffUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string | null;
  title: string | null;
  active: boolean;
  permissions: string[];
  password_changed_at?: string;
  updated_at?: string;
}

const ALL_PERMISSIONS = [
  { id: 'all', label: 'Full Access (Owner)', desc: 'Unlocks every single section, station, and setting across the entire company.', group: 'Executive' },
  { id: 'management', label: 'Overview Dashboards', desc: 'View factory stats, order progress charts, and overall line performance.', group: 'Executive' },
  { id: 'commercial', label: 'Financial Reports', desc: 'See revenue, profit margins, pricing totals, and export value figures.', group: 'Executive' },
  { id: 'users', label: 'Manage Staff & Logins', desc: 'Add staff accounts, edit job titles, reset passwords, or remove users.', group: 'Administration' },
  { id: 'attendance', label: 'Staff Attendance', desc: 'Record and review daily check-in / check-out times for factory staff.', group: 'Administration' },
  { id: 'inquiries_triage', label: 'New Client Inquiries', desc: 'View website inquiries and assign them to production coordinators.', group: 'Coordination' },
  { id: 'jobs_schedule', label: 'Job Scheduling', desc: 'Schedule production batches, set delivery targets, and manage master timeline.', group: 'Coordination' },
  { id: 'design_chat', label: 'Client Design Chat', desc: 'Message clients directly to discuss artwork, logos, revisions, and proofs.', group: 'Design' },
  { id: 'approval_unlock', label: 'Unlock Client Approval', desc: 'Approve artwork proofs so the factory can start cutting and printing.', group: 'Design' },
  { id: 'mockup_upload', label: 'Upload Mockups & CAD', desc: 'Upload 3D garment mockups, print vectors, and size spec files.', group: 'Design' },
  { id: 'tech_pack', label: 'Create Tech Packs', desc: 'Generate complete garment measurement sheets and cutting instructions.', group: 'Design' },
  { id: 'accounts_chat', label: 'Quotation Chat', desc: 'Chat with clients regarding order pricing, payment terms, and quotes.', group: 'Accounts' },
  { id: 'issue_quotes', label: 'Send Formal Quotes', desc: 'Generate and send official 24-hour proforma price quotations.', group: 'Accounts' },
  { id: 'pricing_calculator', label: 'Price & Cost Calculator', desc: 'Calculate fabric consumption, stitch cost, and shipping rates per piece.', group: 'Accounts' },
  { id: 'invoices', label: 'Invoices & Billing', desc: 'Create and send proforma and final commercial invoices to clients.', group: 'Accounts' },
  { id: 'floor_management', label: 'Floor Oversight', desc: 'Monitor all factory floor stations, daily output, and worker bottlenecks.', group: 'Production' },
  { id: 'stations_all', label: 'All Floor Stations', desc: 'Allows opening and working at any factory station kiosk.', group: 'Production' },
  { id: 'jobs_progress', label: 'Update Job Progress', desc: 'Mark garment quantities as in-progress or finished at stations.', group: 'Production' },
  { id: 'station_cutting', label: 'Cutting Station', desc: 'Access pattern layout markers, fabric rolls, and cutting machine jobs.', group: 'Stations' },
  { id: 'station_printing', label: 'Printing & Sublimation', desc: 'Access heat presses, sublimation printers, and artwork print queues.', group: 'Stations' },
  { id: 'qc_kiosk', label: 'QC Station Kiosk', desc: 'Inspect finished garments on the tablet kiosk at the end of the line.', group: 'Quality' },
  { id: 'aql_audit', label: 'AQL Quality Audits', desc: 'Log stitching, color, and measurement defects using AQL inspection rules.', group: 'Quality' },
  { id: 'pass_reject', label: 'Pass / Rework / Reject', desc: 'Update real-time counters for approved, reworked, and rejected garments.', group: 'Quality' },
  { id: 'clearance', label: 'Final Release Sign-Off', desc: 'Give final quality clearance so the order can be packed and dispatched.', group: 'Quality' },
  { id: 'store_view', label: 'View Warehouse Stock', desc: 'Check current inventory levels of raw fabric rolls, zippers, threads, and tags.', group: 'Store' },
  { id: 'bom_release', label: 'Release Materials to Floor', desc: 'Sign out fabric and trims from the store for scheduled production jobs.', group: 'Store' },
  { id: 'inventory_manage', label: 'Reorder & Stock Logs', desc: 'Record incoming supplier shipments and log material inventory adjustments.', group: 'Store' },
];

const TEAMS_LIST = [
  { id: 'Executive Management', name: 'Executive Management', defaultRole: 'owner' },
  { id: 'Operations & Planning', name: 'Operations & Planning', defaultRole: 'hamza' },
  { id: 'Textile CAD Design Desk', name: 'Textile CAD Design Desk', defaultRole: 'usman' },
  { id: 'Commercials & Finance', name: 'Commercials & Finance', defaultRole: 'umair' },
  { id: 'Manufacturing Plant', name: 'Manufacturing Plant (Floor)', defaultRole: 'mubasher' },
  { id: 'Quality Assurance (QC)', name: 'Quality Assurance (QC)', defaultRole: 'ashfaq' },
  { id: 'Cutting Station', name: 'Precision Cutting Station', defaultRole: 'cutter' },
  { id: 'Printing & Sublimation', name: 'Printing & Thermal Press', defaultRole: 'printer' },
  { id: 'Heat Transfer Station', name: 'Heat Transfer Station', defaultRole: 'heat_transfer' },
  { id: 'Warehouse & Store', name: 'Warehouse & Raw Materials Store', defaultRole: 'aamir' },
];

const ROLES_LIST = [
  { id: 'owner', label: 'Owner', dept: 'Executive Management' },
  { id: 'hamza', label: 'Operations Coordinator', dept: 'Operations & Planning' },
  { id: 'usman', label: 'Designer', dept: 'Textile CAD Design Desk' },
  { id: 'umair', label: 'Accounts & Commercials Lead', dept: 'Commercials & Finance' },
  { id: 'mubasher', label: 'Production In-Charge', dept: 'Manufacturing Plant' },
  { id: 'ashfaq', label: 'QC', dept: 'Quality Assurance' },
  { id: 'cutter', label: 'Cutting Master', dept: 'Cutting Station' },
  { id: 'printer', label: 'Sublimation / Printing', dept: 'Printing & Sublimation' },
  { id: 'heat_transfer', label: 'Heat Transfer', dept: 'Heat Transfer Station' },
  { id: 'aamir', label: 'Store Keeper', dept: 'Warehouse & Store' },
];

export default function UserManagementPage() {
  const { currentRole } = useRole();
  const { isUrdu, isRoman } = useI18n();

  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Drawer state: null (closed), 'create' (add user), or StaffUser (editing that user)
  const [activeDrawer, setActiveDrawer] = useState<'create' | StaffUser | null>(null);

  // Form states for the Drawer
  const [drawerName, setDrawerName] = useState('');  // merged single full name field
  const [drawerEmail, setDrawerEmail] = useState('');
  const [drawerRole, setDrawerRole] = useState('usman');
  // HIDDEN FOR NOW — RESERVED (department/team assignment, used in handleDepartmentChange & applyRolePreset)
  const [drawerDepartment, setDrawerDepartment] = useState('Textile CAD Design Desk');
  const [drawerTitle, setDrawerTitle] = useState('');
  const [drawerActive, setDrawerActive] = useState(true);
  const [drawerPermissions, setDrawerPermissions] = useState<string[]>([]);
  const [drawerNewPassword, setDrawerNewPassword] = useState('');
  const [drawerPasswordError, setDrawerPasswordError] = useState<string | null>(null);
  const [showDrawerPassword, setShowDrawerPassword] = useState(false);
  const [copiedDrawerPassword, setCopiedDrawerPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGranularPermissions, setShowGranularPermissions] = useState(false);
  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-dismiss notification
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch staff accounts');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
      setActionMessage({ text: err.message || 'Error loading accounts', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleCopyEmail = (email: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Open Drawer for creating a new user
  const openCreateDrawer = () => {
    setDrawerName('');
    setDrawerEmail('');
    setDrawerRole('usman');
    setDrawerDepartment('Textile CAD Design Desk');
    setDrawerTitle('Designer');
    setDrawerActive(true);
    setDrawerPermissions(['design_chat', 'mockup_upload', 'approval_unlock', 'tech_pack']);
    setDrawerNewPassword('HRSports@Design2026!');
    setShowDrawerPassword(false);
    setCopiedDrawerPassword(false);
    setDrawerPasswordError(null);
    setShowGranularPermissions(false);
    setConfirmDelete(false);
    setActiveDrawer('create');
  };

  // Open Drawer for editing an existing user
  const openEditDrawer = (user: StaffUser) => {
    setDrawerName(user.full_name || '');
    setDrawerEmail(user.email);
    setDrawerRole(user.role || 'usman');
    setDrawerDepartment(user.department || getRoleDefaultDept(user.role));
    setDrawerTitle(user.title || '');
    setDrawerActive(user.active !== false);
    setDrawerPermissions(Array.isArray(user.permissions) ? user.permissions : []);
    setDrawerNewPassword('');
    setShowDrawerPassword(false);
    setCopiedDrawerPassword(false);
    setDrawerPasswordError(null);
    setShowGranularPermissions(false);
    setConfirmDelete(false);
    setActiveDrawer(user);
  };

  const closeDrawer = () => {
    if (isSubmitting || isDeleting) return;
    setActiveDrawer(null);
    setDrawerPasswordError(null);
    setConfirmDelete(false);
  };

  function getRoleDefaultDept(roleKey: string) {
    const found = ROLES_LIST.find((r) => r.id === roleKey);
    return found ? found.dept : 'Textile CAD Design Desk';
  }

  // Handle Team / Department change in drawer (auto-sync suggested role)
  const handleDepartmentChange = (deptName: string) => {
    setDrawerDepartment(deptName);
    const matchingTeam = TEAMS_LIST.find((t) => t.id === deptName);
    if (matchingTeam) {
      setDrawerRole(matchingTeam.defaultRole);
      applyRolePreset(matchingTeam.defaultRole);
    }
  };

  // Apply permission preset
  const applyRolePreset = (roleKey: string) => {
    switch (roleKey) {
      case 'owner':
        setDrawerPermissions(['all', 'management', 'commercial', 'users', 'attendance', 'floor_management']);
        break;
      case 'usman':
        setDrawerPermissions(['design_chat', 'mockup_upload', 'approval_unlock', 'tech_pack']);
        break;
      case 'umair':
        setDrawerPermissions(['accounts_chat', 'issue_quotes', 'pricing_calculator', 'invoices']);
        break;
      case 'hamza':
        setDrawerPermissions(['inquiries_triage', 'jobs_schedule', 'management', 'floor_management']);
        break;
      case 'ashfaq':
        setDrawerPermissions(['qc_kiosk', 'aql_audit', 'pass_reject', 'clearance']);
        break;
      case 'cutter':
        setDrawerPermissions(['station_cutting', 'jobs_progress']);
        break;
      case 'printer':
        setDrawerPermissions(['station_printing', 'jobs_progress']);
        break;
      case 'heat_transfer':
      case 'heatpress':
        setDrawerPermissions(['station_printing', 'jobs_progress']);
        break;
      case 'aamir':
        setDrawerPermissions(['store_view', 'bom_release', 'inventory_manage']);
        break;
      case 'mubasher':
        setDrawerPermissions(['floor_management', 'stations_all', 'jobs_progress']);
        break;
      default:
        setDrawerPermissions(['design_chat']);
    }
  };

  // Quick role template applier (syncs role, title, department, and default permissions)
  const applyRoleTemplate = (roleKey: string) => {
    setDrawerRole(roleKey);
    const roleInfo = ROLES_LIST.find((r) => r.id === roleKey);
    if (roleInfo) {
      setDrawerDepartment(roleInfo.dept);
      setDrawerTitle(roleInfo.label);
    }
    applyRolePreset(roleKey);
  };

  const togglePermission = (permId: string) => {
    setDrawerPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  // Submit Drawer (Create or Edit)
  const handleDrawerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDrawerPasswordError(null);

    const fullName = drawerName.trim();

    try {
      if (activeDrawer === 'create') {
        // Create new user
        if (!drawerEmail || !drawerNewPassword || !fullName) {
          throw new Error('Full Name, Email, and Initial Password are required.');
        }

        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: drawerEmail.trim().toLowerCase(),
            fullName,
            role: drawerRole,
            department: drawerDepartment,
            title: drawerTitle || undefined,
            password: drawerNewPassword,
            permissions: drawerPermissions,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create user account');

        setActionMessage({
          text: `Account created for ${fullName} (${drawerEmail}).`,
          type: 'success',
        });
        closeDrawer();
        fetchUsers();
      } else if (activeDrawer && typeof activeDrawer === 'object') {
        // Edit existing user
        const targetUser = activeDrawer;
        const payload: Record<string, any> = {
          userId: targetUser.id,
          fullName,
          department: drawerDepartment,
          title: drawerTitle,
          role: drawerRole,
          active: drawerActive,
          permissions: drawerPermissions,
        };

        if (drawerNewPassword && drawerNewPassword.trim().length > 0) {
          payload.password = drawerNewPassword.trim();
        }

        const res = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update user profile');

        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id
              ? {
                  ...u,
                  full_name: fullName,
                  department: drawerDepartment,
                  title: drawerTitle,
                  role: drawerRole,
                  active: drawerActive,
                  permissions: drawerPermissions,
                }
              : u
          )
        );

        let successMsg = `Updated account for ${targetUser.email}.`;
        if (payload.password) {
          successMsg += ' Password was changed — they will be signed out of all devices immediately.';
        }
        setActionMessage({ text: successMsg, type: 'success' });
        closeDrawer();
      }
    } catch (err: any) {
      setActionMessage({ text: err.message, type: 'error' });
      setDrawerPasswordError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a user permanently
  const handleDeleteUser = async () => {
    if (typeof activeDrawer !== 'object' || activeDrawer === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: activeDrawer.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove user');
      setUsers((prev) => prev.filter((u) => u.id !== (activeDrawer as StaffUser).id));
      setActionMessage({ text: `User ${activeDrawer.email} has been permanently removed.`, type: 'success' });
      setActiveDrawer(null);
      setConfirmDelete(false);
    } catch (err: any) {
      setActionMessage({ text: err.message, type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // The staff roles we manage here — clients are excluded (they have their own portal)
  const STAFF_ROLES = ['owner', 'hamza', 'usman', 'umair', 'mubasher', 'ashfaq', 'cutter', 'printer', 'heat_transfer', 'heatpress', 'aamir'];

  // Count by category for filter tabs
  const categoryCounts = useMemo(() => {
    const valid = users.filter((u) => STAFF_ROLES.includes(u.role));
    return {
      all: valid.length,
      executive: valid.filter((u) => u.role === 'owner').length,
      design: valid.filter((u) => u.role === 'usman').length,
      accounts: valid.filter((u) => u.role === 'umair').length,
      coordination: valid.filter((u) => u.role === 'hamza').length,
      production: valid.filter((u) =>
        ['mubasher', 'ashfaq', 'cutter', 'printer', 'heat_transfer', 'heatpress', 'aamir'].includes(u.role)
      ).length,
    };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => STAFF_ROLES.includes(u.role)) // exclude clients / unknown roles
      .filter((u) => {
        const matchesSearch =
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (filterRole === 'all') return true;
        if (filterRole === 'executive') return u.role === 'owner';
        if (filterRole === 'design') return u.role === 'usman';
        if (filterRole === 'accounts') return u.role === 'umair';
        if (filterRole === 'coordination') return u.role === 'hamza';
        if (filterRole === 'production')
          return ['mubasher', 'ashfaq', 'cutter', 'printer', 'heat_transfer', 'heatpress', 'aamir'].includes(u.role);
        return true;
      });
  }, [users, searchTerm, filterRole]);

  // Role pill styling helper
  const getRoleTheme = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          label: 'Owner',
          badgeClass: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
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
          avatarBg: 'bg-zinc-600 text-white',
        };
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'HR';
  };

  // Owner guard
  if (currentRole !== 'owner') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ink mb-2">Restricted Access: Owner Console Only</h2>
        <p className="text-sm text-muted max-w-md mb-6">
          User account management, sequential role assignments, and password administration are strictly restricted to Executive Management.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-20">
      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`px-4 py-3 rounded-2xl border text-sm flex items-center justify-between shadow-sm transition-all animate-in fade-in slide-in-from-top-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            )}
            <span className="font-medium">{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-semibold underline hover:opacity-80 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Bar matching Reference UI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black tracking-tight text-ink flex items-center gap-2">
              <span>{isUrdu ? 'ملازمین کے اکاؤنٹس' : isRoman ? 'Staff Accounts (Users)' : 'All Users'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-surface-elevated text-muted border border-border">
                {users.length}
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            {isUrdu
              ? 'اکاؤنٹ میں نئے ملازمین شامل کریں، ٹیم اور رول تبدیل کریں اور پاس ورڈز سیٹ کریں۔'
              : isRoman
              ? 'Naye staff accounts shamil karein, roles/teams assign karein aur passwords manage karein.'
              : 'Add users to your account, assign roles and teams based on your organizational hierarchy.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-ink text-xs font-medium flex items-center gap-2 transition disabled:opacity-50 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-ink' : ''}`} />
            <span className="hidden sm:inline">{isUrdu ? 'ریفریش کریں' : isRoman ? 'Sync Karein' : 'Sync DB'}</span>
          </button>

          <button
            onClick={openCreateDrawer}
            className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-bold flex items-center gap-2 shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isUrdu ? 'نیا صارف شامل کریں' : isRoman ? 'Naya User Shamil Karein' : 'Add User'}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isUrdu
                ? 'نام، ای میل، ڈیپارٹمنٹ یا رول سے تلاش کریں...'
                : isRoman
                ? 'Naam, email, department ya role se dhoondein...'
                : 'Search users by name, email, department, or role...'
            }
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink shadow-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
          {[
            { id: 'all', label: isUrdu ? 'تمام صارفین' : isRoman ? 'Sab Users' : 'All Users', count: categoryCounts.all },
            { id: 'production', label: isUrdu ? 'پلانٹ فلور' : isRoman ? 'Plant Floor' : 'Plant Floor', count: categoryCounts.production },
            { id: 'design', label: isUrdu ? 'ڈیزائن ڈیسک' : isRoman ? 'Design Desk' : 'Design Desk', count: categoryCounts.design },
            { id: 'accounts', label: isUrdu ? 'اکاؤنٹس' : isRoman ? 'Accounts' : 'Accounts', count: categoryCounts.accounts },
            { id: 'coordination', label: isUrdu ? 'کوآرڈینیٹر' : isRoman ? 'Coordinator' : 'Coordinator', count: categoryCounts.coordination },
            { id: 'executive', label: isUrdu ? 'مالکان' : isRoman ? 'Owners' : 'Owners', count: categoryCounts.executive },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRole(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                filterRole === tab.id
                  ? 'bg-ink text-surface shadow-xs font-bold'
                  : 'bg-surface hover:bg-surface-elevated text-muted hover:text-ink border border-border'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  filterRole === tab.id
                    ? 'bg-surface/20 text-surface'
                    : 'bg-surface-elevated text-muted border border-border/50'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Users List (Matching Reference Image) */}
      <div className="border border-border rounded-2xl bg-surface overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-24 text-center text-muted text-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-ink" />
            <span className="font-medium">Loading users roster from Supabase...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-muted text-sm">
            No users found matching &quot;{searchTerm}&quot;
          </div>
        ) : (
          <>
            {/* ── MOBILE CARD LIST (shown below md: High density, thumb-friendly, no horizontal scroll) ── */}
            <div className="md:hidden divide-y divide-border">
              {filteredUsers.map((user) => {
                const theme = getRoleTheme(user.role);
                const isSelected =
                  activeDrawer && typeof activeDrawer === 'object' && activeDrawer.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => openEditDrawer(user)}
                    className={`p-3.5 space-y-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-surface-elevated border-l-4 border-l-ink'
                        : 'hover:bg-surface-elevated/40 active:bg-surface-elevated/60'
                    }`}
                  >
                    {/* Top Row: Avatar + Name/Title + Status + Manage */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${theme.avatarBg} font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs border border-white/20`}
                      >
                        {getInitials(user.full_name, user.email)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-ink text-sm truncate leading-tight">
                          {user.full_name || '— Unassigned —'}
                        </div>
                        <div className="text-[11px] text-muted truncate mt-0.5">
                          {user.title || user.department || theme.label}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            user.active
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-500 border border-rose-500/25'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{user.active ? 'Active' : 'Suspended'}</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openEditDrawer(user); }}
                          className="px-2.5 py-1 rounded-lg bg-ink text-surface text-[11px] font-bold shadow-2xs hover:opacity-90 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row: Role pill + Email with 1-tap copy */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${theme.badgeClass}`}>
                        {theme.label}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleCopyEmail(user.email, e)}
                        className="flex items-center gap-1 font-mono text-muted hover:text-ink transition max-w-[65%] truncate p-1 -m-1 rounded cursor-pointer"
                        title="Click to copy email"
                      >
                        <span className="truncate">{user.email}</span>
                        {copiedEmail === user.email ? (
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-60 hover:opacity-100 shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── DESKTOP TABLE (shown at md and above) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated/60 text-[11px] uppercase font-mono tracking-wider text-muted">
                    <th className="py-3.5 px-4 sm:px-6 font-bold">{isUrdu ? 'نام' : isRoman ? 'Naam' : 'Name'}</th>
                    <th className="py-3.5 px-4 font-bold">{isUrdu ? 'ای میل' : isRoman ? 'Email' : 'Email'}</th>
                    <th className="py-3.5 px-4 font-bold hidden lg:table-cell">{isUrdu ? 'شعبہ' : isRoman ? 'Department' : 'Department'}</th>
                    <th className="py-3.5 px-4 font-bold">{isUrdu ? 'عہدہ' : isRoman ? 'Role' : 'Role'}</th>
                    <th className="py-3.5 px-4 font-bold text-center">{isUrdu ? 'حیثیت' : isRoman ? 'Status' : 'Status'}</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-right">{isUrdu ? 'کارروائی' : isRoman ? 'Action' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => {
                    const theme = getRoleTheme(user.role);
                    const isSelected =
                      activeDrawer && typeof activeDrawer === 'object' && activeDrawer.id === user.id;

                    return (
                      <tr
                        key={user.id}
                        onClick={() => openEditDrawer(user)}
                        className={`cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'bg-surface-elevated border-l-4 border-l-ink'
                            : 'hover:bg-surface-elevated/40'
                        }`}
                      >
                        {/* Name + Avatar */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${theme.avatarBg} font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs border border-white/20`}
                            >
                              {getInitials(user.full_name, user.email)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-ink text-[13px] truncate">
                                {user.full_name || '— Unassigned —'}
                              </div>
                              <div className="text-[11px] text-muted font-medium truncate">
                                {user.title || theme.label}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 font-mono font-medium text-ink/90">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate max-w-[180px] lg:max-w-xs">{user.email}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyEmail(user.email, e)}
                              title="Copy email"
                              className="p-1 rounded text-muted hover:text-ink hover:bg-surface-elevated transition cursor-pointer"
                            >
                              {copiedEmail === user.email ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4 hidden lg:table-cell text-muted font-medium">
                          <span className="inline-flex items-center gap-1.5 text-ink/80">
                            <Building2 className="w-3 h-3 text-muted shrink-0" />
                            <span className="truncate max-w-[160px]">
                              {user.department || getRoleDefaultDept(user.role)}
                            </span>
                          </span>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${theme.badgeClass}`}>
                            {theme.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              user.active
                                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25'
                                : 'bg-rose-500/15 text-rose-500 border border-rose-500/25'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{user.active ? 'Active' : 'Off'}</span>
                          </span>
                        </td>

                        {/* Manage button */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); openEditDrawer(user); }}
                            className="px-3.5 py-1.5 rounded-xl bg-ink text-surface hover:opacity-90 text-xs font-bold inline-flex items-center gap-1.5 transition shadow-xs hover:scale-[1.02] cursor-pointer"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SLIDE-OVER DRAWER (Matches Zoho Creator Reference Image)             */}
      {/* Opens for both Add User and Edit User / Team Assignment / Password Reset   */}
      {/* Fully responsive on mobile (w-full) and desktop (max-w-xl)                */}
      {/* ========================================================================= */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          {/* Slide-over panel container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <div className="w-screen max-w-full sm:max-w-xl md:max-w-2xl bg-surface border-l border-border shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out">
              {/* Drawer Header */}
              <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-border bg-surface-elevated/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {typeof activeDrawer === 'object' ? (
                    <div
                      className={`w-10 h-10 rounded-full ${getRoleTheme(activeDrawer.role).avatarBg} font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs border border-white/20`}
                    >
                      {getInitials(activeDrawer.full_name, activeDrawer.email)}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0 shadow-xs">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-ink tracking-tight truncate">
                      {activeDrawer === 'create'
                        ? 'Add User'
                        : `Manage: ${activeDrawer.full_name || activeDrawer.email}`}
                    </h2>
                    <p className="text-xs text-muted font-mono truncate">
                      {activeDrawer === 'create'
                        ? 'Create a new login account & assign a role'
                        : activeDrawer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="p-2 rounded-xl text-muted hover:text-ink hover:bg-surface-elevated transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body (Scrollable) */}
              <form onSubmit={handleDrawerSubmit} id="drawer-form" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* 0. Quick Role Templates (Only shown when adding a new user) */}
                {activeDrawer === 'create' && (
                  <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                        <Sparkles className="w-3.5 h-3.5 text-ink" />
                        <span>Quick Role Template</span>
                      </div>
                      <span className="text-[10px] text-muted">Auto-configures role &amp; permissions</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {ROLES_LIST.map((r) => {
                        const isSelected = drawerRole === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => applyRoleTemplate(r.id)}
                            className={`px-2.5 py-2 rounded-xl text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold'
                                : 'bg-surface hover:bg-surface-elevated border border-border text-ink hover:border-ink/40'
                            }`}
                          >
                            <span className="truncate">{r.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 1. Name & Identity */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase font-bold text-muted tracking-wider">
                    Who is this person?
                  </div>

                  {/* Single Full Name field */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={drawerName}
                      onChange={(e) => setDrawerName(e.target.value)}
                      placeholder="e.g. Usman Naeem"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-ink shadow-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-ink">
                        {activeDrawer === 'create' ? 'Login Email' : 'Login Email'}
                      </label>
                      {activeDrawer === 'create' && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const prefix = drawerEmail.split('@')[0] || '';
                              setDrawerEmail(`${prefix}@thehrsports.com`);
                            }}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition cursor-pointer"
                          >
                            +@thehrsports.com
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      disabled={typeof activeDrawer === 'object'}
                      value={drawerEmail}
                      onChange={(e) => setDrawerEmail(e.target.value)}
                      placeholder="e.g. usman@gmail.com or usman@thehrsports.com"
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-border bg-surface text-ink disabled:bg-surface-elevated disabled:text-muted focus:outline-none focus:ring-2 focus:ring-ink shadow-xs"
                    />
                    {typeof activeDrawer === 'object' && (
                      <p className="text-[10px] text-muted mt-1 font-mono">
                        This is the email they use to log in. It cannot be changed.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Job Title</label>
                    <input
                      type="text"
                      value={drawerTitle}
                      onChange={(e) => setDrawerTitle(e.target.value)}
                      placeholder="e.g. Designer"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-ink shadow-xs"
                    />
                  </div>
                </div>

                {/* HIDDEN FOR NOW — RESERVED: Department & Team Assignment
                    State (drawerDepartment), functions (handleDepartmentChange, applyRolePreset)
                    and lists (TEAMS_LIST, ROLES_LIST) are all still active in the code above.
                    Uncomment this block when team assignment UI is needed.

                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="text-[11px] font-mono uppercase font-bold text-muted tracking-wider">
                    Department & Team
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Team / Department</label>
                    <select value={drawerDepartment} onChange={(e) => handleDepartmentChange(e.target.value)} ...>
                      {TEAMS_LIST.map(...)}
                    </select>
                  </div>
                </div>
                */}

                {/* 2. Job Role */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="text-[11px] font-mono uppercase font-bold text-muted tracking-wider">
                    What do they do?
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Job Role</label>
                    <select
                      value={drawerRole}
                      onChange={(e) => {
                        const newR = e.target.value;
                        setDrawerRole(newR);
                        applyRolePreset(newR);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-ink shadow-xs cursor-pointer"
                    >
                      {ROLES_LIST.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Permissions */}
                  <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                        <ShieldCheck className="w-4 h-4 text-ink" />
                        <span>What they can do ({drawerPermissions.length} items on)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowGranularPermissions(!showGranularPermissions)}
                        className="px-2.5 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black text-[11px] font-bold hover:opacity-90 transition cursor-pointer shadow-2xs"
                      >
                        {showGranularPermissions ? 'Hide list' : 'Change access'}
                      </button>
                    </div>

                    {showGranularPermissions && (
                      <div className="pt-2 border-t border-border space-y-2 max-h-80 overflow-y-auto pr-1">
                        <div className="flex items-center justify-between pb-1 px-1">
                          <span className="text-[10px] text-muted">Click any item to toggle:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDrawerPermissions(ALL_PERMISSIONS.map((p) => p.id))}
                              className="px-2 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold hover:opacity-90 transition cursor-pointer"
                            >
                              Select All
                            </button>
                            <span className="text-muted text-[10px]">•</span>
                            <button
                              type="button"
                              onClick={() => setDrawerPermissions([])}
                              className="px-2 py-0.5 rounded border border-border bg-surface text-ink hover:bg-surface-elevated text-[10px] font-bold transition cursor-pointer"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {ALL_PERMISSIONS.map((p) => {
                            const isChecked = drawerPermissions.includes(p.id);
                            return (
                              <label
                                key={p.id}
                                className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                                  isChecked
                                    ? 'bg-zinc-100 border-zinc-900 text-ink dark:bg-zinc-900 dark:border-zinc-100 shadow-2xs'
                                    : 'bg-surface hover:bg-surface-elevated border-border text-muted hover:border-ink/30'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(p.id)}
                                  className="mt-1 rounded border-border text-ink focus:ring-ink shrink-0 cursor-pointer accent-black dark:accent-white"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-[12px] text-ink">{p.label}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-surface-elevated border border-border text-muted shrink-0">
                                      {p.group}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted mt-0.5 leading-snug">
                                    {p.desc}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Password */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono uppercase font-bold text-muted tracking-wider">
                      {activeDrawer === 'create' ? 'Starting Password' : 'Change Password'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const base = drawerName.trim().split(/\s+/)[0] || 'Staff';
                        const clean = base.replace(/[^a-zA-Z]/g, '');
                        const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
                        const rand = Math.floor(100 + Math.random() * 900);
                        setDrawerNewPassword(`HRSports@${capitalized}${rand}!`);
                        setCopiedDrawerPassword(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-90 transition shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generate one</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showDrawerPassword ? 'text' : 'password'}
                      required={activeDrawer === 'create'}
                      value={drawerNewPassword}
                      onChange={(e) => {
                        setDrawerNewPassword(e.target.value);
                        setCopiedDrawerPassword(false);
                        if (drawerPasswordError) setDrawerPasswordError(null);
                      }}
                      placeholder={
                        activeDrawer === 'create'
                          ? 'Enter any password'
                          : 'Leave blank to keep the current password'
                      }
                      className={`w-full pl-3.5 pr-20 py-2.5 text-xs font-mono font-bold rounded-xl border bg-surface text-ink focus:outline-none focus:ring-2 shadow-xs ${
                        drawerPasswordError
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-border focus:ring-ink'
                      }`}
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {drawerNewPassword && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(drawerNewPassword);
                            setCopiedDrawerPassword(true);
                            setTimeout(() => setCopiedDrawerPassword(false), 2000);
                          }}
                          title="Copy password"
                          className="p-1 rounded-md text-muted hover:text-ink hover:bg-surface-elevated transition cursor-pointer"
                        >
                          {copiedDrawerPassword ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowDrawerPassword(!showDrawerPassword)}
                        className="p-1 rounded-md text-muted hover:text-ink hover:bg-surface-elevated transition cursor-pointer"
                      >
                        {showDrawerPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Inline Password Error Message right below the password input in the drawer */}
                  {drawerPasswordError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold text-[12px]">Password Error</div>
                        <div className="text-[11px] opacity-90 leading-relaxed mt-0.5">{drawerPasswordError}</div>
                      </div>
                    </div>
                  )}

                  {copiedDrawerPassword && (
                    <p className="text-[11px] text-emerald-500 font-medium">
                      ✓ Password copied to clipboard!
                    </p>
                  )}

                  {/* Warning when changing password of existing user */}
                  {typeof activeDrawer === 'object' && drawerNewPassword.trim().length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-ink space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Heads up</span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        If this person is logged in right now, they will be signed out automatically on all devices as soon as you save.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Active Status Toggle (For existing users only) */}
                {typeof activeDrawer === 'object' && (
                  <div className="pt-3 border-t border-border flex items-center justify-between p-3.5 rounded-xl bg-surface-elevated/40 border">
                    <div>
                      <div className="text-xs font-bold text-ink">Can they log in?</div>
                      <div className="text-[11px] text-muted">
                        {drawerActive
                          ? 'Yes — this person can sign in normally.'
                          : 'No — their account is suspended and they cannot log in.'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDrawerActive(!drawerActive)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        drawerActive
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-rose-500 text-white shadow-xs'
                      }`}
                    >
                      {drawerActive ? 'ACTIVE' : 'SUSPENDED'}
                    </button>
                  </div>
                )}

                {/* 5. Remove User (Edit mode only) */}
                {typeof activeDrawer === 'object' && (
                  <div className="pt-3 border-t border-border">
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-500/40 text-rose-500 text-xs font-bold hover:bg-rose-500/10 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <UserX className="w-4 h-4" />
                        Remove this user
                      </button>
                    ) : (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                        <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          Are you sure? This cannot be undone.
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed">
                          This will permanently delete <strong>{(activeDrawer as StaffUser).email}</strong> from the system. They won&apos;t be able to log in anymore.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            disabled={isDeleting}
                            className="flex-1 px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted hover:text-ink hover:bg-surface-elevated transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className="flex-1 px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {isDeleting && <RefreshCw className="w-3 h-3 animate-spin" />}
                            Yes, remove them
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Drawer Sticky Footer */}
              <div className="p-3.5 sm:px-6 sm:py-4 border-t border-border bg-surface-elevated/80 backdrop-blur-xs flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={closeDrawer}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:text-ink hover:bg-surface-elevated transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="drawer-form"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{activeDrawer === 'create' ? 'Add User' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE FLOATING ACTION BUTTON (FAB: + Add User) ── */}
      <button
        type="button"
        onClick={openCreateDrawer}
        className="md:hidden fixed bottom-6 right-5 z-30 px-4 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-2xl flex items-center gap-2 border border-border/40 hover:scale-105 active:scale-95 transition cursor-pointer"
        aria-label="Add User"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add User</span>
      </button>
    </div>
  );
}
