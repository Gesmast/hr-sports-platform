'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useRole } from '@/lib/auth/role-context';
import {
  ArrowLeft,
  Share2,
  Printer,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Loader2,
  Crown,
  ShieldCheck,
  ChevronRight,
  Flame,
} from 'lucide-react';

export default function JobDetailPage({ params }: { params: Promise<{ jobNo: string }> }) {
  const { jobNo } = use(params);
  const router = useRouter();
  const { t, isUrdu, isRoman } = useI18n();
  const { currentRole } = useRole();
  const isOwner = currentRole === 'owner';

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [revertingStage, setRevertingStage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('Order cancelled by client');
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const stageKeysOrder = [
    'cutting',
    'printing',
    'heatTransfer',
    'stitching',
    'quality',
    'clipping',
    'press',
    'finishing',
    'packing',
    'dispatch',
  ];

  const stageLabels: Record<string, string> = {
    cutting: '1. Cutting Line',
    printing: '2. Sublimation Printing',
    heatTransfer: '3. Heat Transfer Press',
    stitching: '4. Stitching Floor',
    quality: '5. Quality Control (QC)',
    clipping: '6. Clipping & Trimming',
    press: '7. Steam Iron & Press',
    finishing: '8. Finishing Line',
    packing: '9. Packaging Desk',
    dispatch: '10. Final Dispatch',
  };

  async function loadJobDetails() {
    try {
      setLoading(true);
      const res = await fetch(`/api/data/jobs/${jobNo}`);
      if (!res.ok) {
        setErrorMsg(`Job #${jobNo} not found in the production database.`);
        return;
      }
      const data = await res.json();
      if (data.success && data.job) {
        setJob(data.job);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobDetails();
  }, [jobNo]);

  // Owner action: Revert a stage back to In Process or Pending
  const handleRevertStage = async (lineItemId: string, stageKey: string, targetStatus: string = 'In Process') => {
    try {
      setRevertingStage(stageKey);
      const res = await fetch(`/api/data/jobs/${jobNo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'revert_stage',
          lineItemId,
          stageKey,
          targetStatus,
          reason: 'Stage reverted by Executive Owner',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionNotice(`Stage [${stageLabels[stageKey] || stageKey}] successfully reverted to "${targetStatus}".`);
        setTimeout(() => setActionNotice(null), 5000);
        await loadJobDetails();
      } else {
        alert(data.message || 'Could not revert stage.');
      }
    } catch (err: any) {
      alert('Error reverting stage: ' + err.message);
    } finally {
      setRevertingStage(null);
    }
  };

  // Owner action: Update priority
  const handleUpdatePriority = async (newPriority: string) => {
    try {
      const res = await fetch(`/api/data/jobs/${jobNo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (res.ok) {
        setJob((prev: any) => ({ ...prev, priority: newPriority }));
        setActionNotice(`Job #${jobNo} priority updated to "${newPriority}".`);
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch {
      // Ignore
    }
  };

  // Owner action: Delete / Archive Job
  const handleDeleteJob = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/data/jobs/${jobNo}?reason=${encodeURIComponent(deleteReason)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert(`Job #${jobNo} has been deleted and archived.`);
        router.push('/jobs');
      } else {
        alert(data.message || 'Failed to delete job.');
      }
    } catch (err: any) {
      alert('Error deleting job: ' + err.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!job) return;
    const text = `*HR SPORTS PRODUCTION UPDATE*\nJob #${job.job_no}: ${job.party}\nDelivery Date: ${job.delivery_date || 'TBD'}\nPriority: ${job.priority}\nStatus: ${job.currentStage || 'In Production'}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-ink" />
        <p className="text-xs font-mono text-muted">Loading live Job #{jobNo} card...</p>
      </div>
    );
  }

  if (errorMsg || !job) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-ink">Job Not Found</h2>
        <p className="text-xs text-muted">{errorMsg || 'Record does not exist'}</p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-base bg-ink text-surface text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Master Jobs</span>
        </Link>
      </div>
    );
  }

  const primaryItem = job.items?.[0] || {};
  const stagesObj = primaryItem.stages || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button & Action Suite */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'ماسٹر جابز پر واپس جائیں' : isRoman ? 'Master Jobs Par Wapis Jao' : 'Back to Master Jobs'}</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Owner Delete Button */}
          {isOwner && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1.5 rounded-base border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{isUrdu ? 'جاب حذف کریں' : isRoman ? 'Job Delete Karo' : 'Delete Job'}</span>
            </button>
          )}

          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-base border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isUrdu ? 'واٹس ایپ اپ ڈیٹ' : isRoman ? 'WhatsApp Bhejo' : 'WhatsApp Update'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-base border border-border bg-surface hover:bg-surface-elevated text-xs font-semibold text-ink flex items-center gap-1.5 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-muted" />
            <span>{isUrdu ? 'جاب کارڈ پرنٹ کریں' : isRoman ? 'Job Card Print Karo' : 'Print Job Card'}</span>
          </button>
        </div>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div className="p-3.5 rounded-base border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Job Card */}
      <div className="p-6 rounded-base border border-border bg-surface shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="text-xs font-mono text-muted uppercase">Master Execution Card</div>
            <h1 className="text-2xl font-extrabold font-mono text-ink tracking-tight mt-0.5">
              Job #{job.job_no} • {job.party}
            </h1>
            <div className="text-xs text-muted mt-0.5">
              {job.client || 'Standard Production'} — {primaryItem.product || 'Garment'} ({job.totalQty || primaryItem.qty || 0} pcs)
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Selector (Owner & Coordinator) */}
            {isOwner ? (
              <select
                value={job.priority || 'Normal'}
                onChange={(e) => handleUpdatePriority(e.target.value)}
                className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-surface-elevated text-ink border border-border focus:outline-none"
              >
                <option value="Normal">Priority: Normal</option>
                <option value="Urgent">Priority: Urgent</option>
                <option value="Emergency">Priority: Emergency</option>
              </select>
            ) : (
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-surface-elevated text-ink border border-border">
                Priority: {job.priority || 'Normal'}
              </span>
            )}

            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Quotation: {job.quotation_status || 'Approved'}
            </span>

            <span className="px-2.5 py-1 rounded text-xs font-mono text-muted border border-border bg-surface">
              Billing: {job.billing_status || 'Bill Pending'}
            </span>
          </div>
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded bg-surface-elevated border border-border">
            <span className="text-muted block text-[10px] uppercase">Order Date</span>
            <span className="font-bold text-ink">{job.order_date || job.created_at?.slice(0, 10)}</span>
          </div>
          <div className="p-3 rounded bg-surface-elevated border border-border">
            <span className="text-muted block text-[10px] uppercase">Delivery Target</span>
            <span className="font-bold text-ink">{job.delivery_date || 'TBD'}</span>
          </div>
          <div className="p-3 rounded bg-surface-elevated border border-border">
            <span className="text-muted block text-[10px] uppercase">Total Pieces</span>
            <span className="font-bold text-ink">{job.totalQty || primaryItem.qty || 0} pcs</span>
          </div>
          <div className="p-3 rounded bg-surface-elevated border border-border">
            <span className="text-muted block text-[10px] uppercase">Current Station</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{job.currentStage}</span>
          </div>
        </div>

        {/* 10 Production Stages Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted" />
              <span>10-Stage Shop Floor Progression</span>
            </h2>
            {isOwner && (
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Crown className="w-3 h-3" />
                <span>Executive Owner Control Active (Revert Allowed)</span>
              </span>
            )}
          </div>

          <div className="divide-y divide-border border border-border rounded-base overflow-hidden bg-surface-elevated">
            {stageKeysOrder.map((key) => {
              const stageData = stagesObj[key] || {};
              const status = stageData.status || 'Pending';
              const isComplete = status === 'Complete';
              const isInProcess = status === 'In Process';

              return (
                <div
                  key={key}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-surface/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                        isComplete
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                          : isInProcess
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40 animate-pulse'
                          : 'bg-surface text-muted border-border'
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold">{key[0].toUpperCase()}</span>
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-ink">{stageLabels[key]}</div>
                      <div className="text-[11px] text-muted font-mono">
                        {stageData.responsiblePerson ? `Staff: ${stageData.responsiblePerson}` : 'Unassigned'}{' '}
                        {stageData.workCompleteAt && `• Done: ${stageData.workCompleteAt}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                        isComplete
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : isInProcess
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          : 'bg-surface text-muted border-border'
                      }`}
                    >
                      {status}
                    </span>

                    {/* Owner Revert Button */}
                    {isOwner && (
                      <button
                        onClick={() => handleRevertStage(primaryItem.id, key, isComplete ? 'In Process' : 'Pending')}
                        disabled={revertingStage === key}
                        className="px-2.5 py-1 text-[11px] rounded border border-border bg-surface hover:bg-ink hover:text-surface transition font-mono flex items-center gap-1"
                        title="Revert stage status back"
                      >
                        <RotateCcw className="w-3 h-3 text-muted group-hover:text-surface" />
                        <span>{isComplete ? 'Revert to In Process' : 'Reset'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="p-6 rounded-base border border-border bg-surface shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-ink">Confirm Delete Job #{job.job_no}</h3>
            </div>
            <p className="text-xs text-muted">
              Are you sure you want to delete Job #{job.job_no} ({job.party})? The job will be archived and removed from the active floor ledger.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted uppercase">Reason for Deletion</label>
              <input
                type="text"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-border bg-surface-elevated text-ink focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3.5 py-2 text-xs font-semibold rounded border border-border bg-surface hover:bg-surface-elevated text-muted hover:text-ink transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold rounded bg-rose-600 text-white hover:bg-rose-700 transition flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm & Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
