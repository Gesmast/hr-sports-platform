import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const sessionId = body.session_id || crypto.randomUUID();
    const deviceInfo = body.device_info || request.headers.get('user-agent') || 'Browser';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Record login in staff_attendance via RPC
    const { data, error } = await supabase.rpc('staff_record_login', {
      p_user_id: user.id,
      p_session_id: sessionId,
      p_device_info: deviceInfo.slice(0, 200),
      p_ip_address: ipAddress,
    });

    if (error) {
      console.error('Error recording staff login:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, session_id: sessionId, data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
