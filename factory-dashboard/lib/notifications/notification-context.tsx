'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRole } from '@/lib/auth/role-context';
import { createClient } from '@/lib/supabase/client';
import { playNotificationChime } from './sound';

export interface NotificationItem {
  id: string;
  target_role?: string | null;
  target_user_id?: string | null;
  event_type: string;
  title: string;
  message: string;
  customer_name?: string | null;
  company_name?: string | null;
  request_no?: string | null;
  job_no?: number | null;
  inquiry_id?: string | null;
  job_id?: string | null;
  stage?: string | null;
  is_urgent?: boolean;
  created_at: string;
  read_at?: string | null;
  read: boolean;
}

export interface ToastItem {
  id: string;
  notification: NotificationItem;
  createdAt: number;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  activeToasts: ToastItem[];
  showMissedModal: boolean;
  missedNotifications: NotificationItem[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  batchMarkAsRead: (ids: string[]) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  batchDelete: (ids: string[]) => Promise<void>;
  clearNotifications: (action: 'delete_read' | 'delete_all') => Promise<void>;
  dismissToast: (id: string) => void;
  openMissedModal: () => void;
  closeMissedModal: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, currentRole, isAuthenticated } = useRole();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeToasts, setActiveToasts] = useState<ToastItem[]>([]);
  const [showMissedModal, setShowMissedModal] = useState<boolean>(false);
  const [missedNotifications, setMissedNotifications] = useState<NotificationItem[]>([]);

  const initialCheckDoneRef = useRef<boolean>(false);
  const knownIdsRef = useRef<Set<string>>(new Set());

  const triggerToast = useCallback((item: NotificationItem) => {
    const toastId = `toast_${item.id}_${Date.now()}`;
    setActiveToasts((prev) => {
      // Avoid duplicate toasts for the same notification id
      if (prev.some((t) => t.notification.id === item.id)) return prev;
      return [...prev, { id: toastId, notification: item, createdAt: Date.now() }];
    });

    playNotificationChime();

    // Persist on screen until user dismisses via (X) or clicks to open
  }, []);

  // Fetch notifications from API
  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const url = `/api/data/notifications?role=${encodeURIComponent(currentRole)}&userId=${encodeURIComponent(currentUser.id)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        const items: NotificationItem[] = data.notifications;

        // If this is the initial load, register known IDs and display unread alerts
        if (!initialCheckDoneRef.current) {
          items.forEach((n) => knownIdsRef.current.add(String(n.id)));
          initialCheckDoneRef.current = true;

          const unread = items.filter((n) => !n.read);
          if (unread.length > 0) {
            setMissedNotifications(unread);
            setShowMissedModal(true);
            // Also pop a slider toast for the most recent unread alert
            triggerToast(unread[0]);
          }
        } else {
          // Detect brand new notifications arriving via polling
          items.forEach((n) => {
            const strId = String(n.id);
            if (!knownIdsRef.current.has(strId)) {
              knownIdsRef.current.add(strId);
              if (!n.read) {
                // Trigger slider notification
                triggerToast(n);
                // Also open modal popup for owner / urgent notifications
                setMissedNotifications((prev) => [n, ...prev.filter((p) => p.id !== n.id)]);
                setShowMissedModal(true);
              }
            }
          });
        }

        setNotifications(items);
        const unread = items.filter((n) => !n.read);
        setUnreadCount(unread.length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentRole, currentUser.id, triggerToast]);

  // Initial load
  useEffect(() => {
    initialCheckDoneRef.current = false;
    knownIdsRef.current = new Set();
    refreshNotifications();
  }, [refreshNotifications]);

  // Fast 3-second polling fallback so toast is 100% guaranteed even without WebSocket
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      refreshNotifications();
    }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refreshNotifications]);

  // Supabase Realtime Subscription for live instant notifications (<100ms)
  useEffect(() => {
    if (!isAuthenticated) return;

    let supabase: any;
    try {
      supabase = createClient();
    } catch (err) {
      console.error('Failed to create Supabase client for realtime notifications:', err);
      return;
    }

    const channel = supabase
      .channel(`realtime_notifications_${currentRole}_${currentUser.id}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload: { new: any }) => {
          const newNotif = payload.new;
          if (!newNotif) return;

          const matchesRole = !newNotif.target_role || newNotif.target_role === currentRole;
          const matchesUser = !newNotif.target_user_id || newNotif.target_user_id === currentUser.id;
          const isOwner = currentRole === 'owner';

          if (isOwner || (matchesRole && matchesUser)) {
            const strId = String(newNotif.id);
            const item: NotificationItem = {
              id: strId,
              target_role: newNotif.target_role,
              target_user_id: newNotif.target_user_id,
              event_type: newNotif.event_type || 'update',
              title: newNotif.title || 'Operational Notification',
              message: newNotif.message || '',
              customer_name: newNotif.customer_name,
              company_name: newNotif.company_name,
              request_no: newNotif.request_no,
              job_no: newNotif.job_no,
              inquiry_id: newNotif.inquiry_id,
              job_id: newNotif.job_id,
              stage: newNotif.stage,
              is_urgent: Boolean(newNotif.is_urgent),
              created_at: newNotif.created_at || new Date().toISOString(),
              read_at: null,
              read: false,
            };

            knownIdsRef.current.add(strId);
            setNotifications((prev) => [item, ...prev.filter((p) => p.id !== strId)]);
            setUnreadCount((prev) => prev + 1);

            // Trigger slider toast notification
            triggerToast(item);

            // Also open modal popup for owner / urgent notifications
            setMissedNotifications((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
            setShowMissedModal(true);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Supabase Realtime] Connected to notifications channel');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, currentRole, currentUser.id, triggerToast]);

  const dismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const closeMissedModal = () => {
    setShowMissedModal(false);
  };

  const openMissedModal = () => {
    const unread = notifications.filter((n) => !n.read);
    setMissedNotifications(unread.length > 0 ? unread : notifications.slice(0, 8));
    setShowMissedModal(true);
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch('/api/data/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', id }),
      });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() }))
    );
    setUnreadCount(0);
    setShowMissedModal(false);

    try {
      await fetch('/api/data/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_all_read',
          role: currentRole,
          userId: currentUser.id,
        }),
      });
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    // Optimistic local state update
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setActiveToasts((prev) => prev.filter((t) => t.notification.id !== id));
    knownIdsRef.current.delete(id);

    try {
      await fetch(`/api/data/notifications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const batchMarkAsRead = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setNotifications((prev) =>
      prev.map((n) => (idSet.has(n.id) ? { ...n, read: true, read_at: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => {
      const readDelta = notifications.filter((n) => idSet.has(n.id) && !n.read).length;
      return Math.max(0, prev - readDelta);
    });

    try {
      await fetch('/api/data/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'batch_mark_read', ids }),
      });
    } catch (err) {
      console.error('Failed to batch mark notifications as read:', err);
    }
  };

  const batchDelete = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setNotifications((prev) => prev.filter((n) => !idSet.has(n.id)));
    setUnreadCount((prev) => {
      const deletedUnread = notifications.filter((n) => idSet.has(n.id) && !n.read).length;
      return Math.max(0, prev - deletedUnread);
    });
    setActiveToasts((prev) => prev.filter((t) => !idSet.has(t.notification.id)));
    ids.forEach((id) => knownIdsRef.current.delete(id));

    try {
      await fetch('/api/data/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
    } catch (err) {
      console.error('Failed to batch delete notifications:', err);
    }
  };

  const clearNotifications = async (action: 'delete_read' | 'delete_all') => {
    if (action === 'delete_read') {
      setNotifications((prev) => prev.filter((n) => !n.read));
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setActiveToasts([]);
      knownIdsRef.current.clear();
      setShowMissedModal(false);
    }

    try {
      await fetch(
        `/api/data/notifications?action=${action}&role=${encodeURIComponent(currentRole)}&userId=${encodeURIComponent(currentUser.id)}`,
        { method: 'DELETE' }
      );
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        activeToasts,
        showMissedModal,
        missedNotifications,
        markAsRead,
        markAllAsRead,
        batchMarkAsRead,
        deleteNotification,
        batchDelete,
        clearNotifications,
        dismissToast,
        openMissedModal,
        closeMissedModal,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
