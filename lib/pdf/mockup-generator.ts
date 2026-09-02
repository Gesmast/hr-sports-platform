import { GarmentSpecType, LogoPlacementType } from '@/lib/schemas/quote';

interface MockupColors {
  body: string;
  sleeves: string;
  collar: string;
  trim: string;
  piping: string;
  innerNeck: string;
}

/**
 * Extracts and normalizes colors from garment and quote settings.
 */
export function resolveGarmentColors(
  garment: GarmentSpecType,
  primaryFallback: string = '#FAF7EB',
  accentFallback: string = '#FFFFFF'
): MockupColors {
  // Check if colour_value contains hex or name
  let bodyColor = primaryFallback;
  const rawCol = (garment.colour_value || '').trim();

  const hexMatch = rawCol.match(/#(?:[0-9a-fA-F]{3}){1,2}/);
  if (hexMatch) {
    bodyColor = hexMatch[0];
  } else if (rawCol.toLowerCase().includes('cream') || rawCol.toLowerCase().includes('sap')) {
    bodyColor = '#FAF6EA';
  } else if (rawCol.toLowerCase().includes('white')) {
    bodyColor = '#FFFFFF';
  } else if (rawCol.toLowerCase().includes('black')) {
    bodyColor = '#18181B';
  } else if (rawCol.toLowerCase().includes('blue') || rawCol.toLowerCase().includes('cobalt')) {
    bodyColor = '#1D4ED8';
  } else if (rawCol.toLowerCase().includes('red')) {
    bodyColor = '#DC2626';
  } else if (rawCol.toLowerCase().includes('green')) {
    bodyColor = '#059669';
  } else if (rawCol.toLowerCase().includes('grey') || rawCol.toLowerCase().includes('gray')) {
    bodyColor = '#71717A';
  } else if (rawCol.toLowerCase().includes('navy')) {
    bodyColor = '#0F172A';
  } else if (rawCol.toLowerCase().includes('yellow') || rawCol.toLowerCase().includes('gold')) {
    bodyColor = '#EAB308';
  }

  // Sleeves / contrast color
  let sleevesColor = accentFallback;
  if (bodyColor === '#FAF6EA' || bodyColor === '#FAF7EB') {
    sleevesColor = '#FFFFFF';
  } else if (bodyColor === '#18181B') {
    sleevesColor = '#27272A';
  } else if (bodyColor === '#FFFFFF') {
    sleevesColor = '#F4F4F5';
  }

  return {
    body: bodyColor,
    sleeves: sleevesColor,
    collar: '#FFFFFF',
    trim: '#E4E4E7',
    piping: '#EAB308', // Sporty yellow / contrast accent piping
    innerNeck: '#3F3F46',
  };
}

/**
 * Generates an ultra-crisp, professional 3-view SVG vector illustration (Front, Side, Back)
 * matching the Bahrain Cricket OMTEX spec sheet layout.
 */
export function generateTopMockupSvg(
  garment: GarmentSpecType,
  playerName: string = 'MUKHIA',
  playerNumber: string = '18',
  options?: {
    primaryColor?: string;
    accentColor?: string;
    width?: number;
    height?: number;
  }
): string {
  const colors = resolveGarmentColors(garment, options?.primaryColor, options?.accentColor);
  const width = options?.width || 800;
  const height = options?.height || 360;

  // Find logos for specific positions
  const getLogo = (slot: string): LogoPlacementType | undefined => {
    return garment.logo_placements?.find((lp) => lp.slot.toLowerCase() === slot.toLowerCase());
  };

  const rightChestLogo = getLogo('right_chest');
  const leftChestLogo = getLogo('left_chest');
  const stomachLogo = getLogo('stomach');
  const leftShoulderLogo = getLogo('left_shoulder_top');
  const rightShoulderLogo = getLogo('right_shoulder_top');
  const backNeckLogo = getLogo('back_below_neck') || getLogo('back_above_name_no');

  const collarType = (garment.collar_type || 'Collar').toLowerCase();
  const isPolo = collarType.includes('polo') || collarType.includes('collar');
  const isVNeck = collarType.includes('v-neck');

  // SVG Helper to render embedded image logo safely
  const renderLogoImage = (
    logo: LogoPlacementType | undefined,
    x: number,
    y: number,
    w: number,
    h: number
  ): string => {
    if (!logo || !logo.image_url) return '';
    return `<image href="${logo.image_url}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" />`;
  };

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Side Panel Athletic Mesh Pattern -->
    <pattern id="meshPattern" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#94A3B8" stroke-width="0.8" stroke-opacity="0.4" />
      <line x1="0" y1="0" x2="6" y2="0" stroke="#CBD5E1" stroke-width="0.6" stroke-opacity="0.3" />
    </pattern>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-opacity="0.1" />
    </filter>
  </defs>

  <g transform="translate(10, 10)">
    <!-- =================================================================== -->
    <!-- VIEW 1: FRONT ELEVATION (Left)                                      -->
    <!-- =================================================================== -->
    <g id="frontView" transform="translate(20, 10)" filter="url(#shadow)">
      <!-- Left & Right Raglan Sleeves -->
      <!-- Left Sleeve (Viewer's Left = Garment Right Sleeve) -->
      <path d="M 75,45 L 20,95 C 15,115 12,135 10,155 L 48,168 C 54,140 60,110 70,88 Z" 
            fill="${colors.sleeves}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>
      <!-- Left Sleeve Cuff Inner Shadow -->
      <path d="M 10,155 C 22,165 36,170 48,168 L 48,162 C 36,164 22,159 10,149 Z" fill="#64748B" opacity="0.3"/>

      <!-- Right Sleeve (Viewer's Right = Garment Left Sleeve) -->
      <path d="M 175,45 L 230,95 C 235,115 238,135 240,155 L 202,168 C 196,140 190,110 180,88 Z" 
            fill="${colors.sleeves}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>
      <!-- Right Sleeve Cuff Inner Shadow -->
      <path d="M 240,155 C 228,165 214,170 202,168 L 202,162 C 214,164 228,159 240,149 Z" fill="#64748B" opacity="0.3"/>

      <!-- Main Body -->
      <path d="M 75,45 
               C 95,50 155,50 175,45 
               L 180,88 
               L 185,275 
               C 155,282 95,282 65,275 
               L 70,88 Z" 
            fill="${colors.body}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- Contrast Side Panels with Mesh Texture & Piping -->
      <!-- Left Side Panel (Viewer's Left) -->
      <path d="M 70,88 L 65,275 L 75,276 L 80,92 Z" fill="${colors.sleeves}" stroke="#64748B" stroke-width="0.8"/>
      <path d="M 70,88 L 65,275 L 75,276 L 80,92 Z" fill="url(#meshPattern)"/>
      <line x1="80" y1="92" x2="75" y2="276" stroke="${colors.piping}" stroke-width="1.5"/>

      <!-- Right Side Panel (Viewer's Right) -->
      <path d="M 180,88 L 185,275 L 175,276 L 170,92 Z" fill="${colors.sleeves}" stroke="#64748B" stroke-width="0.8"/>
      <path d="M 180,88 L 185,275 L 175,276 L 170,92 Z" fill="url(#meshPattern)"/>
      <line x1="170" y1="92" x2="175" y2="276" stroke="${colors.piping}" stroke-width="1.5"/>

      <!-- Raglan Seams -->
      <line x1="75" y1="45" x2="80" y2="92" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="175" y1="45" x2="170" y2="92" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Collar & Neckline Styling -->
      ${
        isPolo
          ? `
        <!-- Polo Collar Inner Neck & Size Label -->
        <path d="M 98,38 C 112,46 138,46 152,38 C 145,54 105,54 98,38 Z" fill="${colors.innerNeck}"/>
        <rect x="120" y="42" width="10" height="7" fill="#FFFFFF" rx="1"/>
        <circle cx="125" cy="45.5" r="1.5" fill="#DC2626"/>

        <!-- Button Placket -->
        <path d="M 119,48 L 131,48 L 131,90 L 125,95 L 119,90 Z" fill="#FFFFFF" stroke="#334155" stroke-width="1"/>
        <line x1="125" y1="48" x2="125" y2="92" stroke="#CBD5E1" stroke-width="0.8"/>
        <!-- Kaaj Buttons -->
        <circle cx="125" cy="58" r="2.2" fill="#FFFFFF" stroke="#475569" stroke-width="1"/>
        <circle cx="125" cy="74" r="2.2" fill="#FFFFFF" stroke="#475569" stroke-width="1"/>

        <!-- Left & Right Folded Collar Flaps -->
        <path d="M 96,36 C 88,18 115,14 125,28 C 112,40 102,68 118,72 L 122,48 C 110,42 102,38 96,36 Z" 
              fill="${colors.collar}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M 154,36 C 162,18 135,14 125,28 C 138,40 148,68 132,72 L 128,48 C 140,42 148,38 154,36 Z" 
              fill="${colors.collar}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>
        `
          : isVNeck
          ? `
        <!-- V-Neck Ribbed Collar -->
        <path d="M 95,35 L 125,75 L 155,35 C 140,44 110,44 95,35 Z" fill="${colors.collar}" stroke="#334155" stroke-width="1.2"/>
        `
          : `
        <!-- Crew Neck Ribbed Collar -->
        <path d="M 95,36 C 110,58 140,58 155,36 C 142,48 108,48 95,36 Z" fill="${colors.collar}" stroke="#334155" stroke-width="1.2"/>
        `
      }

      <!-- Bottom Hem -->
      <path d="M 65,275 C 95,282 155,282 185,275" fill="none" stroke="#334155" stroke-width="1.2"/>
      <path d="M 66,270 C 95,277 155,277 184,270" fill="none" stroke="#64748B" stroke-width="0.8" stroke-dasharray="3,2"/>

      <!-- DIRECT LOGO OVERLAYS ON FRONT VIEW -->
      <!-- Right Chest Logo (Viewer's Left) -->
      ${
        rightChestLogo?.image_url
          ? renderLogoImage(rightChestLogo, 86, 92, 28, 28)
          : `<g transform="translate(90, 94)">
               <circle cx="10" cy="10" r="9" fill="#FEF08A" stroke="#CA8A04" stroke-width="0.8"/>
               <line x1="5" y1="5" x2="15" y2="15" stroke="#CA8A04" stroke-width="1"/>
               <line x1="15" y1="5" x2="5" y2="15" stroke="#CA8A04" stroke-width="1"/>
             </g>`
      }

      <!-- Left Chest Logo (Viewer's Right) -->
      ${
        leftChestLogo?.image_url
          ? renderLogoImage(leftChestLogo, 136, 92, 28, 28)
          : `<g transform="translate(140, 94)">
               <polygon points="10,2 18,7 15,17 5,17 2,7" fill="#DC2626" opacity="0.9"/>
               <circle cx="10" cy="10" r="3" fill="#FFFFFF"/>
             </g>`
      }

      <!-- Stomach Sponsor Logo -->
      ${
        stomachLogo?.image_url
          ? renderLogoImage(stomachLogo, 95, 150, 60, 30)
          : ''
      }

      <!-- Right Sleeve Logo (Viewer's Left) -->
      ${
        rightShoulderLogo?.image_url
          ? renderLogoImage(rightShoulderLogo, 18, 120, 22, 22)
          : `<rect x="20" y="122" width="18" height="18" rx="2" fill="#DC2626" opacity="0.85"/>`
      }

      <!-- Left Sleeve Logo / Flag (Viewer's Right) -->
      ${
        leftShoulderLogo?.image_url
          ? renderLogoImage(leftShoulderLogo, 210, 122, 22, 16)
          : `<g transform="translate(210, 122)">
               <!-- Bahrain National Flag SVG -->
               <rect width="22" height="14" rx="1" fill="#CE1126"/>
               <path d="M 0,0 L 7,0 L 10,1.4 L 7,2.8 L 10,4.2 L 7,5.6 L 10,7 L 7,8.4 L 10,9.8 L 7,11.2 L 10,12.6 L 7,14 L 0,14 Z" fill="#FFFFFF"/>
               <rect width="22" height="14" rx="1" fill="none" stroke="#475569" stroke-width="0.5"/>
             </g>`
      }
    </g>

    <!-- =================================================================== -->
    <!-- VIEW 2: SIDE ELEVATION (Center)                                     -->
    <!-- =================================================================== -->
    <g id="sideView" transform="translate(290, 10)" filter="url(#shadow)">
      <!-- Collar Profile -->
      <path d="M 38,20 C 50,15 65,22 70,38 C 55,36 45,30 38,20 Z" fill="${colors.collar}" stroke="#334155" stroke-width="1.2"/>

      <!-- Body Side Profile -->
      <path d="M 40,26 
               C 50,55 58,110 58,275 
               C 42,277 28,277 15,275 
               C 10,210 10,130 18,78 
               C 22,50 30,35 40,26 Z" 
            fill="${colors.body}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- Center Flank Mesh Panel running from underarm to hem -->
      <path d="M 32,76 L 46,76 L 46,275 L 30,275 Z" fill="${colors.sleeves}" stroke="#64748B" stroke-width="0.8"/>
      <path d="M 32,76 L 46,76 L 46,275 L 30,275 Z" fill="url(#meshPattern)"/>
      <line x1="30" y1="76" x2="28" y2="275" stroke="${colors.piping}" stroke-width="1.5"/>
      <line x1="48" y1="76" x2="48" y2="275" stroke="#CBD5E1" stroke-width="0.8"/>

      <!-- Side Sleeve -->
      <path d="M 38,26 C 55,40 68,65 68,112 C 45,116 35,116 22,112 C 22,75 28,45 38,26 Z" 
            fill="${colors.sleeves}" stroke="#334155" stroke-width="1.2"/>
      <!-- Sleeve Cuff Accent -->
      <path d="M 22,108 C 35,114 45,114 68,108 L 68,112 C 45,116 35,116 22,112 Z" fill="#64748B" opacity="0.3"/>

      <!-- Sleeve Logo on Side View -->
      ${
        rightShoulderLogo?.image_url
          ? renderLogoImage(rightShoulderLogo, 36, 68, 20, 20)
          : `<rect x="36" y="68" width="18" height="18" rx="2" fill="#DC2626" opacity="0.85"/>`
      }
    </g>

    <!-- =================================================================== -->
    <!-- VIEW 3: BACK ELEVATION (Right)                                      -->
    <!-- =================================================================== -->
    <g id="backView" transform="translate(410, 10)" filter="url(#shadow)">
      <!-- Left & Right Sleeves (Back View) -->
      <path d="M 75,45 L 20,95 C 15,115 12,135 10,155 L 48,168 C 54,140 60,110 70,88 Z" 
            fill="${colors.sleeves}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M 175,45 L 230,95 C 235,115 238,135 240,155 L 202,168 C 196,140 190,110 180,88 Z" 
            fill="${colors.sleeves}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- Main Back Body -->
      <path d="M 75,45 
               C 95,38 155,38 175,45 
               L 180,88 
               L 185,275 
               C 155,282 95,282 65,275 
               L 70,88 Z" 
            fill="${colors.body}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- Side Panels on Back Edges -->
      <path d="M 70,88 L 65,275 L 75,276 L 80,92 Z" fill="${colors.sleeves}" stroke="#64748B" stroke-width="0.8"/>
      <path d="M 70,88 L 65,275 L 75,276 L 80,92 Z" fill="url(#meshPattern)"/>
      <path d="M 180,88 L 185,275 L 175,276 L 170,92 Z" fill="${colors.sleeves}" stroke="#64748B" stroke-width="0.8"/>
      <path d="M 180,88 L 185,275 L 175,276 L 170,92 Z" fill="url(#meshPattern)"/>

      <!-- Back Raglan Seams -->
      <line x1="75" y1="45" x2="80" y2="92" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>
      <line x1="175" y1="45" x2="170" y2="92" stroke="#475569" stroke-width="1" stroke-dasharray="2,2"/>

      <!-- Back Collar Band -->
      <path d="M 94,36 C 112,28 138,28 156,36 C 148,46 102,46 94,36 Z" 
            fill="${colors.collar}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- Back Neck Logo / Club Crest -->
      ${
        backNeckLogo?.image_url
          ? renderLogoImage(backNeckLogo, 114, 50, 22, 22)
          : `<g transform="translate(116, 52)">
               <circle cx="9" cy="9" r="8" fill="#FBBF24" stroke="#D97706" stroke-width="0.8"/>
               <path d="M 9,4 L 11,8 L 15,9 L 12,12 L 13,16 L 9,14 L 5,16 L 6,12 L 3,9 L 7,8 Z" fill="#92400E"/>
             </g>`
      }

      <!-- PLAYER NAME (High-Contrast Athletic Typography) -->
      <g transform="translate(125, 102)">
        <text x="0" y="0" 
              font-family="'Arial Black', Impact, sans-serif" 
              font-size="20" 
              font-weight="900" 
              letter-spacing="2"
              fill="#FFFFFF" 
              stroke="#475569" 
              stroke-width="1"
              paint-order="stroke fill"
              text-anchor="middle">
          ${(playerName || 'PLAYER').toUpperCase()}
        </text>
      </g>

      <!-- JERSEY NUMBER (Large Bold Athletic Digits) -->
      <g transform="translate(125, 175)">
        <text x="0" y="0" 
              font-family="'Impact', 'Arial Black', sans-serif" 
              font-size="64" 
              font-weight="bold" 
              letter-spacing="1"
              fill="#FFFFFF" 
              stroke="#475569" 
              stroke-width="2"
              paint-order="stroke fill"
              text-anchor="middle">
          ${playerNumber || '00'}
        </text>
      </g>

      <!-- Bottom Hem -->
      <path d="M 65,275 C 95,282 155,282 185,275" fill="none" stroke="#334155" stroke-width="1.2"/>
    </g>
  </g>
</svg>
`;
}

/**
 * Generates an ultra-crisp 2-view SVG vector illustration (Front, Back) for Trousers / Bottoms.
 */
export function generateBottomMockupSvg(
  garment: GarmentSpecType,
  options?: {
    primaryColor?: string;
    accentColor?: string;
    width?: number;
    height?: number;
  }
): string {
  const colors = resolveGarmentColors(garment, options?.primaryColor, options?.accentColor);
  const width = options?.width || 800;
  const height = options?.height || 360;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <filter id="shadowB" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-opacity="0.1" />
    </filter>
  </defs>

  <g transform="translate(80, 10)">
    <!-- FRONT TROUSER VIEW -->
    <g id="trouserFront" transform="translate(20, 10)" filter="url(#shadowB)">
      <!-- Waistband -->
      <path d="M 40,25 L 160,25 L 155,42 L 45,42 Z" fill="${colors.body}" stroke="#334155" stroke-width="1.2"/>
      <line x1="42" y1="33" x2="158" y2="33" stroke="#CBD5E1" stroke-width="0.8" stroke-dasharray="3,2"/>

      <!-- Drawstring Cord -->
      <path d="M 97,42 C 95,55 90,70 94,85" fill="none" stroke="#475569" stroke-width="1.5"/>
      <path d="M 103,42 C 105,58 110,68 106,85" fill="none" stroke="#475569" stroke-width="1.5"/>

      <!-- Legs Profile (Front) -->
      <path d="M 45,42 
               L 155,42 
               L 165,85 
               C 160,160 152,220 148,285 
               L 115,285 
               L 100,105 
               L 85,285 
               L 52,285 
               C 48,220 40,160 35,85 Z" 
            fill="${colors.body}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- Cross Pockets -->
      <line x1="45" y1="42" x2="70" y2="85" stroke="#334155" stroke-width="1.2"/>
      <line x1="155" y1="42" x2="130" y2="85" stroke="#334155" stroke-width="1.2"/>

      <!-- Side Piping -->
      <path d="M 45,42 C 40,140 48,220 52,285" fill="none" stroke="${colors.piping}" stroke-width="1.5"/>
      <path d="M 155,42 C 160,140 152,220 148,285" fill="none" stroke="${colors.piping}" stroke-width="1.5"/>

      <!-- Bottom Cuffs -->
      <line x1="52" y1="280" x2="85" y2="280" stroke="#94A3B8" stroke-width="0.8"/>
      <line x1="115" y1="280" x2="148" y2="280" stroke="#94A3B8" stroke-width="0.8"/>
    </g>

    <!-- BACK TROUSER VIEW -->
    <g id="trouserBack" transform="translate(240, 10)" filter="url(#shadowB)">
      <!-- Waistband -->
      <path d="M 40,25 L 160,25 L 155,42 L 45,42 Z" fill="${colors.body}" stroke="#334155" stroke-width="1.2"/>

      <!-- Back Yoke Seam -->
      <path d="M 44,52 L 100,62 L 156,52" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="3,2"/>

      <!-- Back Legs Profile -->
      <path d="M 45,42 
               L 155,42 
               L 165,85 
               C 160,160 152,220 148,285 
               L 115,285 
               L 100,105 
               L 85,285 
               L 52,285 
               C 48,220 40,160 35,85 Z" 
            fill="${colors.body}" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>

      <!-- Back Pocket -->
      <rect x="118" y="70" width="28" height="20" rx="1" fill="#FFFFFF" stroke="#475569" stroke-width="0.8"/>
      <line x1="118" y1="74" x2="146" y2="74" stroke="#94A3B8" stroke-width="0.6"/>

      <!-- Side Piping -->
      <path d="M 45,42 C 40,140 48,220 52,285" fill="none" stroke="${colors.piping}" stroke-width="1.5"/>
      <path d="M 155,42 C 160,140 152,220 148,285" fill="none" stroke="${colors.piping}" stroke-width="1.5"/>
    </g>
  </g>
</svg>
`;
}

/**
 * Converts an SVG string to a high-resolution PNG data URL in the browser via Canvas.
 * Returns null if executed in a headless Node environment.
 */
export async function convertSvgToPngDataUrl(
  svgString: string,
  width: number = 800,
  height: number = 360
): Promise<string | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * 2; // 2x resolution for high-DPI PDF print quality
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(blobUrl);
          resolve(dataUrl);
        } else {
          URL.revokeObjectURL(blobUrl);
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(null);
      };

      img.src = blobUrl;
    } catch (e) {
      resolve(null);
    }
  });
}
