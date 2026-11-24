import { RealJob } from '@/lib/supabase/data';

export interface OwnerAlertItem {
  id: string;
  jobNo: number;
  party: string;
  club?: string;
  product: string;
  stage: string;
  responsible: string;
  severity: 'critical' | 'warning' | 'info';
  type: string;
  reason: string;
  deliveryDate?: string | null;
  idleDays?: number;
  waitingQty?: number;
  isEmergency?: boolean;
}

export interface OwnerQcDecision {
  jobNo: number;
  party: string;
  product: string;
  rejectedQty: number;
  defectCategory: string;
  sourceDept: string;
  reportedAt: string;
  itemIndex: number;
}

/**
 * Calculates the exact "Stuck With / Responsible" string according to official spec order of precedence:
 * 1. Quotation Rejected -> Closed
 * 2. Complete with bill pending -> Accounts (Billing)
 * 3. Not started and quotation not approved -> Accounts (Quotation)
 * 4. Undecided QC rejects -> Owner / Hamza
 * 5. Pieces in rework -> Assigned Department
 * 6. Rework returned -> Quality re-check
 * 7. Otherwise -> Current stage, department, and responsible person (plus Hold reason if paused)
 */
export function getResponsiblePerson(job: RealJob): { label: string; department: string; isHold: boolean; holdReason?: string } {
  if (job.quotation_status === 'Rejected') {
    return { label: 'Closed (Rejected)', department: 'Office', isHold: false };
  }

  const items = job.items || [];
  let isAllComplete = true;
  for (const it of items) {
    if (it.stages?.dispatch?.status !== 'Complete') {
      isAllComplete = false;
      break;
    }
  }

  if (isAllComplete && job.billing_status === 'Bill Pending') {
    return { label: 'Umair', department: 'Accounts (Billing)', isHold: false };
  }

  if (job.quotation_status === 'Quotation Pending') {
    return { label: 'Umair', department: 'Accounts (Quotation)', isHold: false };
  }

  // Check QC rejects
  for (const it of items) {
    const qc = it.stages?.quality;
    if (qc && (qc.rejectedQty || 0) > 0) {
      return { label: 'Owner / Hamza', department: 'QC Decision Needed', isHold: true, holdReason: 'QC Defect Decision' };
    }
    if (qc && (qc.reworkQty || 0) > 0) {
      return { label: 'Floor Tailor', department: 'Rework In Progress', isHold: false };
    }
  }

  // Find current active stage
  const stageOrder = ['cutting', 'printing', 'heatTransfer', 'stitching', 'quality', 'clipping', 'press', 'finishing', 'packing', 'dispatch'];
  for (const st of stageOrder) {
    for (const it of items) {
      const stData = it.stages?.[st];
      if (stData && (stData.status === 'In Process' || stData.status === 'Pending' || stData.status === 'Hold')) {
        const isHold = stData.status === 'Hold';
        const holdReason = stData.delayReason || undefined;
        let dept = st.charAt(0).toUpperCase() + st.slice(1);
        if (st === 'heatTransfer') dept = 'Heat Press';
        if (st === 'quality') dept = 'Quality (QC)';

        const person = stData.responsiblePerson || (st === 'cutting' ? 'Cutter' : st === 'printing' ? 'Printer' : st === 'stitching' ? 'Stitching Floor' : st === 'quality' ? 'Ashfaq' : 'Floor Team');
        return { label: person, department: dept, isHold, holdReason };
      }
    }
  }

  return { label: 'Floor Team', department: 'Production', isHold: false };
}

/**
 * Calculates delivery schedule status pill
 * OVERDUE: delivery date passed
 * URGENT: <= 2 days
 * AT RISK: <= 5 days
 * ON TRACK: > 5 days or completed
 * NO DATE: null
 */
export function getScheduleStatus(deliveryDate?: string | null, isComplete = false): {
  status: 'OVERDUE' | 'URGENT' | 'AT_RISK' | 'ON_TRACK' | 'NO_DATE';
  label: string;
  badgeClass: string;
} {
  if (isComplete) {
    return { status: 'ON_TRACK', label: 'Complete', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40' };
  }
  if (!deliveryDate) {
    return { status: 'NO_DATE', label: 'No Date Set', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(deliveryDate);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'OVERDUE', label: `Overdue by ${Math.abs(diffDays)}d`, badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40 font-bold' };
  }
  if (diffDays <= 2) {
    return { status: 'URGENT', label: diffDays === 0 ? 'Due Today' : `Due in ${diffDays}d`, badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40 font-semibold' };
  }
  if (diffDays <= 5) {
    return { status: 'AT_RISK', label: `Due in ${diffDays}d`, badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40' };
  }
  return { status: 'ON_TRACK', label: 'On Track', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40' };
}
