/**
 * AI Garment Synthesis Engine
 * Generates photorealistic Front & Back studio apparel mockups based on customer specifications.
 * Uses /api/ai/preview backend endpoint with FLUX/SDXL studio generation + instant SVG CAD fallback.
 */

export interface GarmentDesignParams {
  garmentType: string;
  materialVariant?: string;
  primaryColor?: string;
  accentColor?: string;
  designNotes?: string;
  logoPlacement?: string;
  hasUploadedLogo?: boolean;
}

export interface GeneratedDualPreview {
  frontUrl: string;
  backUrl: string;
  promptFront: string;
  promptBack: string;
  timestamp: number;
}

export function formatColorDescription(hexOrName: string): string {
  const colorMap: Record<string, string> = {
    '#111111': 'matte jet black',
    '#000000': 'pure black',
    '#F5F5F0': 'optical white',
    '#FFFFFF': 'pure white',
    '#DC2626': 'crimson athletic red',
    '#2563EB': 'royal cobalt blue',
    '#059669': 'forest emerald green',
    '#71717A': 'heather graphite grey',
    '#D97706': 'athletic gold amber',
    '#9333EA': 'deep royal purple',
    '#0891B2': 'cyan ocean teal',
    '#EA580C': 'blaze safety orange',
    '#84CC16': 'fluorescent neon lime',
  };

  const normalized = (hexOrName || '').toUpperCase();
  for (const [key, val] of Object.entries(colorMap)) {
    if (key.toUpperCase() === normalized) return val;
  }
  return hexOrName || 'custom tone';
}

export function buildGarmentPrompts(params: GarmentDesignParams) {
  const garment = params.garmentType || 'Athletic Hoodie';
  const fabric = params.materialVariant || 'Heavyweight French Terry Cotton';
  const primaryColor = formatColorDescription(params.primaryColor || '#111111');
  const accentColor = formatColorDescription(params.accentColor || '#F5F5F0');
  const userNotes = (params.designNotes || '').trim().slice(0, 300);

  const baseStyle = `professional studio product photography of a custom high-end ${garment}, made of premium ${fabric}, ${primaryColor} primary body with ${accentColor} athletic trim accents, minimalist clean luxury streetwear aesthetic, sharp fabric weave texture, realistic stitching details, studio lighting on invisible ghost mannequin, neutral soft dark studio background, ultra-sharp 8k fashion catalog, commercial B2B sportswear tech pack render`;

  const extraNotes = userNotes ? `, design elements: ${userNotes}` : '';
  const logoInfo = params.hasUploadedLogo
    ? `, with crisp vector team crest logo placed on ${params.logoPlacement || 'chest'}`
    : '';

  const promptFront = `${baseStyle}, FRONT VIEW showing collar, front chest, athletic cut${logoInfo}${extraNotes}, centered symmetrical composition, no person, ghost mannequin display`;
  const promptBack = `${baseStyle}, BACK REAR VIEW showing hood rear, back shoulders, clean athletic back panel typography placement, centered rear angle, no person, ghost mannequin display`;

  return { promptFront, promptBack };
}

export function generateDualMockupUrls(params: GarmentDesignParams, seed?: number): GeneratedDualPreview {
  const currentSeed = seed || Math.floor(Math.random() * 999999);
  const { promptFront, promptBack } = buildGarmentPrompts(params);

  const primary = encodeURIComponent(params.primaryColor || '#111111');
  const accent = encodeURIComponent(params.accentColor || '#F5F5F0');
  const garment = encodeURIComponent(params.garmentType || 'Sportswear');

  const frontUrl = `/api/ai/preview?prompt=${encodeURIComponent(promptFront)}&seed=${currentSeed}&angle=front&primaryColor=${primary}&accentColor=${accent}&garment=${garment}`;
  const backUrl = `/api/ai/preview?prompt=${encodeURIComponent(promptBack)}&seed=${currentSeed + 1}&angle=back&primaryColor=${primary}&accentColor=${accent}&garment=${garment}`;

  return {
    frontUrl,
    backUrl,
    promptFront,
    promptBack,
    timestamp: Date.now(),
  };
}
