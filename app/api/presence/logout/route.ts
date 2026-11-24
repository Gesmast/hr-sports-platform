import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: true, note: 'No user session' });
    }

    let sessionId: string | null = null;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      sessionId = body.session_id || null;
    } else {
      const text = await request.text().catch(() => '');
      try {
        const parsed = JSON.parse(text);
        sessionId = parsed.session_id || null;
      } catch {
        sessionId = text.trim() || null;
      }
    }

    const { data, error } = await supabase.rpc('staff_record_logout', {
      p_user_id: user.id,
      p_session_id: sessionId || 'default',
    });

    if (error) {
      console.error('Error recording staff logout:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
