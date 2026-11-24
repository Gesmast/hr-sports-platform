'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Clock,
  Building,
  CheckCircle2,
  Calendar,
  Laptop,
  AlertCircle,
  RefreshCw,
  Palette,
  ShieldCheck,
  Factory
} from 'lucide-react';

interface StaffItem {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  title: string;
  is_online: boolean;
  last_seen_at: string;
  first_login_today: string | null;
  last_logout_today: string | null;
  sessions_today: number;
  minutes_online_today: number;
}

interface LogItem {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
  department: string;
  login_at: string;
  logout_at: string | null;
  last_heartbeat_at: string;
  is_online: boolean;
  duration_minutes: number;
  device_info: string;
  ip_address: string;
}

interface StaffAttendanceClientProps {
  initialDate: string;
  initialData: {
    date: string;
    staff: StaffItem[];
    logs: LogItem[];
  };
  ownerName: string;
}

export const StaffAttendanceClient: React.FC<StaffAttendanceClientProps> = ({
  initialDate,
  initialData,
  ownerName,
}) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute factory working hours in PKT (UTC+5)
  const getFactoryStatus = () => {
    const now = new Date();
    const pktStr = now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
    const pktDate = new Date(pktStr);
    const day = pktDate.getDay();
    const totalMinutes = pktDate.getHours() * 60 + pktDate.getMinutes();
    const isOpen = day >= 1 && day <= 6 && totalMinutes >= 9 * 60 && totalMinutes < 20 * 60;
    return {
      isOpen,
      timeStr: pktDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const factory = getFactoryStatus();

  // Polling refresh every 20 seconds
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/presence/status`);
      router.refresh();
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    }, 20000);
    return () => clearInterval(timer);
  }, [router]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    router.push(`/portal/staff-attendance?date=${newDate}`);
  };

  const formatLocalTime = (isoStr: string | null) => {
    if (!mounted || !isoStr) return '—';
    try {
      return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  const onlineStaff = data.staff.filter((s) => s.is_online);
  const staffLoggedInToday = data.staff.filter((s) => s.sessions_today > 0);

  return (
    <div className="space-y-4 text-black pb-12">
      {/* ── 1. Top Executive Banner ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-black text-white">
              <Factory className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-zinc-500">
              Factory Command & Attendance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
            Staff & Attendance Roster
          </h1>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">
            Real-time presence tracking, session duration, and automated clock-in/out logs for HR Sports OEM team.
          </p>
        </div>

        {/* Factory Operating Schedule Pill */}
        <div className="flex items-center gap-3 bg-zinc-50 border border-gray-200 p-3 rounded-xl shrink-0">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${factory.isOpen ? 'bg-emerald-500 animate-ping' : 'bg-zinc-400'}`} />
            <div className={`w-3 h-3 rounded-full ${factory.isOpen ? 'bg-emerald-500' : 'bg-zinc-400'} absolute inset-0`} />
          </div>
          <div>
            <div className="text-xs font-bold text-black flex items-center gap-1.5">
              <span>{factory.isOpen ? 'Factory Floor Active' : 'Factory Floor Closed'}</span>
              <span className="text-[10px] font-mono text-zinc-500">({factory.timeStr} PKT)</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              Schedule: Mon – Sat • 9:00 AM – 8:00 PM
            </div>
          </div>
          <button
            type="button"
            onClick={refreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-zinc-100 text-zinc-700 hover:text-black transition cursor-pointer ml-1"
            title="Refresh Presence"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── 2. KPI Summary Tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <div className="bg-white rounded-2xl py-3 px-4 shadow-xs border border-gray-200/90">
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-600">
              Online Right Now
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-black tracking-tight">
            {onlineStaff.length}
          </div>
          <span className="text-[11px] text-emerald-800 font-mono mt-0.5 block font-bold">
            {onlineStaff.length > 0
              ? onlineStaff.map((s) => s.full_name).join(', ')
              : 'No staff currently active'}
          </span>
        </div>

        <div className="bg-white rounded-2xl py-3 px-4 shadow-xs border border-gray-200/90">
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-600">
              Logged In Today
            </span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-black text-black tracking-tight">
            {staffLoggedInToday.length} <span className="text-xs text-zinc-400 font-normal">/ {data.staff.length}</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">
            {(data.staff.length > 0 ? (staffLoggedInToday.length / data.staff.length * 100).toFixed(0) : 0)}% staff turnout
          </span>
        </div>

        <div className="bg-white rounded-2xl py-3 px-4 shadow-xs border border-gray-200/90">
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-600">
              Active Designers
            </span>
            <Palette className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-black text-black tracking-tight">
            {data.staff.filter((s) => s.role === 'usman' && s.is_online).length}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">
            CAD Pattern & Design Desk
          </span>
        </div>

        <div className="bg-white rounded-2xl py-3 px-4 shadow-xs border border-gray-200/90">
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-600">
              Accounts & Quotation Desk
            </span>
            <Building className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-black text-black tracking-tight">
            {data.staff.filter((s) => s.role === 'umair' && s.is_online).length > 0 ? 'Online' : 'Offline'}
          </div>
          <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">
            Muhammad Umair (Commercials)
          </span>
        </div>
      </div>

      {/* ── 3. Staff Live Presence Grid ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200/90">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-black" />
            <h2 className="text-sm sm:text-base font-black text-black tracking-tight">
              Factory Staff Roster & Realtime State
            </h2>
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Auto-syncs on login & tab close
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {data.staff.map((staff) => {
            const isDesigner = staff.role === 'usman';
            const isAccounts = staff.role === 'umair';

            return (
              <div
                key={staff.id}
                className={`p-3.5 rounded-2xl border transition ${
                  staff.is_online
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                    : 'bg-zinc-50/70 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                        {staff.full_name[0]}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          staff.is_online ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-black leading-tight">
                        {staff.full_name}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {staff.title || staff.department}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                      staff.is_online
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-zinc-200/80 text-zinc-700 border-gray-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        staff.is_online ? 'bg-emerald-600 animate-pulse' : 'bg-zinc-500'
                      }`}
                    />
                    {staff.is_online ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 text-[11px] font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[9.5px]">FIRST LOGIN</span>
                    <span className="font-bold text-black">
                      {formatLocalTime(staff.first_login_today)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9.5px]">LAST LOGOUT / SEEN</span>
                    <span className="font-bold text-black">
                      {staff.is_online ? 'Active now' : formatLocalTime(staff.last_logout_today || staff.last_seen_at)}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 flex items-center justify-between border-t border-gray-200/40 text-[10px]">
                    <span className="text-zinc-600">
                      Total Time Today: <b className="text-black font-mono">{Math.floor(staff.minutes_online_today / 60)}h {staff.minutes_online_today % 60}m</b>
                    </span>
                    <span className="text-zinc-500">
                      {staff.sessions_today} session{staff.sessions_today === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Detailed Session Attendance Logs Table ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-gray-100 gap-3 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-black text-black tracking-tight">
              Session Attendance Audit Log
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
              Historical record of every time a team member opened or closed their portal session.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-zinc-50 border border-gray-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl text-black focus:outline-hidden focus:border-black"
            />
          </div>
        </div>

        {data.logs.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-zinc-500 bg-zinc-50 rounded-xl border border-gray-100">
            No attendance sessions recorded for {selectedDate}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-zinc-500 font-mono text-[10.5px] uppercase">
                  <th className="pb-2.5 font-bold">Staff Member</th>
                  <th className="pb-2.5 font-bold">Department</th>
                  <th className="pb-2.5 font-bold">Login Time</th>
                  <th className="pb-2.5 font-bold">Logout Time</th>
                  <th className="pb-2.5 font-bold">Duration</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold">Device / Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {data.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/80 transition">
                    <td className="py-2.5 font-sans font-bold text-black">
                      {log.user_name}
                    </td>
                    <td className="py-2.5 text-zinc-600 text-[11px]">
                      {log.department}
                    </td>
                    <td className="py-2.5 font-bold text-black">
                      {formatLocalTime(log.login_at)}
                    </td>
                    <td className="py-2.5 text-zinc-600">
                      {log.is_online ? 'Active session' : formatLocalTime(log.logout_at)}
                    </td>
                    <td className="py-2.5 font-bold text-black">
                      {log.duration_minutes} min{log.duration_minutes === 1 ? '' : 's'}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[9.5px] px-1.5 py-0.5 rounded font-bold ${
                          log.is_online
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-zinc-100 text-zinc-600 border border-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${log.is_online ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                        {log.is_online ? 'LIVE' : 'ENDED'}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-400 text-[10px] max-w-[180px] truncate" title={log.device_info}>
                      {log.device_info || 'Browser'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
