import { NextResponse } from 'next/server';
import { getRealInquiryOrDesignById } from '@/lib/supabase/data';
import { emailNotifications } from '@/lib/email/resend';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkbyeviilqdzlcvwndnd.supabase.co';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYnlldmlpbHFkemxjdnduZG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM0NzE2NiwiZXhwIjoyMTA1OTIzMTY2fQ.ES31Zo4-DcTXwoyL8_dKFRuAdKBSzqE4AYyLAERm0Eg';

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inquiry = await getRealInquiryOrDesignById(id);

    if (!inquiry) {
      return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (err: any) {
    console.error('Error fetching inquiry by id:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, senderType = 'staff', threadScope = 'design', senderId, senderName = 'The HR Sports Team' } = body;

    const sb = getAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      const { data: inq } = await sb
        .from('inquiries')
        .select('id, reference_id, user_id, user:profiles!inquiries_user_id_fkey(full_name, email, company_name)')
        .eq('id', id)
        .maybeSingle();

      if (inq) {
        const { data: newMsg, error } = await sb
          .from('inquiry_messages')
          .insert({
            inquiry_id: inq.id,
            sender_id: senderId || inq.user_id,
            sender_type: senderType,
            thread_scope: threadScope,
            message_content: text,
          })
          .select()
          .single();

        if (error) throw error;

        // Trigger customer email notification via Resend
        const customerEmail = (inq.user as any)?.email;
        const customerName = (inq.user as any)?.company_name || (inq.user as any)?.full_name || 'Customer';
        if (customerEmail && senderType === 'staff') {
          emailNotifications.sendNewStaffMessage({
            to: customerEmail,
            clientName: customerName,
            referenceId: inq.reference_id,
            senderName,
            messageText: text,
          }).catch((e) => console.error('Email trigger error:', e));
        }

        return NextResponse.json({ success: true, message: newMsg });
      }
    }

    return NextResponse.json({ success: true, message: { text, created_at: new Date().toISOString() } });
  } catch (err: any) {
    console.error('Error adding inquiry message:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, designerNotes, clientApprovalUnlocked, assignedDesignerId, unitPrice = '$21.50' } = body;

    const sb = getAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      // Fetch current inquiry with user info
      const { data: inq } = await sb
        .from('inquiries')
        .select('*, user:profiles!inquiries_user_id_fkey(full_name, email, company_name)')
        .eq('id', id)
        .maybeSingle();

      if (inq) {
        const updateData: any = {};
        if (status) updateData.status = status;
        if (designerNotes !== undefined) updateData.designer_handover_notes = designerNotes;
        if (clientApprovalUnlocked !== undefined) updateData.client_approval_unlocked = clientApprovalUnlocked;
        if (assignedDesignerId) {
          updateData.assigned_designer_id = assignedDesignerId;
          if (assignedDesignerId !== inq.assigned_designer_id) {
            sb.from('notifications').insert({
              target_role: 'usman',
              target_user_id: assignedDesignerId,
              event_type: 'designer_assigned',
              inquiry_id: id,
              request_no: inq.reference_id,
              customer_name: (inq.user as any)?.company_name || (inq.user as any)?.full_name || 'Customer',
              company_name: (inq.user as any)?.company_name || 'Client',
              title: `Assigned: Inquiry #${inq.reference_id}`,
              message: `You have been assigned to prepare CAD proofs for Inquiry #${inq.reference_id} (${inq.garment_type}, ${inq.quantity} pcs).`,
              is_urgent: false,
            }).then(() => {});
          }
        }

        // Auto-assign to Accounts and notify when moving to quotation or approved design
        if (status === 'design_approved' || status === 'pending_quotation' || status === 'quoted' || clientApprovalUnlocked) {
          const { data: acct } = await sb.from('profiles').select('id').eq('email', 'accounts1@thehrsports.com').maybeSingle();
          if (acct?.id) {
            updateData.assigned_accounts_id = acct.id;
          }

          if (status === 'design_approved') {
            sb.from('notifications').insert([
              {
                target_role: 'umair',
                event_type: 'design_approved',
                inquiry_id: id,
                request_no: inq.reference_id,
                customer_name: (inq.user as any)?.company_name || (inq.user as any)?.full_name || 'Customer',
                company_name: (inq.user as any)?.company_name || 'Client',
                title: `Design Approved: #${inq.reference_id}`,
                message: `Client approved 3D design for Inquiry #${inq.reference_id} (${inq.garment_type}, ${inq.quantity} pcs). Commercial quotation ready to issue.`,
                is_urgent: true,
              },
              {
                target_role: 'hamza',
                event_type: 'design_approved',
                inquiry_id: id,
                request_no: inq.reference_id,
                customer_name: (inq.user as any)?.company_name || (inq.user as any)?.full_name || 'Customer',
                company_name: (inq.user as any)?.company_name || 'Client',
                title: `Design Approved: #${inq.reference_id}`,
                message: `3D proof approved for Inquiry #${inq.reference_id}. Handed over to Accounts for pricing.`,
                is_urgent: false,
              },
            ]).then(() => {});
          }
        }

        const { data: updatedInq } = await sb.from('inquiries').update(updateData).eq('id', id).select();

        const customerEmail = (inq.user as any)?.email;
        const customerName = (inq.user as any)?.company_name || (inq.user as any)?.full_name || 'Customer';

        // Trigger Resend email when design mockup is ready for client approval
        if (clientApprovalUnlocked && customerEmail) {
          emailNotifications.sendDesignMockupReady({
            to: customerEmail,
            clientName: customerName,
            referenceId: inq.reference_id,
            garmentType: inq.garment_type,
            designerName: 'Usman (CAD Lead)',
          }).catch((e) => console.error('Email error:', e));
        }

        // Trigger Resend email when formal quotation is issued
        if (status === 'quoted' && customerEmail) {
          emailNotifications.sendQuotationIssued({
            to: customerEmail,
            clientName: customerName,
            referenceId: inq.reference_id,
            garmentType: inq.garment_type,
            quantity: inq.quantity,
            unitPrice,
          }).catch((e) => console.error('Email error:', e));
        }

        return NextResponse.json({ success: true, updated: updatedInq?.[0] });
      }

      // Try updating design_requests
      const dreqUpdate: any = {};
      if (status) dreqUpdate.design_status = status;
      const { data: updatedDreq } = await sb.from('design_requests').update(dreqUpdate).eq('id', id).select();
      if (updatedDreq && updatedDreq.length > 0) {
        return NextResponse.json({ success: true, updated: updatedDreq[0] });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating inquiry:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
