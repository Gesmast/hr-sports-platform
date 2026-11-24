import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

// Floor roles that must NEVER see commercial pricing
const FLOOR_ROLES = new Set([
  'cutter',
  'printer',
  'heat_transfer',
  'heatpress',
  'mubasher',
  'ashfaq',
  'aamir',
  'supervisor',
]);

/**
 * Strips out dollar amounts, unit rates, and sensitive financial figures for shop floor roles
 */
function sanitizeForFloorRole(text: string | null | undefined): string {
  if (!text) return '';
  // Redact currency amounts like $12.50, $150, USD 450, etc.
  return text
    .replace(/\$\s*[\d,]+(\.\d{1,2})?(\s*\/\s*unit)?/gi, '[CONFIDENTIAL RATE]')
    .replace(/USD\s*[\d,]+(\.\d{1,2})?/gi, '[CONFIDENTIAL RATE]')
    .replace(/Total:\s*\$\s*[\d,]+(\.\d{1,2})?/gi, 'Total: [CONFIDENTIAL]');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const sb = getAdminClient();
    let query = sb
      .from('notifications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    // If role is not owner, filter by role/user or broadcast (target_role IS NULL)
    if (role && role !== 'owner') {
      if (userId) {
        query = query.or(`target_role.is.null,target_role.eq.${role},target_user_id.eq.${userId}`);
      } else {
        query = query.or(`target_role.is.null,target_role.eq.${role}`);
      }
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error.message);
      return NextResponse.json({ notifications: [], count: 0, unreadCount: 0 });
    }

    const isFloorRole = role ? FLOOR_ROLES.has(role.toLowerCase()) : false;

    const sanitized = (data || []).map((n: any) => {
      let title = n.title || n.event_type?.replace(/_/g, ' ')?.toUpperCase() || 'OPERATIONAL UPDATE';
      let message = n.message || '';

      if (isFloorRole) {
        title = sanitizeForFloorRole(title);
        message = sanitizeForFloorRole(message);
      }

      return {
        ...n,
        title,
        message,
        read: Boolean(n.read_at),
      };
    });

    const unreadCount = sanitized.filter((n: any) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications: sanitized,
      count: count || sanitized.length,
      unreadCount,
    });
  } catch (err: any) {
    console.error('Unexpected error in notifications GET:', err);
    return NextResponse.json({ notifications: [], count: 0, unreadCount: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      target_role = 'owner',
      target_user_id = null,
      event_type = 'urgent_alert',
      title = '🚨 URGENT OWNER ALERT: High-Value Quote Awaiting Sign-Off',
      message = 'Inquiry PAK-00002 (NexGenSim, 50 Pro Kits, $1,125 USD) is awaiting Owner quotation sign-off before client deposit.',
      customer_name = 'Shahmeer Adnan',
      company_name = 'NexGenSim',
      request_no = 'PAK-00002',
      job_no = null,
      inquiry_id = null,
      job_id = null,
      stage = 'quotation',
      is_urgent = true,
    } = body;

    const sb = getAdminClient();
    const { data, error } = await sb
      .from('notifications')
      .insert({
        target_role,
        target_user_id,
        event_type,
        title,
        message,
        customer_name,
        company_name,
        request_no,
        job_no,
        inquiry_id,
        job_id,
        stage,
        is_urgent: Boolean(is_urgent),
        read_at: null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting notification:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification: data });
  } catch (err: any) {
    console.error('Error in notifications POST:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { action, id, ids, role, userId } = body;
    const sb = getAdminClient();
    const nowIso = new Date().toISOString();

    if (action === 'mark_read' && id) {
      const { error } = await sb
        .from('notifications')
        .update({ read_at: nowIso })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Notification marked as read.' });
    }

    if (action === 'batch_mark_read' && Array.isArray(ids) && ids.length > 0) {
      const { error } = await sb
        .from('notifications')
        .update({ read_at: nowIso })
        .in('id', ids);

      if (error) throw error;
      return NextResponse.json({ success: true, message: `${ids.length} notifications marked as read.` });
    }

    if (action === 'mark_all_read') {
      let query = sb
        .from('notifications')
        .update({ read_at: nowIso })
        .is('read_at', null);

      if (role && role !== 'owner') {
        if (userId) {
          query = query.or(`target_role.is.null,target_role.eq.${role},target_user_id.eq.${userId}`);
        } else {
          query = query.or(`target_role.is.null,target_role.eq.${role}`);
        }
      }

      const { error } = await query;
      if (error) throw error;

      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in notifications PATCH:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    let deleteIds: string[] = [];
    if (request.headers.get('content-type')?.includes('application/json')) {
      try {
        const body = await request.json();
        if (body.ids && Array.isArray(body.ids)) deleteIds = body.ids;
        if (body.id) deleteIds.push(body.id);
      } catch {}
    }
    const paramIds = searchParams.get('ids');
    if (paramIds) {
      deleteIds = [...deleteIds, ...paramIds.split(',').filter(Boolean)];
    }

    const sb = getAdminClient();

    if (deleteIds.length > 0) {
      const { error } = await sb.from('notifications').delete().in('id', deleteIds);
      if (error) throw error;
      return NextResponse.json({ success: true, message: `${deleteIds.length} notifications deleted.` });
    }

    if (id) {
      const { error } = await sb.from('notifications').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Notification deleted.' });
    }

    if (action === 'delete_read') {
      let query = sb.from('notifications').delete().not('read_at', 'is', null);
      if (role && role !== 'owner') {
        if (userId) {
          query = query.or(`target_role.is.null,target_role.eq.${role},target_user_id.eq.${userId}`);
        } else {
          query = query.or(`target_role.is.null,target_role.eq.${role}`);
        }
      }
      const { error } = await query;
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Read notifications cleared.' });
    }

    if (action === 'delete_all') {
      let query = sb.from('notifications').delete();
      if (role && role !== 'owner') {
        if (userId) {
          query = query.or(`target_role.is.null,target_role.eq.${role},target_user_id.eq.${userId}`);
        } else {
          query = query.or(`target_role.is.null,target_role.eq.${role}`);
        }
      } else {
        query = query.not('id', 'is', null);
      }
      const { error } = await query;
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'All notifications cleared.' });
    }

    return NextResponse.json({ success: false, message: 'Invalid delete request' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in notifications DELETE:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
