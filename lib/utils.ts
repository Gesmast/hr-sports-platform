import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function generateReferenceId(prefix = 'HRS'): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${new Date().getFullYear()}-${timestamp}${random}`;
}

// Common ISO 3166-1 alpha-2 to alpha-3 mapping for sports manufacturing
export const COUNTRY_ALPHA3_MAP: Record<string, string> = {
  PK: 'PAK',
  US: 'USA',
  CA: 'CAN',
  GB: 'GBR',
  UK: 'GBR',
  DE: 'DEU',
  FR: 'FRA',
  IT: 'ITA',
  ES: 'ESP',
  NL: 'NLD',
  BE: 'BEL',
  SE: 'SWE',
  NO: 'NOR',
  DK: 'DNK',
  FI: 'FIN',
  CH: 'CHE',
  AT: 'AUT',
  IE: 'IRL',
  PT: 'PRT',
  PL: 'POL',
  GR: 'GRC',
  AE: 'UAE',
  SA: 'SAU',
  BH: 'BHR',
  QA: 'QAT',
  KW: 'KWT',
  OM: 'OMN',
  IN: 'IND',
  BD: 'BGD',
  LK: 'LKA',
  NP: 'NPL',
  AF: 'AFG',
  AU: 'AUS',
  NZ: 'NZL',
  ZA: 'ZAF',
  KE: 'KEN',
  NG: 'NGA',
  EG: 'EGY',
  CN: 'CHN',
  JP: 'JPN',
  KR: 'KOR',
  SG: 'SGP',
  MY: 'MYS',
};

/**
 * Returns 3-letter uppercase country code (e.g., PK -> PAK, US -> USA).
 */
export function getCountryAlpha3(countryCodeOrName?: string): string {
  if (!countryCodeOrName) return 'PAK';
  const clean = countryCodeOrName.trim().toUpperCase();

  // If already 3 letters (e.g. "PAK", "USA")
  if (clean.length === 3) return clean;

  // Direct 2-letter lookup
  if (COUNTRY_ALPHA3_MAP[clean]) {
    return COUNTRY_ALPHA3_MAP[clean];
  }

  // Name match fallback (e.g. "Pakistan" -> "PAK")
  if (clean.startsWith('PAK')) return 'PAK';
  if (clean.startsWith('UNIT') && clean.includes('STAT')) return 'USA';
  if (clean.startsWith('UNIT') && clean.includes('KING')) return 'GBR';
  if (clean.startsWith('BAH')) return 'BHR';
  if (clean.startsWith('CAN')) return 'CAN';
  if (clean.startsWith('AUS')) return 'AUS';

  // Fallback first 3 letters or default PAK
  return clean.slice(0, 3).padEnd(3, 'X');
}

/**
 * Formats inquiry code in 8-character format: [COUNTRY_3_LETTERS]-[5 DIGITS]
 * e.g. "PAK-00001", "USA-00001", "BHR-00002"
 */
export function formatInquiryCode(country = 'PK', seq = 1): string {
  const c3 = getCountryAlpha3(country);
  const numStr = String(seq).padStart(5, '0');
  return `${c3}-${numStr}`;
}

/**
 * Backward compatibility helper
 */
export function generate8DigitInquiryCode(country = 'PK', seq = 1): string {
  return formatInquiryCode(country, seq);
}



