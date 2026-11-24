import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: inquiryId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'staff';

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

    // Call stored procedure to mark client messages as read
    const { data, error } = await supabase.rpc('mark_inquiry_messages_read', {
      p_inquiry_id: inquiryId,
      p_staff_id: user.id,
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
