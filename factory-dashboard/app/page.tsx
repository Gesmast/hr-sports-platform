'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';
import { EmergencyStrip, EmergencyJob } from '@/components/jobs/EmergencyStrip';
import { OwnerKpiTiles, OwnerTileFilter } from '@/components/jobs/OwnerKpiTiles';
import { ManualJobEntryModal } from '@/components/jobs/ManualJobEntryModal';
import { OwnerOverviewTab } from '@/components/owner/OwnerOverviewTab';
import { OwnerExceptionsTab } from '@/components/owner/OwnerExceptionsTab';
import { OwnerBottlenecksTab } from '@/components/owner/OwnerBottlenecksTab';
import { OwnerMasterJobsTab } from '@/components/owner/OwnerMasterJobsTab';
import { OwnerCloseRequestsTab } from '@/components/owner/OwnerCloseRequestsTab';
import { RealJob, getJobCurrentStage } from '@/lib/supabase/data';
import {
  OwnerAlertItem,
  OwnerQcDecision,
  getResponsiblePerson,
  getScheduleStatus,
} from '@/lib/owner-filters';
import {
  Plus,
  Search,
  LayoutDashboard,
  AlertTriangle,
  Flame,
  Layers,
  Lock,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { isUrdu, isRoman } = useI18n();
  const { currentUser, currentRole } = useRole();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'exceptions' | 'bottlenecks' | 'jobs' | 'close'>('overview');
  const [activeTileFilter, setActiveTileFilter] = useState<OwnerTileFilter>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  // Live Karachi Clock
  const [karachiTime, setKarachiTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Karachi',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date());
      setKarachiTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Data State
  const [jobs, setJobs] = useState<RealJob[]>([]);
  const [qcDecisions, setQcDecisions] = useState<OwnerQcDecision[]>([
    {
      jobNo: 248,
      party: 'ZEE SPORTS',
      product: 'Sublimation Match Shirts',
      rejectedQty: 12,
      defectCategory: 'Collar Alignment & Seam Skew',
      sourceDept: 'Stitching Line',
      reportedAt: new Date().toISOString(),
      itemIndex: 0,
    },
  ]);

  const [emergencies, setEmergencies] = useState<EmergencyJob[]>([
    {
      jobNo: 248,
      party: 'ZEE SPORTS',
      club: 'CAD Pattern Kit',
      stagesPending: ['Cutting', 'Printing'],
      deadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      reason: 'Flight dispatch for UAE League Match',
    },
  ]);

  const [alerts, setAlerts] = useState<OwnerAlertItem[]>([]);
  const [bottlenecks, setBottlenecks] = useState<any[]>([]);

  // 8 KPI Counters
  const [kpiCounts, setKpiCounts] = useState({
    emergency: 1,
    emergencyPassedCount: 0,
    overdue: 0,
    dueSoon: 2,
    targetMissed: 0,
    qcDecision: 1,
    qcReworkCount: 1,
    noTarget: 3,
    billingPending: 2,
    activeOrders: 50,
    totalWipUnits: 2103,
  });

  // Fetch real data on load
  useEffect(() => {
    async function loadLiveData() {
      try {
        const res = await fetch('/api/data/jobs');
        if (res.ok) {
          const data = await res.json();
          const jobList: RealJob[] = data.jobs || [];
          setJobs(jobList);

          // Calculate stage bottlenecks across all 10 stages
          const stageNames: Record<string, string> = {
            cutting: 'Cutting Station',
            printing: 'Sublimation Printing',
            heatTransfer: 'Heat Transfer Press',
            stitching: 'Stitching Line',
            quality: 'Quality Inspection (QC)',
            clipping: 'Clipping & Thread Trim',
            press: 'Steam Iron & Press',
            finishing: 'Finishing Line',
            packing: 'Packing & Boxing',
            dispatch: 'Dispatch Ready',
          };

          const calculatedBottlenecks = Object.keys(stageNames).map((st) => {
            const jobsAtStage = jobList.filter((j) => j.currentStage === st);
            const pieces = jobsAtStage.reduce((sum, j) => sum + (j.totalQty || 0), 0);
            return {
              stage: st,
              name: stageNames[st],
              count: jobsAtStage.length,
              pieces,
              oldestDays: jobsAtStage.length > 0 ? (st === 'cutting' ? 4 : st === 'stitching' ? 2 : 1) : 0,
              jobsWaiting: jobsAtStage.map((j) => ({
                jobNo: j.job_no,
                party: j.party,
                product: j.items?.[0]?.product || 'Garments',
                qty: j.totalQty || 0,
                idleDays: st === 'cutting' ? 4 : 2,
              })),
            };
          }).sort((a, b) => b.pieces - a.pieces);

          setBottlenecks(calculatedBottlenecks);

          // Calculate Dynamic Alerts for Exceptions Tab
          const newAlerts: OwnerAlertItem[] = [];

          // 1. Overdue Deliveries
          jobList.forEach((j) => {
            const sched = getScheduleStatus(j.delivery_date, !j.isActive);
            const resp = getResponsiblePerson(j);
            if (sched.status === 'OVERDUE') {
              newAlerts.push({
                id: `overdue_${j.job_no}`,
                jobNo: j.job_no,
                party: j.party,
                product: j.items?.[0]?.product || 'Garment',
                stage: j.currentStage || 'Floor',
                responsible: resp.label,
                severity: 'critical',
                type: 'Delivery Overdue',
                reason: `Delivery date passed (${sched.label})`,
                deliveryDate: j.delivery_date,
              });
            } else if (sched.status === 'URGENT') {
              newAlerts.push({
                id: `urgent_${j.job_no}`,
                jobNo: j.job_no,
                party: j.party,
                product: j.items?.[0]?.product || 'Garment',
                stage: j.currentStage || 'Floor',
                responsible: resp.label,
                severity: 'warning',
                type: 'Delivery Due Soon',
                reason: `${sched.label} remaining`,
                deliveryDate: j.delivery_date,
              });
            }
          });

          // 2. Derive Real Production Emergencies from Jobs
          // An order automatically enters Emergency state if:
          // a) Explicitly flagged priority === 'Emergency' or 'Urgent'
          // b) Delivery date is within 24 hours and still in early production stages
          const realEmergencies: EmergencyJob[] = [];
          
          jobList.forEach((j) => {
            const isExplicitUrgent = j.priority === 'Emergency' || j.priority === 'Urgent';
            const sched = getScheduleStatus(j.delivery_date, !j.isActive);
            const isEarlyStage = ['cutting', 'printing', 'heatTransfer', 'stitching'].includes(j.currentStage || '');
            
            if (j.isActive && (isExplicitUrgent || (sched.status === 'URGENT' && isEarlyStage) || sched.status === 'OVERDUE')) {
              realEmergencies.push({
                jobNo: j.job_no,
                party: j.party,
                club: j.client || 'Sports Apparel',
                stagesPending: [j.currentStage || 'Floor Processing'],
                deadline: j.delivery_date || new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
                reason: sched.status === 'OVERDUE'
                  ? `Delivery date passed (${sched.label}) - Immediate dispatch needed`
                  : isExplicitUrgent
                  ? 'Urgent Buyer Priority Order'
                  : `Shipping deadline in ${sched.label}`,
              });
            }
          });

          // Sort emergencies: Overdue / nearest deadline first
          realEmergencies.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

          if (realEmergencies.length > 0) {
            setEmergencies(realEmergencies);
          }

          // 3. Add Emergencies & QC Rejects to Alerts
          const activeEmergencyList = realEmergencies.length > 0 ? realEmergencies : emergencies;
          activeEmergencyList.forEach((e) => {
            newAlerts.unshift({
              id: `em_${e.jobNo}`,
              jobNo: e.jobNo,
              party: e.party,
              product: 'Custom Sports Kit',
              stage: e.stagesPending.join(', '),
              responsible: 'Production Floor',
              severity: 'critical',
              type: 'Emergency Priority',
              reason: e.reason,
              isEmergency: true,
            });
          });

          setAlerts(newAlerts);

          // Sync KPI metrics
          setKpiCounts({
            emergency: emergencies.length,
            emergencyPassedCount: 0,
            overdue: newAlerts.filter((a) => a.type === 'Delivery Overdue').length,
            dueSoon: newAlerts.filter((a) => a.type === 'Delivery Due Soon').length,
            targetMissed: 1,
            qcDecision: qcDecisions.length,
            qcReworkCount: 1,
            noTarget: 3,
            billingPending: jobList.filter((j) => j.billing_status === 'Bill Pending').length,
            activeOrders: data.activeCount || jobList.length,
            totalWipUnits: data.totalWipUnits || 2103,
          });
        }
      } catch (err) {
        console.error('Failed to load live data', err);
      }
    }

    loadLiveData();
  }, [emergencies.length, qcDecisions.length]);

  // Handle KPI Tile Filter Click (Switches to Exceptions or Jobs Tab)
  const handleSelectTileFilter = (filter: OwnerTileFilter) => {
    setActiveTileFilter(filter);
    if (!filter) {
      setActiveTab('overview');
      return;
    }
    if (filter === 'active_orders') {
      setActiveTab('jobs');
    } else {
      setActiveTab('exceptions');
    }
  };

  const handleResolveQc = (jobNo: number, action: 'rework' | 'continue') => {
    setQcDecisions((prev) => prev.filter((q) => q.jobNo !== jobNo));
    setKpiCounts((prev) => ({
      ...prev,
      qcDecision: Math.max(0, prev.qcDecision - 1),
    }));
  };

  const tabs = [
    {
      id: 'overview',
      label: isUrdu ? 'آپریشنز اوورویو' : isRoman ? 'Operations Overview' : 'Operations Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'exceptions',
      label: isUrdu ? 'توجہ طلب آرڈرز' : isRoman ? 'Exceptions Matrix' : 'Exceptions Matrix',
      icon: AlertTriangle,
      count: alerts.length,
    },
    {
      id: 'bottlenecks',
      label: isUrdu ? 'مراحل کی رکاوٹیں' : isRoman ? 'Stage Bottlenecks' : 'Stage Bottlenecks',
      icon: Flame,
    },
    {
      id: 'jobs',
      label: isUrdu ? 'تمام پروڈکشن جابز' : isRoman ? 'Master Jobs Table' : 'Master Jobs Table',
      icon: Layers,
      count: kpiCounts.activeOrders,
    },
    {
      id: 'close',
      label: isUrdu ? 'بندش کی درخواستیں' : isRoman ? 'Close Requests' : 'Close Requests',
      icon: Lock,
      count: 2,
    },
  ];

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 max-w-[1580px] mx-auto pb-12 select-none"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP GREETING & ACTION BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-surface border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>{todayStr}</span>
            <span>•</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{karachiTime || 'Karachi Time'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Factory Shift Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {currentUser?.name?.includes('Hassan')
              ? isUrdu
                ? 'السلام علیکم! جناب حسن بھائی'
                : isRoman
                ? 'Aslam-o-Alaikum! Sir Hassan'
                : 'Aslam-o-Alaikum! Sir Hassan'
              : isUrdu
              ? 'السلام علیکم! جناب حفیظ بھائی'
              : isRoman
              ? 'Aslam-o-Alaikum! Sir Hafeez'
              : 'Aslam-o-Alaikum! Sir Hafeez'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu
              ? 'فیکٹری کمانڈ سنٹر: آرڈرز، فلور پراسسنگ اور لائیو کارکردگی'
              : isRoman
              ? 'Factory Command Center: Orders, floor processing aur live performance'
              : 'Factory Operations Command Center & Executive Leadership Desk'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Universal Quick Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim() && activeTab !== 'jobs') {
                  setActiveTab('jobs');
                }
              }}
              placeholder="Search Job #, Customer, Staff..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition shadow-2xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* + Job Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setIsNewJobModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isUrdu ? 'نیا جاب کارڈ' : isRoman ? 'Naya Job Card' : 'New Job Card'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. EMERGENCY WARNING STRIP
          ───────────────────────────────────────────────────────────── */}
      <EmergencyStrip
        emergencies={emergencies}
        canEndEmergency={true}
        onEndEmergency={(jobNo) => {
          setEmergencies((prev) => prev.filter((e) => e.jobNo !== jobNo));
          setKpiCounts((prev) => ({ ...prev, emergency: Math.max(0, prev.emergency - 1) }));
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. THE 8 OWNER KPI TILES (Clicking ANY tile filters the view)
          ───────────────────────────────────────────────────────────── */}
      <OwnerKpiTiles
        counts={kpiCounts}
        activeFilter={activeTileFilter}
        onSelectFilter={handleSelectTileFilter}
      />

      {/* ─────────────────────────────────────────────────────────────
          4. 5-TAB NAVIGATION BAR (Sliding indicator & live counts)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'exceptions') {
                  setActiveTileFilter(null);
                }
              }}
              className={`relative px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="ownerActiveTabPill"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. TAB CONTENT PANELS
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <OwnerOverviewTab
              jobs={jobs}
              qcDecisions={qcDecisions}
              topAlerts={alerts}
              bottlenecks={bottlenecks}
              onResolveQc={handleResolveQc}
              onSelectTab={(tabId) => setActiveTab(tabId as any)}
            />
          </motion.div>
        )}

        {activeTab === 'exceptions' && (
          <motion.div
            key="exceptions"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <OwnerExceptionsTab
              alerts={alerts}
              activeFilter={activeTileFilter}
              onClearFilter={() => setActiveTileFilter(null)}
            />
          </motion.div>
        )}

        {activeTab === 'bottlenecks' && (
          <motion.div
            key="bottlenecks"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <OwnerBottlenecksTab jobs={jobs} bottlenecks={bottlenecks} />
          </motion.div>
        )}

        {activeTab === 'jobs' && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <OwnerMasterJobsTab
              jobs={jobs}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </motion.div>
        )}

        {activeTab === 'close' && (
          <motion.div
            key="close"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <OwnerCloseRequestsTab
              onApprove={(id) => {
                // Remove from pending
              }}
              onReject={(id) => {
                // Keep active
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Job Entry Modal (Owner Floor Bypass) */}
      <ManualJobEntryModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        suggestedJobNo={jobs.length > 0 ? Math.max(...jobs.map((j) => j.job_no)) + 1 : 270}
        onJobCreated={(newJob) => {
          setJobs((prev) => [newJob, ...prev]);
          setKpiCounts((prev) => ({ ...prev, activeOrders: prev.activeOrders + 1 }));
        }}
      />
    </motion.div>
  );
}
