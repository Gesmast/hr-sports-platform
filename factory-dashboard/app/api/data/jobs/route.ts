import { NextResponse } from 'next/server';
import { getRealJobs, STAGES_ORDER } from '@/lib/supabase/data';
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

export async function GET() {
  const result = await getRealJobs(500);
  return NextResponse.json({
    ...result,
    count: result.totalCount,
  });
}

// Manual Job Entry (Design/Quotation Bypass) for Owner / Management
export async function POST(request: Request) {
  try {
    const sb = getAdminClient();
    const body = await request.json();

    const {
      job_no,
      party,
      client,
      product,
      order_qty,
      delivery_date,
      fabric,
      process_type,
      priority = 'Normal',
      created_by = 'Owner',
    } = body;

    if (!party || !product || !order_qty) {
      return NextResponse.json(
        { success: false, message: 'Party name, product, and quantity are required.' },
        { status: 400 }
      );
    }

    // Determine target job number (use supplied or suggest max + 1)
    let assignedJobNo = job_no ? parseInt(job_no, 10) : null;
    if (!assignedJobNo) {
      const { data: maxRow } = await sb
        .from('jobs')
        .select('job_no')
        .order('job_no', { ascending: false })
        .limit(1)
        .single();
      assignedJobNo = maxRow?.job_no ? maxRow.job_no + 1 : 1;
    }

    // Check duplicate job number
    const { data: existing } = await sb
      .from('jobs')
      .select('job_no')
      .eq('job_no', assignedJobNo)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, message: `Job #${assignedJobNo} already exists. Please choose another number.` },
        { status: 409 }
      );
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Create master Job record
    const { data: newJob, error: jobErr } = await sb
      .from('jobs')
      .insert({
        job_no: assignedJobNo,
        party: party.trim(),
        client: client ? client.trim() : null,
        order_date: todayStr,
        delivery_date: delivery_date || null,
        quotation_status: 'Approved', // Bypass sets pre-approved quotation
        billing_status: 'Bill Pending',
        priority: priority || 'Normal',
        created_by,
      })
      .select()
      .single();

    if (jobErr || !newJob) {
      return NextResponse.json(
        { success: false, message: jobErr?.message || 'Failed to create job.' },
        { status: 500 }
      );
    }

    // Default 10 stages: if Cut & Sew, Printing and HeatTransfer are marked Not Required
    const isCutAndSew = process_type === 'Cut & Sew';
    const isOnlyPrint = process_type === 'Only Print';

    const defaultStages: Record<string, any> = {};
    for (const st of STAGES_ORDER) {
      let status = 'Pending';
      if (isCutAndSew && (st === 'printing' || st === 'heatTransfer')) {
        status = 'Not Required';
      }
      if (isOnlyPrint && st !== 'cutting' && st !== 'printing') {
        status = 'Not Required';
      }
      defaultStages[st] = {
        _v: 1,
        status,
        completedQty: 0,
      };
    }

    // Create initial Job Line Item
    const { data: newLineItem, error: itemErr } = await sb
      .from('job_line_items')
      .insert({
        job_id: newJob.id,
        job_no: assignedJobNo,
        product: product.trim(),
        qty: parseInt(order_qty, 10),
        fabric: fabric ? fabric.trim() : null,
        process_type: process_type || 'Sublimation',
        stages: defaultStages,
      })
      .select()
      .single();

    if (itemErr) {
      console.error('Error inserting job line item:', itemErr);
    }

    return NextResponse.json({
      success: true,
      message: `Job #${assignedJobNo} created successfully.`,
      job: {
        ...newJob,
        items: newLineItem ? [newLineItem] : [],
      },
    });
  } catch (err: any) {
    console.error('Error in POST /api/data/jobs:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error creating job.' },
      { status: 500 }
    );
  }
}
