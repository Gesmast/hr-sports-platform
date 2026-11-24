export type AppRole =
  | 'owner'
  | 'hamza'      // Operations Coordinator
  | 'usman'      // Design & Order Desk (Usman, Shahzaib, Faizan)
  | 'mubasher'   // Production In-Charge
  | 'supervisor' // Floor Supervisor
  | 'ashfaq'     // Quality Department
  | 'umair'      // Accounts & Quotation
  | 'aamir'      // Store & Materials
  | 'viewer';

export type AttendanceStatus = 'online' | 'break' | 'offline';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  active: boolean;
  current_status?: AttendanceStatus;
  status_updated_at?: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  user_name: string;
  role: AppRole;
  status: AttendanceStatus;
  started_at: string;
  ended_at?: string | null;
  duration_minutes?: number | null;
  date: string; // YYYY-MM-DD
  note?: string | null;
}

export type StageKey =
  | 'cutting'
  | 'printing'
  | 'heatTransfer'
  | 'stitching'
  | 'quality'
  | 'clipping'
  | 'press'
  | 'finishing'
  | 'packing'
  | 'dispatch';

export interface StageData {
  _v: number;
  status: 'Pending' | 'In Process' | 'Complete' | 'Not Required' | 'Hold';
  targetQty?: number | null;
  targetDate?: string | null;
  targetTiming?: string | null;
  targetAssignedAt?: string | null;
  targetAssignedBy?: string | null;
  plannedCompletionAt?: string | null;
  workStartAt?: string | null;
  workCompleteAt?: string | null;
  completedQty: number;
  responsiblePerson?: string | null;
  acceptedAt?: string | null;
  acceptedBy?: string | null;
  handoverAt?: string | null;
  handoverTo?: string | null;
  delayReason?: string | null;
  delayStatus?: string | null;
  delayMinutes?: number | null;
  remarks?: string;
  // QC Inspection specific
  checkedQty?: number;
  passedQty?: number;
  reworkQty?: number;
  rejectedQty?: number;
  defectCategory?: string | null;
}

export interface JobLineItem {
  id: string;
  jobId: string;
  jobNo: number;
  product: string;
  design?: string | null;
  qty: number;
  fabric?: string | null;
  processType?: string | null;
  sizeMix?: Record<string, number> | null;
  stages: Record<StageKey, StageData>;
  createdAt?: string;
  updatedAt?: string;
  _dbUpdatedAt?: string;
}

export interface Job {
  id: string;
  jobNo: number;
  party: string;
  client?: string | null;
  orderDate?: string | null;
  deliveryDate?: string | null;
  quotationNo?: string | null;
  quotationStatus: 'Quotation Pending' | 'Quoted' | 'Approved' | 'Rejected' | 'Not Required';
  billingStatus: 'Bill Pending' | 'Billed';
  invoiceNo?: string | null;
  priority: 'Normal' | 'High' | 'Urgent' | 'Emergency';
  priorityHistory?: any[];
  createdBy?: string | null;
  createdAt?: string;
  updatedBy?: string | null;
  updatedAt?: string;
  inquiryId?: string | null;
  _dbUpdatedAt?: string;
}

export type InquiryStatus =
  | 'pending'
  | 'in_design'
  | 'design_approved'
  | 'quoted'
  | 'quote_expired'
  | 'converted'
  | 'past_inactive';

export interface Inquiry {
  id: string;
  reference_id: string;
  user_id?: string | null;
  client_party?: string;
  club_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  garment_type: string;
  quantity: number;
  fabric_spec?: string | null;
  custom_spec_notes?: string | null;
  target_price?: number | null;
  status: InquiryStatus;
  assigned_designer_id?: string | null;
  assigned_designer_name?: string | null;
  assigned_accounts_id?: string | null;
  assigned_accounts_name?: string | null;
  first_response_deadline?: string | null;
  response_deadline?: string | null;
  last_customer_message_at?: string | null;
  last_staff_message_at?: string | null;
  is_first_response_met: boolean;
  client_approval_unlocked: boolean;
  design_approved_at?: string | null;
  designer_handover_notes?: string | null;
  quote_expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryMessage {
  id: string;
  inquiry_id: string;
  sender_id: string;
  sender_name?: string;
  sender_type: 'client' | 'staff';
  thread_scope: 'design' | 'accounts' | 'internal';
  message_content: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
  created_at: string;
}

export interface DashboardNotification {
  id: number;
  target_role?: string | null;
  target_user_id?: string | null;
  event_type: string;
  job_no?: number | null;
  request_no?: string | null;
  stage?: string | null;
  message: string;
  is_urgent: boolean;
  read_at?: string | null;
  created_at: string;
}
