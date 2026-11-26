import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/portal';

  // Determine true public origin
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host') || 'thehrsports.com';
  
  // Guard against falling back to internal localhost proxy when accessed on live domain
  const isLocalEnv = process.env.NODE_ENV === 'development' && (host.includes('localhost') || host.includes('127.0.0.1'));
  const origin = isLocalEnv 
    ? `http://${host}` 
    : (host.includes('localhost') ? (process.env.NEXT_PUBLIC_APP_URL || 'https://thehrsports.com') : `https://${host}`);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const destination = next.startsWith('/') ? next : `/${next}`;
      return NextResponse.redirect(`${origin}${destination}`);
    }
    console.error('Auth code exchange error:', error);
  }

  // Return the user to login with error details
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
}
