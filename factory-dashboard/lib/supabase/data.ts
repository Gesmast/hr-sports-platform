import { createClient } from '@supabase/supabase-js';

// Dedicated server-side Supabase client with service role key to query real production data
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkbyeviilqdzlcvwndnd.supabase.co';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const STAGES_ORDER = [
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
] as const;

export type StageKey = (typeof STAGES_ORDER)[number];

export function getJobCurrentStage(items?: any[]): string {
  if (!items || items.length === 0) return 'Pending Start';

  let allDispatched = true;
  for (const item of items) {
    if (item.stages?.dispatch?.status !== 'Complete') {
      allDispatched = false;
      break;
    }
  }
  if (allDispatched) return 'Dispatched';

  for (const st of STAGES_ORDER) {
    for (const item of items) {
      const stageStatus = item.stages?.[st]?.status;
      if (stageStatus === 'In Process' || stageStatus === 'Pending') {
        return st;
      }
    }
  }

  return 'Complete';
}

export function isJobActive(items?: any[]): boolean {
  if (!items || items.length === 0) return true;
  for (const item of items) {
    if (item.stages?.dispatch?.status !== 'Complete') {
      return true;
    }
  }
  return false;
}

export interface RealJob {
  id: string;
  job_no: number;
  party: string;
  client: string | null;
  order_date: string | null;
  delivery_date: string | null;
  quotation_no: string | null;
  quotation_status: string | null;
  billing_status: string | null;
  priority: string | null;
  created_by: string | null;
  created_at: string | null;
  items?: any[];
  design_request?: any;
  inquiry?: any;
  currentStage?: string;
  isActive?: boolean;
  totalQty?: number;
}

export interface RealDesignRequest {
  id: string;
  request_no: string;
  client_party: string;
  contact: string | null;
  club_name: string | null;
  product: string | null;
  requirement: string | null;
  designer: string | null;
  designer_name: string | null;
  design_status: string;
  revision_no: number;
  job_no: number | null;
  job_id: string | null;
  order_qty?: number | null;
  delivery_date: string | null;
  created_at: string;
  items?: any[];
  inquiry?: any;
  job?: any;
}

export interface RealNotification {
  id: number;
  target_role: string | null;
  target_user_id: string | null;
  event_type: string;
  job_no: number | null;
  job_id: string | null;
  request_no: string | null;
  message: string;
  is_urgent: boolean;
  created_at: string;
}

export interface RealInquiry {
  id: string;
  reference_id: string;
  user_id: string;
  garment_type: string;
  quantity: number;
  fabric_spec: string | null;
  target_price: number | null;
  custom_spec_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user?: any;
  designer?: any;
  accounts?: any;
}

export interface JobsResponse {
  jobs: RealJob[];
  totalCount: number;
  activeCount: number;
  dispatchedCount: number;
  totalWipUnits: number;
  stageCounts: Record<string, number>;
  bottleneckStage: string;
}

export async function getRealJobs(limit = 500): Promise<JobsResponse> {
  try {
    const sb = getAdminClient();
    const { data, count, error } = await sb
      .from('jobs')
      .select('*, items:job_line_items(*), design_request:design_requests!jobs_design_request_id_fkey(*)', { count: 'exact' })
      .is('deleted_at', null)
      .order('job_no', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching jobs:', error.message);
      return {
        jobs: [],
        totalCount: 0,
        activeCount: 0,
        dispatchedCount: 0,
        totalWipUnits: 0,
        stageCounts: {},
        bottleneckStage: 'Cutting',
      };
    }

    const rawJobs = (data as any[]) || [];
    let activeCount = 0;
    let dispatchedCount = 0;
    let totalWipUnits = 0;

    const stageCounts: Record<string, number> = {};
    STAGES_ORDER.forEach((s) => (stageCounts[s] = 0));

    const enrichedJobs: RealJob[] = rawJobs.map((j) => {
      const currentStage = getJobCurrentStage(j.items);
      const active = currentStage !== 'Dispatched';
      const totalQty = (j.items || []).reduce((acc: number, it: any) => acc + (Number(it.qty) || 0), 0);

      if (active) {
        activeCount++;
        totalWipUnits += totalQty;
        if (stageCounts[currentStage] !== undefined) {
          stageCounts[currentStage]++;
        }
      } else {
        dispatchedCount++;
      }

      return {
        ...j,
        currentStage,
        isActive: active,
        totalQty,
      };
    });

    let maxStage = 'cutting';
    let maxStageCount = -1;
    for (const [st, cnt] of Object.entries(stageCounts)) {
      if (cnt > maxStageCount) {
        maxStageCount = cnt;
        maxStage = st;
      }
    }

    const stageNames: Record<string, string> = {
      cutting: 'Cutting Station',
      printing: 'Sublimation Printing',
      heatTransfer: 'Heat Transfer Press',
      stitching: 'Stitching Floor',
      quality: 'Quality Inspection',
      clipping: 'Clipping & Thread Trimming',
      press: 'Steam Iron & Press',
      finishing: 'Finishing Line',
      packing: 'Packaging Desk',
      dispatch: 'Dispatch Ready',
    };

    return {
      jobs: enrichedJobs,
      totalCount: count || rawJobs.length,
      activeCount,
      dispatchedCount,
      totalWipUnits,
      stageCounts,
      bottleneckStage: `${stageNames[maxStage] || maxStage} (${maxStageCount} jobs)`,
    };
  } catch (err) {
    console.error('Failed to get real jobs', err);
    return {
      jobs: [],
      totalCount: 0,
      activeCount: 0,
      dispatchedCount: 0,
      totalWipUnits: 0,
      stageCounts: {},
      bottleneckStage: 'Cutting Station',
    };
  }
}

