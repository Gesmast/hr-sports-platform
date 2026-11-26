import { NextResponse } from 'next/server';
import { getRealJobByNo } from '@/lib/supabase/data';
import { emailNotifications } from '@/lib/email/resend';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkbyeviilqdzlcvwndnd.supabase.co';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobNo: string }> }
) {
  try {
    const { jobNo } = await params;
    const num = parseInt(jobNo, 10);
    if (isNaN(num)) {
      return NextResponse.json({ success: false, message: 'Invalid job number' }, { status: 400 });
    }

    const job = await getRealJobByNo(num);
    if (!job) {
      return NextResponse.json({ success: false, message: `Job #${num} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    console.error('Error fetching job by jobNo:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ jobNo: string }> }
) {
  try {
    const { jobNo } = await params;
    const num = parseInt(jobNo, 10);
    if (isNaN(num)) {
      return NextResponse.json({ success: false, message: 'Invalid job number' }, { status: 400 });
    }

    const body = await request.json();
    const { priority, deliveryDate, action, stageKey, targetStatus, lineItemId, updatedBy, reason } = body;
    const sb = getAdminClient();

    // 1. Revert or patch stage status
    if (action === 'revert_stage' || action === 'patch_stage') {
      if (!lineItemId || !stageKey) {
        return NextResponse.json({ success: false, message: 'lineItemId and stageKey are required' }, { status: 400 });
      }

      // Fetch the line item
      const { data: lineItem, error: fetchErr } = await sb
        .from('job_line_items')
        .select('*')
        .eq('id', lineItemId)
        .single();

      if (fetchErr || !lineItem) {
        return NextResponse.json({ success: false, message: 'Line item not found' }, { status: 404 });
      }

      const stages = lineItem.stages || {};
      const currentStageData = stages[stageKey] || {};
      const newStatus = targetStatus || 'In Process';

      stages[stageKey] = {
        ...currentStageData,
        status: newStatus,
        remarks: reason ? `[Owner Revert]: ${reason}` : currentStageData.remarks,
        workCompleteAt: newStatus === 'Complete' ? currentStageData.workCompleteAt : null,
      };

      const { data: updatedItem, error: updateErr } = await sb
        .from('job_line_items')
        .update({
          stages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lineItemId)
        .select()
        .single();

      if (updateErr) throw updateErr;

      // If stage is updated, send customer progress notification (respecting owner toggles)
      if (newStatus === 'In Process' || newStatus === 'Complete') {
        try {
          const { data: jobWithClient } = await sb
            .from('jobs')
            .select('job_no, party, user:profiles!jobs_user_id_fkey(full_name, email)')
            .eq('job_no', num)
            .maybeSingle();

          const clientEmail = (jobWithClient?.user as any)?.email;
          const clientName = (jobWithClient?.user as any)?.full_name || jobWithClient?.party || 'Customer';

          if (clientEmail) {
            emailNotifications.sendOrderStageUpdate({
              to: clientEmail,
              clientName,
              jobNo: num,
              partyName: jobWithClient?.party || 'Customer',
              product: lineItem.product || 'Custom Apparel Run',
              quantity: Number(lineItem.qty) || 0,
              stageKey,
              trackingCarrier: body.trackingCarrier || body.carrier,
              trackingNumber: body.trackingNumber || body.tracking,
            }).catch((err) => console.error('Stage email dispatch error:', err));
          }
        } catch (err) {
          console.error('Failed to resolve job client for stage update email:', err);
        }
      }

      // Insert in-dashboard notifications for floor coordinator & production leads (NO price leaks)
      try {
        await sb.from('notifications').insert([
          {
            target_role: 'mubasher',
            event_type: 'order_stage_update',
            job_no: num,
            title: `Job #${num}: ${stageKey.toUpperCase()}`,
            message: `Station [${stageKey}] changed to [${newStatus}] for Job #${num} (${lineItem.product || 'Apparel'}, ${lineItem.qty} pcs).`,
            is_urgent: false,
          },
          {
            target_role: 'hamza',
            event_type: 'order_stage_update',
            job_no: num,
            title: `Job #${num}: ${stageKey.toUpperCase()}`,
            message: `Station [${stageKey}] changed to [${newStatus}] for Job #${num} (${lineItem.product || 'Apparel'}, ${lineItem.qty} pcs).`,
            is_urgent: false,
          },
          {
            target_role: 'owner',
            event_type: 'order_stage_update',
            job_no: num,
            title: `Job #${num}: ${stageKey.toUpperCase()}`,
            message: `Station [${stageKey}] changed to [${newStatus}] for Job #${num} (${lineItem.product || 'Apparel'}, ${lineItem.qty} pcs).`,
            is_urgent: false,
          },
        ]);
      } catch {}

      // Log movement / audit
      try {
        await sb.from('activity_log').insert({
          job_id: lineItem.job_id,
          user_name: 'Muhammad Hafeez (Owner)',
          action: `Reverted stage [${stageKey}] to [${newStatus}] for Job #${num}`,
          role: 'owner',
        });
      } catch {}

      return NextResponse.json({ success: true, updatedItem });
    }

    // 2. Update job metadata (priority, delivery date)
    const updateData: any = {};
    if (priority) updateData.priority = priority;
    if (deliveryDate) updateData.delivery_date = deliveryDate;

    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date().toISOString();
      const { data: updatedJob, error: jobErr } = await sb
        .from('jobs')
        .update(updateData)
        .eq('job_no', num)
        .select()
        .single();

      if (jobErr) throw jobErr;
      return NextResponse.json({ success: true, job: updatedJob });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error updating job:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ jobNo: string }> }
) {
  try {
    const { jobNo } = await params;
    const num = parseInt(jobNo, 10);
    if (isNaN(num)) {
      return NextResponse.json({ success: false, message: 'Invalid job number' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'Deleted by Owner from Executive Dashboard';
    const sb = getAdminClient();

    // Soft delete the job
    const { data: deletedJob, error } = await sb
      .from('jobs')
      .update({
        deleted_at: new Date().toISOString(),
        delete_reason: reason,
      })
      .eq('job_no', num)
      .select()
      .single();

    if (error) throw error;

    // Log deletion
    try {
      await sb.from('activity_log').insert({
        action: `Job #${num} deleted by Owner. Reason: ${reason}`,
        user_name: 'Muhammad Hafeez (Owner)',
        role: 'owner',
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Job #${num} has been successfully deleted & archived.`,
      job: deletedJob,
    });
  } catch (err: any) {
    console.error('Error deleting job:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
