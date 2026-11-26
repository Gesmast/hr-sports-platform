import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { recordLoginEvent } from '@/lib/attendance';

function getRoleTitle(roleKey: string): string {
  const titles: Record<string, string> = {
    owner: 'Owner & Executive CEO',
    hamza: 'Operations Coordinator',
    usman: 'CAD Pattern & Design Lead',
    mubasher: 'Production In-Charge',
    ashfaq: 'Quality Department Lead (QC)',
    umair: 'Commercial & Accounts Lead',
    aamir: 'Store & Inventory Master',
  };
  return titles[roleKey?.toLowerCase()] || 'Authorized Staff';
}

function getDepartment(roleKey: string): string {
  const depts: Record<string, string> = {
    owner: 'Executive Management',
    hamza: 'Operations & Planning',
    usman: 'Textile CAD & Design',
    mubasher: 'Manufacturing Plant',
    ashfaq: 'Quality Assurance',
    umair: 'Commercials & Finance',
    aamir: 'Warehouse & Store',
  };
  return depts[roleKey?.toLowerCase()] || 'Operations';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    // 1. Email format check
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return NextResponse.json(
        {
          success: false,
          field: 'email',
          message: 'Please enter a valid work email address.',
        },
        { status: 400 }
      );
    }

    // 2. Blocked / restricted user check
    if (trimmedEmail === 'admin@site.com' || trimmedEmail === 'test@test.com') {
      return NextResponse.json(
        {
          success: false,
          field: 'email',
          message: 'This email is not permitted to access factory systems.',
        },
        { status: 403 }
      );
    }

    // 3. Password minimum length check
    if (!trimmedPassword || trimmedPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          field: 'password',
          message: 'Password must be at least 6 characters.',
        },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkbyeviilqdzlcvwndnd.supabase.co';
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      '';
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYnlldmlpbHFkemxjdnduZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDcxNjYsImV4cCI6MjEwNTkyMzE2Nn0.duG8tATITL7KCAP2I_fLl_IvRL-r-FZY-6y1dvyoahY';

    const adminClient = createClient(supabaseUrl, serviceKey);
    const authClient = createClient(supabaseUrl, anonKey);

    // 4. Verify user exists in database profiles
    const { data: profile, error: profileErr } = await adminClient
      .from('profiles')
      .select('*')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          field: 'email',
          message: 'This email is not registered in the HR Sports authorized staff roster.',
        },
        { status: 404 }
      );
    }

    // 5. Verify account is active
    if (profile.active === false) {
      return NextResponse.json(
        {
          success: false,
          field: 'general',
          message: 'This account has been deactivated. Please contact the Owner.',
        },
        { status: 403 }
      );
    }

    // 6. STRICT ACTUAL PASSWORD VERIFICATION against Supabase Auth
    const { data: authData, error: authErr } = await authClient.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (authErr || !authData.user) {
      console.error('[Login Auth Error]:', authErr);
      if (authErr && typeof authErr.status === 'number' && authErr.status >= 500) {
        return NextResponse.json(
          {
            success: false,
            field: 'general',
            message: `Authentication server error: ${authErr.message}`,
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          field: 'password',
          message: 'Incorrect password for this authorized account. Please check credentials.',
        },
        { status: 401 }
      );
    }

    // 7. Password verified! Build user profile from verified database records
    const finalProfile = {
      id: profile.id,
      name: profile.full_name || trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role: profile.role || 'owner',
      title: profile.title || getRoleTitle(profile.role),
      department: profile.department || getDepartment(profile.role),
      permissions: profile.permissions || [],
      description: 'Authenticated database account',
    };

    // 8. Record attendance on login
    try {
      recordLoginEvent({
        id: finalProfile.id,
        name: finalProfile.name,
        email: finalProfile.email,
        role: finalProfile.role,
      });

      // Synchronize live online presence and database attendance table
      await adminClient.rpc('staff_record_login', { p_user_id: finalProfile.id });
    } catch (attErr) {
      console.error('Attendance recording error on login:', attErr);
    }

    return NextResponse.json({
      success: true,
      user: finalProfile,
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/auth/login:', err);
    return NextResponse.json(
      {
        success: false,
        field: 'general',
        message: 'Authentication failed due to a server error. Please try again.',
      },
      { status: 500 }
    );
  }
}
