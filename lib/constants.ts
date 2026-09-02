/**
 * Global Tunable Business Constants for HR Sports
 */

export const MOQ_UNITS = 30; // current minimum order quantity, per style/design
export const MOQ_LABEL = `${MOQ_UNITS} pieces minimum per design`;

export const SITE_CONFIG = {
  name: 'HR Sports',
  legalName: 'HR Sports International Ltd.',
  tagline: 'Precision OEM & Custom Sports Apparel Manufacturing at Industrial Scale',
  description: 'Direct-to-factory OEM clothing and sportswear manufacturer producing activewear, team kits, corporate uniforms, and technical jerseys with 30-piece MOQ and rapid worldwide delivery.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hrsports.com',
  email: 'inquiries@hrsports.com',
  supportEmail: 'support@hrsports.com',
  phone: '+1 (800) 582-9174',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+92 313 8484511',
  whatsappDefaultMessage: 'Hello HR Sports Team, I am reaching out regarding custom sportswear manufacturing and would like to request details on pricing and production.',
  address: '14 Industrial Zone, Textile Corridor, Karachi / Export Processing Hub',
  productionLeadTimeDays: '10–14 days',
  sampleLeadTimeDays: '3–5 days',
  worldwideExpressDeliveryDays: '3–6 days',
  turnaroundVelocity: '24-hour quote SLA',
  yearsInOperation: 18,
  annualGarmentsProduced: '3.5M+',
  countriesExported: 42,
} as const;

export const MAX_FLAT_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_3D_FILE_SIZE_BYTES = 250 * 1024 * 1024;  // 250 MB

export const ALLOWED_FLAT_EXTENSIONS = ['.pdf', '.ai', '.eps', '.png', '.jpg', '.jpeg', '.svg'] as const;
export const ALLOWED_3D_EXTENSIONS = ['.glb', '.gltf', '.obj', '.fbx', '.stl', '.zprj', '.bw', '.lot'] as const;
export const THREE_D_RENDERABLE_EXTENSIONS = ['.glb', '.gltf', '.obj'] as const;

export const GARMENT_TYPES = [
  'Pro Performance Jersey',
  'Athletic Team Kit (Top + Shorts)',
  'Compression Activewear & Leggings',
  'Corporate Polo & Tech Uniform',
  'Warmup Tracksuit & Technical Jacket',
  'Custom Sublimated Hoodie',
  'Training Tank & Baseline Tee',
] as const;