export async function getRealJobByNo(jobNo: number): Promise<RealJob | null> {
  try {
    const sb = getAdminClient();
    const { data, error } = await sb
      .from('jobs')
      .select('*, items:job_line_items(*), design_request:design_requests!jobs_design_request_id_fkey(*)')
      .eq('job_no', jobNo)
      .single();

    if (error || !data) return null;
    const currentStage = getJobCurrentStage(data.items);
    const active = currentStage !== 'Dispatched';
    const totalQty = (data.items || []).reduce((acc: number, it: any) => acc + (Number(it.qty) || 0), 0);

    return {
      ...data,
      currentStage,
      isActive: active,
      totalQty,
    } as any;
  } catch {
    return null;
  }
}

export interface DesignRequestsResponse {
  requests: RealDesignRequest[];
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  pendingList: RealDesignRequest[];
}

export async function getRealDesignRequests(limit = 500): Promise<DesignRequestsResponse> {
  try {
    const sb = getAdminClient();
    const { data, count, error } = await sb
      .from('design_requests')
      .select('*, inquiry:inquiries(*), job:jobs!design_requests_job_id_fkey(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching design requests:', error.message);
      return { requests: [], totalCount: 0, pendingCount: 0, approvedCount: 0, pendingList: [] };
    }

    const mapped = (data || []).map((d: any) => ({
      ...d,
      designer: d.designer_name || d.designer || 'Unassigned',
    }));

    const pendingList = mapped.filter((d: any) => d.design_status !== 'Approved');
    const approvedCount = mapped.filter((d: any) => d.design_status === 'Approved').length;

    return {
      requests: mapped,
      totalCount: count || mapped.length,
      pendingCount: pendingList.length,
      approvedCount,
      pendingList,
    };
  } catch (err) {
    console.error('Failed to get real design requests', err);
    return { requests: [], totalCount: 0, pendingCount: 0, approvedCount: 0, pendingList: [] };
  }
}

export async function getRealInquiries(limit = 100): Promise<{ inquiries: RealInquiry[]; count: number; activeCount: number }> {
  try {
    const sb = getAdminClient();
    const { data, count, error } = await sb
      .from('inquiries')
      .select('*, user:profiles!inquiries_user_id_fkey(*), designer:profiles!inquiries_assigned_designer_id_fkey(*), accounts:profiles!inquiries_assigned_accounts_id_fkey(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching inquiries:', error.message);
      return { inquiries: [], count: 0, activeCount: 0 };
    }

    const raw = (data as any[]) || [];
    const activeCount = raw.filter((i) => i.status !== 'converted' && i.status !== 'past_inactive').length;

    return { inquiries: raw, count: count || raw.length, activeCount };
  } catch (err) {
    console.error('Failed to get real inquiries', err);
    return { inquiries: [], count: 0, activeCount: 0 };
  }
}

export async function getRealNotifications(limit = 50): Promise<{ notifications: RealNotification[]; count: number }> {
  try {
    const sb = getAdminClient();
    const { data, count, error } = await sb
      .from('notifications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error.message);
      return { notifications: [], count: 0 };
    }

    return { notifications: (data as any) || [], count: count || 0 };
  } catch (err) {
    console.error('Failed to get real notifications', err);
    return { notifications: [], count: 0 };
  }
}

export async function getRealStoreRecords(limit = 50) {
  try {
    const sb = getAdminClient();
    const { data, count, error } = await sb
      .from('store_records')
      .select('*', { count: 'exact' })
      .limit(limit);

    if (error) return { records: [], count: 0 };
    return { records: data || [], count: count || 0 };
  } catch {
    return { records: [], count: 0 };
  }
}

