/**
 * Global Tunable Business Constants for HR Sports
 */

export const MOQ_UNITS = 15; // current minimum order quantity, per style/design
export const MOQ_LABEL = `${MOQ_UNITS} pieces minimum per design`;

export const SITE_CONFIG = {
  name: 'The HR Sports',
  legalName: 'The HR Sports',
  tagline: 'Precision OEM & Custom Sports Apparel Manufacturing at Industrial Scale',
  description: 'Direct-to-factory OEM clothing and sportswear manufacturer producing activewear, team kits, corporate uniforms, and technical jerseys with 15-piece MOQ and rapid worldwide delivery.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hrsports.com',
  email: 'inquiries@hrsports.com',
  supportEmail: 'support@hrsports.com',
  phone: '+1 (800) 582-9174',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+92 313 8484511',
  whatsappDefaultMessage: 'Hello HR Sports Team, I am reaching out regarding custom sportswear manufacturing and would like to request details on pricing and production.',
  address: 'Green Building, Block B New Chauburji Park, Multan Road, Lahore, 54000, Pakistan',
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

export interface CountryItem {
  code: string;
  name: string;
}

export const COUNTRIES: CountryItem[] = [
  // North America
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },

  // Europe & UK
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PL', name: 'Poland' },
  { code: 'GR', name: 'Greece' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'IS', name: 'Iceland' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'MT', name: 'Malta' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'TR', name: 'Turkey' },

  // Middle East & GCC
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'OM', name: 'Oman' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'IQ', name: 'Iraq' },

  // South Asia
  { code: 'PK', name: 'Pakistan' },
  { code: 'IN', name: 'India' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Nepal' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'MV', name: 'Maldives' },

  // East & Southeast Asia
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },

  // Oceania
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'WS', name: 'Samoa' },
  { code: 'TO', name: 'Tonga' },

  // Africa
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' },
  { code: 'GH', name: 'Ghana' },
  { code: 'MA', name: 'Morocco' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'NA', name: 'Namibia' },
  { code: 'BW', name: 'Botswana' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'CI', name: 'Ivory Coast' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'MU', name: 'Mauritius' },

  // Latin America & Caribbean
  { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'PA', name: 'Panama' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'GY', name: 'Guyana' },

  // Central Asia & Caucasus
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'GE', name: 'Georgia' },
  { code: 'AM', name: 'Armenia' },
];

export const SIZE_CHART_CONFIG = {
  us: {
    id: 'us' as const,
    name: 'US Size Chart',
    shortName: 'US Standard',
    description: 'Tailored for United States, Canada, and the Americas',
    flag: '🇺🇸',
    note: 'All measurements are in inches. Consider a variation or difference of 0.5 inch in measurements.',
    unitNote: 'Measurements in Inches',
    url: '/size-charts/us_chart.jpeg',
    r2Url: 'https://pub-6a38698c8f7d411694afe9e4dd678660.r2.dev/Size%20Charts/US%20Size%20Chart.jpeg',
    downloadFilename: 'US_Size_Chart.jpeg',
  },
  uk: {
    id: 'uk' as const,
    name: 'UK Size Chart',
    shortName: 'UK Standard',
    description: 'Tailored for the United Kingdom, Europe, and Commonwealth regions',
    flag: '🇬🇧',
    note: 'All measurements are in inches. Consider a variation or difference of 0.5 inch in measurements.',
    unitNote: 'Measurements in Inches',
    url: '/size-charts/uk_chart.jpeg',
    r2Url: 'https://pub-6a38698c8f7d411694afe9e4dd678660.r2.dev/Size%20Charts/UK%20Size%20Chart.jpeg',
    downloadFilename: 'UK_Size_Chart.jpeg',
  },
  asian: {
    id: 'asian' as const,
    name: 'Asian Size Chart',
    shortName: 'Asian',
    description: 'This chart is for all countries except UK and US',
    flag: '🌏',
    note: 'All measurements are in inches. Consider a variation or difference of 0.5 inch in measurements.',
    unitNote: 'Measurements in Inches',
    url: '/size-charts/asian_chart.jpeg',
    r2Url: 'https://pub-6a38698c8f7d411694afe9e4dd678660.r2.dev/Size%20Charts/Asian%20Size%20Chart.jpeg',
    downloadFilename: 'Asian_Size_Chart.jpeg',
  },
} as const;

export type SizeChartRegion = keyof typeof SIZE_CHART_CONFIG;

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const;
export type StandardSize = (typeof STANDARD_SIZES)[number];

export function getDefaultSizeChartRegion(countryCode?: string): SizeChartRegion {
  if (!countryCode) return 'asian';
  const upper = countryCode.toUpperCase();
  if (['US', 'CA', 'MX'].includes(upper)) return 'us';
  if ([
    'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI',
    'CH', 'AT', 'IE', 'PT', 'PL', 'GR', 'CZ', 'HU', 'RO', 'BG', 'HR',
    'RS', 'SK', 'SI', 'LT', 'LV', 'EE', 'IS', 'CY', 'MT', 'LU', 'UA',
  ].includes(upper)) {
    return 'uk';
  }
  return 'asian';
}



