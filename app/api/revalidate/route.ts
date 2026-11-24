import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path') || '/';

    // Verify secret token
    const validSecret = process.env.REVALIDATE_SECRET || 'hrsports_theme_revalidate_2026';
    if (secret !== validSecret) {
      return NextResponse.json({ success: false, message: 'Invalid revalidation secret' }, { status: 401 });
    }

    revalidatePath(path);
    return NextResponse.json({
      success: true,
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
