import { NextResponse } from 'next/server';
import { getAllAttendanceSessions, recordLoginEvent, recordLogoutEvent } from '@/lib/attendance';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkbyeviilqdzlcvwndnd.supabase.co';
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

function getAdminClient() {
  return createClient(supabaseUrl, serviceKey);
}

export async function GET() {
  try {
    const sessions = getAllAttendanceSessions();
    return NextResponse.json({ success: true, sessions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const { action, userId, userName, email, role } = body;

    const supabase = getAdminClient();

    if (action === 'heartbeat') {
      if (userId) {
        await supabase.rpc('staff_record_heartbeat', { p_user_id: userId });

        // Verify account is still active and credentials have not been invalidated
        const { data: profile } = await supabase
          .from('profiles')
          .select('active, password_changed_at')
          .eq('id', userId)
          .maybeSingle();

        if (profile) {
          if (profile.active === false) {
            return NextResponse.json({
              success: true,
              valid: false,
              reason: 'deactivated',
              message: 'Your account has been deactivated by the administrator.'
            });
          }

          const { sessionStart } = body;
          if (sessionStart && profile.password_changed_at) {
            if (new Date(profile.password_changed_at).getTime() > new Date(sessionStart).getTime()) {
              return NextResponse.json({
                success: true,
                valid: false,
                reason: 'password_reset',
                message: 'Your password was recently updated by an administrator. Please sign in again.'
              });
            }
          }
        }
      }
      return NextResponse.json({ success: true, valid: true });
    }

    if (action === 'login') {
      const session = recordLoginEvent({ id: userId, name: userName, email, role });

      try {
        await supabase.rpc('staff_record_login', { p_user_id: userId });
        await supabase.from('activity_log').insert({
          by_user: userName,
          role: role,
          entity_type: 'attendance',
          entity_id: userId,
          field: 'login',
          message: `👤 ${userName} (${role}) signed in at ${session.loginTime}`,
          client_date: session.date,
          client_time: session.loginTime,
        });
      } catch (e) {
        console.error('Attendance login sync error:', e);
      }

      return NextResponse.json({ success: true, session });
    }

    if (action === 'logout') {
      const session = recordLogoutEvent(userId);

      try {
        if (userId) {
          await supabase.rpc('staff_record_logout', { p_user_id: userId });
        }
        if (session) {
          await supabase.from('activity_log').insert({
            by_user: session.userName,
            role: session.role,
            entity_type: 'attendance',
            entity_id: userId,
            field: 'logout',
            message: `🚪 ${session.userName} (${session.role}) signed out at ${session.logoutTime} (Shift: ${session.durationMinutes} mins)`,
            client_date: session.date,
            client_time: session.logoutTime || '',
          });
        }
      } catch (e) {
        console.error('Attendance logout sync error:', e);
      }

      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in /api/attendance', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