export async function getRealInquiryOrDesignById(id: string): Promise<any | null> {
  try {
    const sb = getAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // 1. Try inquiries table (website customer inquiry)
    let inq: any = null;
    if (isUuid) {
      const { data } = await sb
        .from('inquiries')
        .select(
          '*, user:profiles!inquiries_user_id_fkey(*), designer:profiles!inquiries_assigned_designer_id_fkey(*), accounts:profiles!inquiries_assigned_accounts_id_fkey(*), attachments:inquiry_attachments(*), messages:inquiry_messages(*)'
        )
        .eq('id', id)
        .maybeSingle();
      inq = data;
    }
    if (!inq) {
      const { data } = await sb
        .from('inquiries')
        .select(
          '*, user:profiles!inquiries_user_id_fkey(*), designer:profiles!inquiries_assigned_designer_id_fkey(*), accounts:profiles!inquiries_assigned_accounts_id_fkey(*), attachments:inquiry_attachments(*), messages:inquiry_messages(*)'
        )
        .eq('reference_id', id)
        .maybeSingle();
      inq = data;
    }

    if (inq) {
      return {
        id: inq.id,
        source: 'website',
        ref: inq.reference_id,
        party: inq.user?.company_name || inq.user?.full_name || 'Website Customer',
        contactEmail: inq.user?.email || inq.contact_email,
        contactPhone: inq.user?.phone || inq.contact_phone,
        club: inq.garment_type,
        garment: inq.garment_type,
        qty: inq.quantity,
        targetPrice: inq.target_price ? `$${inq.target_price}` : '$18.50',
        fabricSpec: inq.fabric_spec,
        customNotes: inq.custom_spec_notes,
        status: inq.status,
        createdAt: inq.created_at,
        isFirstResponseMet: inq.is_first_response_met,
        clientApprovalUnlocked: inq.client_approval_unlocked,
        designerHandoverNotes: inq.designer_handover_notes || '',
        assignedDesigner: inq.designer?.full_name || 'Usman',
        assignedAccounts: inq.accounts?.full_name || 'Umair',
        attachments: inq.attachments || [],
        messages: (inq.messages || [])
          .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((m: any) => ({
            id: m.id,
            sender: m.sender_type,
            senderId: m.sender_id,
            senderName: m.sender_type === 'client' ? (inq.user?.company_name || inq.user?.full_name || 'Customer') : (m.sender_name || 'HR Sports Staff'),
            text: m.message_content,
            created_at: m.created_at,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            scope: m.thread_scope,
            is_read: m.is_read,
            read_at: m.read_at,
            attachments: m.attachments || [],
          })),
      };
    }

    // 2. Try design_requests table (CAD design request)
    let dreq: any = null;
    if (isUuid) {
      const { data } = await sb
        .from('design_requests')
        .select('*, inquiry:inquiries(*), job:jobs!design_requests_job_id_fkey(*)')
        .eq('id', id)
        .maybeSingle();
      dreq = data;
    }
    if (!dreq) {
      const { data } = await sb
        .from('design_requests')
        .select('*, inquiry:inquiries(*), job:jobs!design_requests_job_id_fkey(*)')
        .eq('request_no', id)
        .maybeSingle();
      dreq = data;
    }

    if (dreq) {
      return {
        id: dreq.id,
        source: 'cad_spec',
        ref: dreq.request_no,
        party: dreq.client_party || 'Client Party',
        contactEmail: dreq.contact,
        contactPhone: dreq.contact,
        club: dreq.club_name || dreq.product || 'Kit Set',
        garment: dreq.product || dreq.requirement || 'Garment Specification',
        qty: dreq.order_qty || 45,
        targetPrice: '$20.00',
        fabricSpec: dreq.requirement,
        customNotes: dreq.requirement,
        status: dreq.design_status,
        revisionNo: dreq.revision_no,
        jobNo: dreq.job_no,
        createdAt: dreq.created_at,
        isFirstResponseMet: dreq.design_status === 'Approved',
        clientApprovalUnlocked: dreq.design_status === 'Approved',
        designerHandoverNotes: dreq.requirement || '',
        assignedDesigner: dreq.designer_name || dreq.designer || 'Usman',
        assignedAccounts: dreq.job_no ? 'Umair' : 'Accounts Desk',
        attachments: [],
        messages: [
          {
            id: 'm1',
            sender: 'staff',
            senderName: dreq.designer_name || 'CAD Designer',
            text: `CAD Design Request ${dreq.request_no} created for ${dreq.client_party}. Requirement: ${dreq.requirement || 'Standard pattern grading'}. Status: ${dreq.design_status}.`,
            time: new Date(dreq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            scope: 'design',
          },
        ],
      };
    }

    return null;
  } catch (err) {
    console.error('Failed to get inquiry or design request by id', err);
    return null;
  }
}
