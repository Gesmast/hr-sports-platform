import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Check standard CDN / Edge Geolocation headers (Cloudflare, Vercel, AWS CloudFront, Fastly)
    const headerCountry =
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cloudfront-viewer-country') ||
      req.headers.get('x-country-code');

    // Next.js request geo (if supported in runtime)
    const geoCountry = (req as any).geo?.country;

    const country = (headerCountry || geoCountry || null)?.toUpperCase();

    // Reject unknown or private/tor country codes like 'XX', 'T1', etc.
    if (country && country.length === 2 && country !== 'XX' && country !== 'T1') {
      return NextResponse.json({ country });
    }

    return NextResponse.json({ country: null });
  } catch {
    return NextResponse.json({ country: null });
  }
}
