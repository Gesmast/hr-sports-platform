'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  RefreshCw,
  Building2,
  ShieldCheck,
  Timer,
} from 'lucide-react';

interface AttendanceSession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  date: string; // YYYY-MM-DD
  loginTime: string;
  loginTimestamp: string;
  logoutTime: string | null;
  logoutTimestamp: string | null;
  durationMinutes: number | null;
  status: 'active' | 'completed';
}

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_UR = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
const WEEKDAYS_ROMAN = ['Itwar', 'Peer', 'Mangal', 'Budh', 'Jumerat', 'Jummah', 'Hafta'];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_UR = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
];
const MONTHS_ROMAN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function OwnerAttendanceCalendarPage() {
  const { t, isUrdu, isRoman } = useI18n();

  // Sessions state
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Calendar view state: Year & Month (0-indexed)
  // Default to October 2026 (matching system date & seeded data)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 9 = October
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-21');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Fetch sessions from /api/attendance
  const fetchSessions = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        setSessions(data.sessions);

        // If today or latest date has sessions, select it
        if (!selectedDate && data.sessions.length > 0) {
          setSelectedDate(data.sessions[0].date);
          const [y, m] = data.sessions[0].date.split('-').map(Number);
          setCurrentYear(y);
          setCurrentMonth(m - 1);
        }
      }
    } catch (err) {
      console.error('Failed to fetch attendance sessions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => fetchSessions(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Map role key to display title
  const getRoleTitle = (roleKey: string) => {
    const rolesMap: Record<string, { en: string; ur: string; roman: string }> = {
      owner: { en: 'Owner / Executive', ur: 'مالک / انتظامیہ', roman: 'Owner / Big Boss' },
      hamza: { en: 'Operations Coordinator', ur: 'آپریشنز کوآرڈینیٹر', roman: 'Operations Coordinator' },
      usman: { en: 'CAD & Design Lead', ur: 'ڈیزائن و آرڈر ڈیسک', roman: 'CAD & Design Lead' },
      mubasher: { en: 'Production Lead', ur: 'پروڈکشن انچارج', roman: 'Production In-Charge' },
      ashfaq: { en: 'Quality Inspector (QC)', ur: 'کوالٹی انسپکٹر', roman: 'Quality Inspector (QC)' },
      umair: { en: 'Commercial & Accounts', ur: 'اکاؤنٹس و کمرشل', roman: 'Accounts & Commercial' },
      aamir: { en: 'Store & Inventory Master', ur: 'اسٹور و انوینٹری', roman: 'Store & Stock Master' },
      shahzaib: { en: 'Graphic Artist', ur: 'گرافک آرٹسٹ', roman: 'Graphic Artist' },
      faizan: { en: 'Junior Pattern Maker', ur: 'پیٹرن میکر', roman: 'Pattern Maker' },
    };
    const r = rolesMap[roleKey.toLowerCase()];
    if (!r) return roleKey;
    return isUrdu ? r.ur : isRoman ? r.roman : r.en;
  };

  // Group sessions by date string YYYY-MM-DD
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, AttendanceSession[]>();
    sessions.forEach((s) => {
      const list = map.get(s.date) || [];
      list.push(s);
      map.set(s.date, list);
    });
    return map;
  }, [sessions]);

  // Calendar calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Prev month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        sessions: sessionsByDate.get(dateStr) || [],
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true,
        sessions: sessionsByDate.get(dateStr) || [],
      });
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
      days.push({
        dayNum: j,
        dateStr,
        isCurrentMonth: false,
        sessions: sessionsByDate.get(dateStr) || [],
      });
    }

    return days;
  }, [currentYear, currentMonth, sessionsByDate]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToToday = () => {
    const today = new Date();
    const yr = today.getFullYear();
    const mo = today.getMonth();
    const dt = today.toISOString().slice(0, 10);
    setCurrentYear(yr);
    setCurrentMonth(mo);
    setSelectedDate(dt);
  };

  // Sessions for the currently selected date
  const selectedDaySessions = useMemo(() => {
    return sessionsByDate.get(selectedDate) || [];
  }, [sessionsByDate, selectedDate]);

  // Filtered sessions for selected date
  const filteredSessions = useMemo(() => {
    return selectedDaySessions.filter((s) => {
      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = s.userName.toLowerCase().includes(q);
        const matchesRole = s.role.toLowerCase().includes(q);
        const matchesEmail = s.email.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesEmail) return false;
      }
      return true;
    });
  }, [selectedDaySessions, statusFilter, searchTerm]);

  // Metrics for selected day
  const activeCount = selectedDaySessions.filter((s) => s.status === 'active').length;
  const completedCount = selectedDaySessions.filter((s) => s.status === 'completed').length;
  const totalCount = selectedDaySessions.length;

  // Calculate earliest check-in time on selected day
  const earliestCheckIn = useMemo(() => {
    if (selectedDaySessions.length === 0) return null;
    const sorted = [...selectedDaySessions].sort((a, b) =>
      new Date(a.loginTimestamp).getTime() - new Date(b.loginTimestamp).getTime()
    );
    return sorted[0];
  }, [selectedDaySessions]);

  // Export CSV
  const handleExportCSV = () => {
    if (selectedDaySessions.length === 0) {
      alert(
        isUrdu
          ? 'اس تاریخ کا کوئی ریکارڈ موجود نہیں ہے'
          : isRoman
          ? 'Is tareekh ka koyi record nahi mila.'
          : 'No records found for selected date.'
      );
      return;
    }

    const headers = ['Employee Name', 'Role', 'Email', 'Date', 'Clock In', 'Clock Out', 'Duration (Mins)', 'Status'];
    const rows = selectedDaySessions.map((s) => [
      `"${s.userName}"`,
      `"${s.role}"`,
      `"${s.email}"`,
      `"${s.date}"`,
      `"${s.loginTime}"`,
      `"${s.logoutTime || 'Active'}"`,
      `"${s.durationMinutes || '-'}"`,
      `"${s.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 antialiased">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-muted mb-1 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isUrdu
                ? 'مالک کا ایگزیکٹو مانیٹرنگ ڈیسک'
                : isRoman
                ? 'Executive Monitoring Desk • Factory Portal'
                : 'Executive Management • Factory Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {isUrdu
              ? 'ملازمین کی یومیہ حاضری اور شفٹ کیلنڈر'
              : isRoman
              ? 'Staff Attendance aur Shift Calendar'
              : 'Staff Attendance & Shift Calendar'}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-3xl leading-relaxed">
            {isUrdu
              ? 'ملازمین کے لاگ ان اور لاگ آؤٹ کی خودکار ٹائمنگز، فعال ڈیوٹی گھنٹے، اور کیلنڈر ویو۔'
              : isRoman
              ? 'Staff sign-in aur sign-out events ka automated record, duty hours aur monthly calendar.'
              : 'Automated attendance calculated strictly from user sign-in & sign-out events. Browse shifts by day across the monthly calendar.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchSessions(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-mono font-bold text-ink transition shadow-2xs cursor-pointer"
            title="Refresh Attendance Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{isUrdu ? 'تازہ کریں' : isRoman ? 'Sync Karo' : 'Sync Logs'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-mono font-bold text-ink transition shadow-2xs cursor-pointer"
            title="Export Day Roster to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ایکسپورٹ CSV' : isRoman ? 'CSV Download Karo' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Monthly Calendar (Left) + Selected Day Roster (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Monthly Calendar Card (5 Columns on Large) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-4">
          
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted font-bold block">
                {isUrdu ? 'مہینہ و سال' : isRoman ? 'MAHEENAY KA RECORD' : 'MONTHLY OVERVIEW'}
              </span>
              <h2 className="text-lg font-extrabold text-ink tracking-tight mt-0.5">
                {isUrdu ? MONTHS_UR[currentMonth] : isRoman ? MONTHS_ROMAN[currentMonth] : MONTHS_EN[currentMonth]} {currentYear}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-ink transition cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleGoToToday}
                className="px-2 py-1 rounded-lg border border-border bg-surface-elevated hover:bg-border text-[11px] font-mono font-bold text-ink transition cursor-pointer"
              >
                {isUrdu ? 'آج' : isRoman ? 'Aaj' : 'Today'}
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-ink transition cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-muted uppercase">
            {(isUrdu ? WEEKDAYS_UR : isRoman ? WEEKDAYS_ROMAN : WEEKDAYS_EN).map((dayName, idx) => (
              <div key={idx} className="py-1">
                {dayName}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              const isSelected = cell.dateStr === selectedDate;
              const hasLogs = cell.sessions.length > 0;
              const hasActiveShifts = cell.sessions.some((s) => s.status === 'active');

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[64px] p-1.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer relative group ${
                    isSelected
                      ? 'bg-ink text-surface border-ink shadow-sm ring-2 ring-ink/20'
                      : cell.isCurrentMonth
                      ? hasLogs
                        ? 'bg-surface border-border hover:border-ink/50 text-ink'
                        : 'bg-surface/50 border-border/70 hover:border-border text-ink'
                      : 'bg-surface-elevated/40 border-transparent text-muted/40 cursor-default'
                  }`}
                >
                  {/* Day Number + Active Status Dot */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isSelected
                          ? 'text-surface'
                          : cell.isCurrentMonth
                          ? 'text-ink'
                          : 'text-muted/40'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {hasActiveShifts && (
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"
                        title="Active shift underway"
                      />
                    )}
                  </div>

                  {/* Attendance Count Badge */}
                  {hasLogs ? (
                    <div className="mt-1">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold truncate max-w-full ${
                          isSelected
                            ? 'bg-surface/20 text-surface'
                            : 'bg-surface-elevated border border-border text-ink'
                        }`}
                      >
                        {cell.sessions.length} {isUrdu ? 'حاضر' : isRoman ? 'Staff' : 'Staff'}
                      </span>
                    </div>
                  ) : (
                    <div className="h-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Footnote Legend */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isUrdu ? 'لائیو شفٹ جاری ہے' : isRoman ? 'Live shift chal rahi hai' : 'Live shift on floor'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block px-1.5 py-0.2 rounded bg-surface-elevated border border-border text-ink font-bold">
                N
              </span>
              <span>{isUrdu ? 'حاضری کی تعداد' : isRoman ? 'Hazir Staff' : 'Present Staff'}</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Day Detailed Staff Attendance Roster (7 Columns on Large) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Day Summary Banner */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted font-bold block">
                  {isUrdu ? 'منتخب شدہ تاریخ کا ریکارڈ' : isRoman ? 'SELECTED TAREEEH KI SHEET' : 'SELECTED DATE TIMESHEET'}
                </span>
                <h2 className="text-xl font-extrabold text-ink tracking-tight flex items-center gap-2 mt-0.5">
                  <CalendarIcon className="w-5 h-5 text-muted" />
                  <span>{selectedDate}</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-surface-elevated border border-border text-ink">
                  <Users className="w-3.5 h-3.5 text-muted" />
                  <span>
                    {totalCount} {isUrdu ? 'ملازمین کی حاضری' : isRoman ? 'Staff Ki Haziri' : 'Staff Logged In'}
                  </span>
                </span>
              </div>
            </div>

            {/* 4 High-Contrast KPI Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <div className="text-[10px] font-mono uppercase text-muted font-bold mb-1">
                  {isUrdu ? 'کل عملہ' : isRoman ? 'TOTAL HAZIR' : 'TOTAL PRESENT'}
                </div>
                <div className="text-xl font-extrabold font-mono text-ink">{totalCount}</div>
                <div className="text-[10px] text-muted">{isUrdu ? 'شفٹ میں شامل' : isRoman ? 'Verified Staff' : 'Verified Staff'}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <div className="text-[10px] font-mono uppercase text-muted font-bold mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isUrdu ? 'اس وقت فعال' : isRoman ? 'ABHI KAAM PAR' : 'ACTIVE NOW'}</span>
                </div>
                <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {activeCount}
                </div>
                <div className="text-[10px] text-muted">{isUrdu ? 'فلور پر کام جاری' : isRoman ? 'Floor Par Active' : 'On Active Shift'}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <div className="text-[10px] font-mono uppercase text-muted font-bold mb-1">
                  {isUrdu ? 'شفٹ مکمل' : isRoman ? 'MUKAMMAL HOGAYI' : 'COMPLETED'}
                </div>
                <div className="text-xl font-extrabold font-mono text-ink">{completedCount}</div>
                <div className="text-[10px] text-muted">{isUrdu ? 'لاگ آؤٹ ہو چکے' : isRoman ? 'Signed Out' : 'Signed Out'}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <div className="text-[10px] font-mono uppercase text-muted font-bold mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted" />
                  <span>{isUrdu ? 'پہلی حاضری' : isRoman ? 'PEHLI HAZIRI' : 'EARLIEST IN'}</span>
                </div>
                <div className="text-sm font-extrabold font-mono text-ink truncate mt-1">
                  {earliestCheckIn ? earliestCheckIn.loginTime : '--:--'}
                </div>
                <div className="text-[10px] text-muted truncate">
                  {earliestCheckIn ? earliestCheckIn.userName : 'None'}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:flex-1">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    isUrdu
                      ? 'ملازم یا عہدہ تلاش کریں...'
                      : isRoman
                      ? 'Staff ka naam ya role dhoondo...'
                      : 'Search staff by name or role...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition"
                />
              </div>

              <div className="flex items-center gap-1 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                    statusFilter === 'all'
                      ? 'bg-ink text-surface border-ink'
                      : 'bg-surface-elevated border-border text-muted hover:text-ink'
                  }`}
                >
                  {isUrdu ? 'تمام' : isRoman ? 'Sab' : 'All'} ({totalCount})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                    statusFilter === 'active'
                      ? 'bg-ink text-surface border-ink'
                      : 'bg-surface-elevated border-border text-muted hover:text-ink'
                  }`}
                >
                  {isUrdu ? 'فعال' : isRoman ? 'Chalu' : 'Active'} ({activeCount})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                    statusFilter === 'completed'
                      ? 'bg-ink text-surface border-ink'
                      : 'bg-surface-elevated border-border text-muted hover:text-ink'
                  }`}
                >
                  {isUrdu ? 'مکمل' : isRoman ? 'Mukammal' : 'Completed'} ({completedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Roster List of Staff for Selected Date */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-muted" />
                <span>
                  {isUrdu
                    ? 'ملازمین کی شفٹ ٹائمنگز اور تفصیلات'
                    : isRoman
                    ? 'STAFF SHIFT TIMINGS AUR DETAILS'
                    : 'VERIFIED STAFF TIMETABLE'}{' '}
                  ({selectedDate})
                </span>
              </h3>

              <span className="text-[11px] font-mono text-muted">
                Showing {filteredSessions.length} of {totalCount} records
              </span>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="py-12 text-center text-muted space-y-2">
                <CalendarIcon className="w-10 h-10 mx-auto text-muted/40 stroke-1" />
                <div className="text-sm font-bold text-ink">
                  {isUrdu
                    ? 'اس تاریخ کا کوئی لاگ ان ریکارڈ نہیں ملا'
                    : isRoman
                    ? 'Is tareekh ka koyi sign-in record nahi mila'
                    : 'No sign-in records for this date'}
                </div>
                <p className="text-xs max-w-sm mx-auto">
                  {isUrdu
                    ? 'جب ملازمین سسٹم میں لاگ ان ہوں گے تو ان کی حاضری خودکار طور پر یہاں درج ہو جائے گی۔'
                    : isRoman
                    ? 'Jab staff system mein login karega to attendance yahan automatically show hogi.'
                    : 'Attendance is automatically recorded as soon as authorized floor staff sign into the dashboard.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredSessions.map((session) => {
                  const isActive = session.status === 'active';
                  const initials = session.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  // Calculate duration display
                  let durationStr = '-';
                  if (session.durationMinutes) {
                    const hrs = Math.floor(session.durationMinutes / 60);
                    const mins = session.durationMinutes % 60;
                    durationStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                  } else if (isActive) {
                    const diffMs = Date.now() - new Date(session.loginTimestamp).getTime();
                    const liveMinutes = Math.max(1, Math.round(diffMs / 60000));
                    const hrs = Math.floor(liveMinutes / 60);
                    const mins = liveMinutes % 60;
                    durationStr = hrs > 0 ? `${hrs}h ${mins}m (Live)` : `${mins}m (Live)`;
                  }

                  return (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-xl border border-border bg-surface-elevated hover:border-ink/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Left: Employee Avatar & Name */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ink text-surface font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-ink flex items-center gap-2">
                            <span>{session.userName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-border text-muted">
                              {session.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted font-medium mt-0.5">
                            {getRoleTitle(session.role)}
                          </div>
                          <div className="text-[10px] text-muted/70 font-mono">
                            {session.email}
                          </div>
                        </div>
                      </div>

                      {/* Right: Timestamps & Shift State */}
                      <div className="flex items-center gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border justify-between sm:justify-end">
                        
                        {/* Clock In */}
                        <div className="text-left sm:text-right">
                          <div className="text-[9px] font-mono uppercase text-muted font-bold flex items-center sm:justify-end gap-1">
                            <LogIn className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{isUrdu ? 'لاگ ان' : isRoman ? 'Sign In' : 'Sign In'}</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-ink">
                            {session.loginTime}
                          </div>
                        </div>

                        {/* Clock Out */}
                        <div className="text-left sm:text-right">
                          <div className="text-[9px] font-mono uppercase text-muted font-bold flex items-center sm:justify-end gap-1">
                            <LogOut className="w-2.5 h-2.5 text-rose-500" />
                            <span>{isUrdu ? 'لاگ آؤٹ' : isRoman ? 'Sign Out' : 'Sign Out'}</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-ink">
                            {session.logoutTime ? (
                              session.logoutTime
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                {isUrdu ? 'فلور پر موجود' : isRoman ? 'Floor Par Active' : 'Active Shift'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="text-left sm:text-right min-w-[70px]">
                          <div className="text-[9px] font-mono uppercase text-muted font-bold flex items-center sm:justify-end gap-1">
                            <Timer className="w-2.5 h-2.5 text-muted" />
                            <span>{isUrdu ? 'دورانیہ' : isRoman ? 'Time' : 'Duration'}</span>
                          </div>
                          <div className="font-mono text-xs font-extrabold text-ink">
                            {durationStr}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{isUrdu ? 'آن لائن' : isRoman ? 'ACTIVE' : 'ACTIVE'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-surface border border-border text-muted">
                              <CheckCircle2 className="w-3 h-3 text-muted" />
                              <span>{isUrdu ? 'مکمل' : isRoman ? 'MUKAMMAL' : 'COMPLETED'}</span>
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}