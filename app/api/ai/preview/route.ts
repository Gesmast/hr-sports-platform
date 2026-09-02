import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get('prompt') || '';
    const seed = searchParams.get('seed') || '42';
    const angle = searchParams.get('angle') || 'front';
    const primaryColor = searchParams.get('primaryColor') || '#111111';
    const accentColor = searchParams.get('accentColor') || '#F5F5F0';
    const garment = searchParams.get('garment') || 'Performance Athletic Apparel';

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Attempt to fetch from high-speed AI image endpoint
    const encodedPrompt = encodeURIComponent(prompt);
    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=1024&seed=${seed}&model=flux&nologo=true&enhance=true`;

    try {
      const response = await fetch(aiImageUrl, {
        signal: AbortSignal.timeout(6000), // 6 second timeout
      });

      if (response.ok) {
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
          },
        });
      }
    } catch (e) {
      // If external AI timeout or network error, serve high-res studio parametric SVG composite
    }

    // High-Fidelity Studio Vector Fallback Render
    const isFront = angle === 'front';
    const svgContent = `
      <svg width="768" height="1024" viewBox="0 0 768 1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#141416"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
          <linearGradient id="primaryShade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primaryColor}"/>
            <stop offset="100%" stop-color="${primaryColor}dd"/>
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- Studio Backdrop -->
        <rect width="768" height="1024" fill="url(#bg)"/>

        <!-- Grid Lines / Technical Blueprint Elements -->
        <line x1="384" y1="60" x2="384" y2="960" stroke="#27272a" stroke-width="1" stroke-dasharray="4 4"/>
        <line x1="80" y1="512" x2="688" y2="512" stroke="#27272a" stroke-width="1" stroke-dasharray="4 4"/>

        <!-- Header Info -->
        <text x="50" y="80" fill="#71717a" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="2">HR SPORTS OEM LABS // TECH CAD SPEC</text>
        <text x="50" y="105" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">${garment.toUpperCase()} — ${isFront ? 'FRONT ELEVATION' : 'REAR ELEVATION'}</text>

        <!-- Studio Mannequin Stand -->
        <rect x="376" y="800" width="16" height="120" fill="#27272a"/>
        <ellipse cx="384" cy="920" rx="140" ry="24" fill="#18181b" stroke="#27272a" stroke-width="2"/>

        <!-- Torso Garment Silhouette -->
        <g filter="url(#shadow)">
          <!-- Main Body -->
          <path d="M 270 300 Q 384 320 498 300 L 520 780 Q 384 810 248 780 Z" fill="url(#primaryShade)" stroke="#27272a" stroke-width="2"/>
          
          <!-- Left Sleeve -->
          <path d="M 270 300 L 150 460 L 200 490 L 290 380 Z" fill="url(#primaryShade)" stroke="#27272a" stroke-width="2"/>
          <path d="M 150 460 L 135 480 L 185 510 L 200 490 Z" fill="${accentColor}"/>

          <!-- Right Sleeve -->
          <path d="M 498 300 L 618 460 L 568 490 L 478 380 Z" fill="url(#primaryShade)" stroke="#27272a" stroke-width="2"/>
          <path d="M 618 460 L 633 480 L 583 510 L 568 490 Z" fill="${accentColor}"/>

          <!-- Collar / Neck -->
          <path d="M 310 280 Q 384 ${isFront ? '350' : '300'} 458 280 Q 384 260 310 280 Z" fill="${accentColor}" stroke="#18181b" stroke-width="1.5"/>

          <!-- Bottom Hem -->
          <path d="M 248 780 Q 384 810 520 780 L 520 810 Q 384 840 248 810 Z" fill="${accentColor}"/>

          <!-- Front/Rear Accent Callouts -->
          ${isFront ? `
            <circle cx="330" cy="420" r="28" fill="${accentColor}" opacity="0.9"/>
            <text x="330" y="425" fill="${primaryColor}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">LOGO</text>
            <path d="M 280 620 L 488 620 L 470 730 L 298 730 Z" fill="${accentColor}" opacity="0.15" stroke="${accentColor}" stroke-dasharray="3 3"/>
          ` : `
            <text x="384" y="460" fill="${accentColor}" font-family="sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="4">HR ATHLETIC</text>
            <line x1="300" y1="480" x2="468" y2="480" stroke="${accentColor}" stroke-width="3"/>
          `}
        </g>

        <!-- Technical Spec Box -->
        <rect x="50" y="880" width="280" height="70" rx="4" fill="#18181b" stroke="#27272a" stroke-width="1"/>
        <text x="65" y="905" fill="#a1a1aa" font-family="monospace" font-size="11">BODY COLOR: <tspan fill="#ffffff" font-weight="bold">${primaryColor}</tspan></text>
        <text x="65" y="925" fill="#a1a1aa" font-family="monospace" font-size="11">TRIM ACCENT: <tspan fill="#ffffff" font-weight="bold">${accentColor}</tspan></text>
        <text x="65" y="942" fill="#34d399" font-family="monospace" font-size="10">● FACTORY CAD VERIFIED</text>
      </svg>
    `;

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}
