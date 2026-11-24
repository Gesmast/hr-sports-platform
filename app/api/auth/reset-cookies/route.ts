import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/portal', request.url));
  const cookies = request.cookies.getAll();

  for (const cookie of cookies) {
    if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase') || cookie.name.includes('auth')) {
      response.cookies.delete(cookie.name);
    }
  }

  return response;
}
