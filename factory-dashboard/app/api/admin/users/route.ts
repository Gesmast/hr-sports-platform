import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { syncMailboxPassword, createMailbox, setMailboxStatus } from '@/lib/mailcow';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, role, department, title, active, permissions, created_at, updated_at')
      // Exclude client accounts — this page is for internal company staff only
      .in('role', ['owner', 'hamza', 'usman', 'umair', 'mubasher', 'ashfaq', 'cutter', 'printer', 'heat_transfer', 'heatpress', 'aamir'])
      .order('email', { ascending: true });

    if (error) {
      console.error('Error fetching staff profiles:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Role priority ordering for cleaner presentation
    const rolePriority: Record<string, number> = {
      owner: 1,
      hamza: 2,
      usman: 3,
      umair: 4,
      mubasher: 5,
      ashfaq: 6,
      cutter: 7,
      printer: 8,
      heat_transfer: 9,
      heatpress: 9,
      aamir: 10,
    };

    const sortedUsers = (data || []).sort((a, b) => {
      const pA = rolePriority[a.role] || 99;
      const pB = rolePriority[b.role] || 99;
      if (pA !== pB) return pA - pB;
      return a.email.localeCompare(b.email);
    });

    return NextResponse.json({ users: sortedUsers });
  } catch (err: any) {
    console.error('Unexpected error in GET /api/admin/users:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, fullName, password, permissions, active, role, title, department } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (fullName !== undefined) updates.full_name = fullName.trim();
    if (permissions !== undefined) updates.permissions = permissions;
    if (active !== undefined) updates.active = Boolean(active);
    if (role !== undefined) updates.role = role;
    if (title !== undefined) updates.title = title;
    if (department !== undefined) updates.department = department;

    // 1. Password update via admin_set_user_password RPC without any policy constraints
    if (password && typeof password === 'string' && password.length > 0) {
      const { data: rpcSuccess, error: rpcError } = await supabaseAdmin.rpc('admin_set_user_password', {
        p_user_id: userId,
        p_new_password: password,
      });

      if (rpcError || !rpcSuccess) {
        console.error('Error updating password via admin_set_user_password RPC:', rpcError);
        return NextResponse.json(
          { error: rpcError ? rpcError.message : 'Failed to update user password' },
          { status: 400 }
        );
      }

      // Immediately invalidate any active browser sessions across all devices
      try {
        await supabaseAdmin.rpc('revoke_user_sessions', { p_user_id: userId });
      } catch (revErr) {
        console.warn('Notice: session revocation error:', revErr);
      }

      updates.password_changed_at = new Date().toISOString();
    }

    // 2. Sync user_metadata into auth.users if name or title updated
    if (fullName !== undefined || title !== undefined || department !== undefined) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            full_name: fullName !== undefined ? fullName.trim() : undefined,
            title: title !== undefined ? title : undefined,
            department: department !== undefined ? department : undefined,
          },
        });
      } catch (metaErr) {
        console.warn('Notice: auth metadata sync error:', metaErr);
      }
    }

    // 3. If deactivated, revoke active sessions immediately
    if (active === false) {
      try {
        await supabaseAdmin.rpc('revoke_user_sessions', { p_user_id: userId });
      } catch (revErr) {
        console.warn('Notice: deactivation session revocation error:', revErr);
      }
    }

    // 4. Profile table update
    const { data: updatedProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, email, full_name, role, department, title, active, permissions, updated_at')
      .single();

    if (profileError) {
      console.error('Error updating profile in Supabase:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 5. Sync password and active status to Mailcow enterprise mail server in real-time
    if (updatedProfile?.email) {
      if (password && typeof password === 'string' && password.length > 0) {
        try {
          await syncMailboxPassword(updatedProfile.email, password);
        } catch (mErr) {
          console.warn('[Mailcow Sync Warning] Failed to update password in Mailcow:', mErr);
        }
      }
      if (active !== undefined) {
        try {
          await setMailboxStatus(updatedProfile.email, Boolean(active));
        } catch (mErr) {
          console.warn('[Mailcow Sync Warning] Failed to update active status in Mailcow:', mErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Staff user profile updated successfully',
      user: updatedProfile,
    });
  } catch (err: any) {
    console.error('Unexpected error in PATCH /api/admin/users:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Revoke all active sessions first
    try {
      await supabaseAdmin.rpc('revoke_user_sessions', { p_user_id: userId });
    } catch (revErr) {
      console.warn('Notice: session revocation before delete failed:', revErr);
    }

    // 2. Delete from auth.users (cascades to auth.sessions, auth.refresh_tokens)
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError);
      return NextResponse.json({ error: authDeleteError.message }, { status: 500 });
    }

    // 3. Delete from public.profiles (should cascade but do it explicitly for safety)
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteError) {
      console.warn('Note: profile row delete error (auth user already removed):', profileDeleteError);
    }

    return NextResponse.json({ success: true, message: 'User removed successfully' });
  } catch (err: any) {
    console.error('Unexpected error in DELETE /api/admin/users:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// POST endpoint to create a new user account with any email address
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, role, permissions, department, title } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, fullName, and role are required' },
        { status: 400 }
      );
    }

    // 1. Create auth user with temporary compliant password to satisfy GoTrue policy
    const tempPassword = `HR$p0rt${Date.now()}!Aa`;
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        role: role,
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError ? authError.message : 'Failed to create auth user' },
        { status: 400 }
      );
    }

    const newUserId = authData.user.id;

    // Set actual requested password (no matter how short or custom) via admin_set_user_password RPC
    const { error: setPwdErr } = await supabaseAdmin.rpc('admin_set_user_password', {
      p_user_id: newUserId,
      p_new_password: password,
    });

    if (setPwdErr) {
      console.warn('Notice: admin_set_user_password error during create:', setPwdErr);
    }

    // 2. Insert into profiles table
    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUserId,
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        role: role,
        department: department || null,
        title: title || null,
        active: true,
        permissions: permissions || [],
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 3. Provision enterprise mailbox in Mailcow in real-time
    if (email.trim().toLowerCase().endsWith('@thehrsports.com')) {
      try {
        await createMailbox(fullName.trim(), email.trim().toLowerCase(), password);
      } catch (mErr) {
        console.warn('[Mailcow Provision Warning] Failed to provision mailbox:', mErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'New staff user account created successfully',
      user: newProfile,
    });
  } catch (err: any) {
    console.error('Unexpected error in POST /api/admin/users:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
