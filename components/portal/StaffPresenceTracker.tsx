'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface StaffPresenceTrackerProps {
  userId?: string;
  userRole?: string;
}

export const StaffPresenceTracker: React.FC<StaffPresenceTrackerProps> = ({
  userId,
  userRole,
}) => {
  const router = useRouter();
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    if (!userId) return;

    // 1. Enforce browser session policy:
    // If user closed the browser, sessionStorage is cleared.
    // If there is no active session flag in sessionStorage, sign out and require login again.
    const sessionActive = sessionStorage.getItem('hr_browser_session_active');
    if (!sessionActive) {
      // First time in this browser run: mark active
      sessionStorage.setItem('hr_browser_session_active', 'true');
    }

    // Get or initialize unique session ID for this browser tab/window
    let currentSessionId = sessionStorage.getItem('hr_presence_session_id');
    if (!currentSessionId) {
      currentSessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('hr_presence_session_id', currentSessionId);
    }
    sessionIdRef.current = currentSessionId;

    // 2. Report Login/Session Start to server
    const reportLogin = async () => {
      try {
        await fetch('/api/presence/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: currentSessionId,
            device_info: `${navigator.platform || 'Device'} • ${navigator.userAgent.slice(0, 100)}`,
          }),
        });
      } catch (e) {
        // ignore network error
      }
    };

    reportLogin();

    // 3. Heartbeat loop (every 30 seconds)
    const heartbeatInterval = setInterval(async () => {
      try {
        await fetch('/api/presence/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: currentSessionId }),
        });
      } catch (e) {
        // ignore
      }
    }, 30000);

    // 4. On browser/tab close or refresh, send Beacon logout
    const handleUnload = () => {
      if (sessionIdRef.current) {
        const payload = JSON.stringify({ session_id: sessionIdRef.current });
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/presence/logout', payload);
        } else {
          fetch('/api/presence/logout', {
            method: 'POST',
            body: payload,
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      handleUnload();
    };
  }, [userId, userRole, router]);

  return null;
};
