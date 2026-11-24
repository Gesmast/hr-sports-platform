import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use supabase.auth.getSession() in middleware as it is not secure.
  // Always use supabase.auth.getUser() to re-verify the user session on every request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Protected Portal Routes
  if (pathname.startsWith('/portal')) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. Auth Routes (prevent authenticated users from seeing login/signup again)
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password';

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  return response;
}
