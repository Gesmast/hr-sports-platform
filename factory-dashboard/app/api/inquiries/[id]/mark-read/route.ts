import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkbyeviilqdzlcvwndnd.supabase.co';
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYnlldmlpbHFkemxjdnduZG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM0NzE2NiwiZXhwIjoyMTA1OTIzMTY2fQ.ES31Zo4-DcTXwoyL8_dKFRuAdKBSzqE4AYyLAERm0Eg';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inquiryId } = await params;
    const body = await request.json().catch(() => ({}));
    const { staffId, role } = body;

    if (!staffId || !role) {
      return NextResponse.json({ error: 'staffId and role are required' }, { status: 400 });
    }

    // Strictly only the assigned Designer ('usman') or Accounts ('umair') triggers read receipt (Blue Tick)
    // The Owner ('owner' - reviewer) and Operations Coordinator ('hamza') do NOT trigger the blue tick.
    if (role !== 'usman' && role !== 'umair') {
      return NextResponse.json({
        success: true,
        messages_marked_read: 0,
        skipped: true,
        reason: 'Only Designer or Accounts triggers read receipt',
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Call stored procedure to mark client messages as read
    const { data, error } = await supabase.rpc('mark_inquiry_messages_read', {
      p_inquiry_id: inquiryId,
      p_staff_id: staffId,
      p_role: role,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
