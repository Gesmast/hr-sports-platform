import { NextRequest, NextResponse } from 'next/server';
import { generateCountdownGif } from '@/lib/email/countdown-generator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const expiresParam = searchParams.get('expires');

    let expiryDate = new Date();
    if (expiresParam) {
      const parsed = new Date(expiresParam);
      if (!isNaN(parsed.getTime())) {
        expiryDate = parsed;
      } else {
        // Fallback: 24h from now
        expiryDate = new Date(Date.now() + 24 * 3600 * 1000);
      }
    } else {
      expiryDate = new Date(Date.now() + 24 * 3600 * 1000);
    }

    const gifBuffer = generateCountdownGif(expiryDate);

    return new NextResponse(new Uint8Array(gifBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (err: any) {
    console.error('[CountdownGIF Error]:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
