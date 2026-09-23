import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  AsYouType,
  CountryCode,
} from 'libphonenumber-js';
import { COUNTRIES } from '@/lib/constants';

/**
 * Get the calling code (e.g. "+61", "+1", "+44") for a given ISO country code.
 */
export function getDialCode(countryCode: string): string {
  try {
    const code = getCountryCallingCode(countryCode.toUpperCase() as CountryCode);
    return `+${code}`;
  } catch {
    return '+1';
  }
}

/**
 * Detect country code from client browser timezone.
 * Instant, 0 latency, 0 network requests.
 */
export function detectCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (!tz) return 'US';

    if (tz.startsWith('Australia/')) return 'AU';
    if (tz === 'Europe/London') return 'GB';
    if (tz === 'Asia/Karachi') return 'PK';
    if (tz === 'Asia/Dubai') return 'AE';
    if (tz === 'Asia/Riyadh') return 'SA';
    if (tz === 'Asia/Qatar') return 'QA';
    if (tz === 'Asia/Bahrain') return 'BH';
    if (tz === 'Asia/Kuwait') return 'KW';
    if (tz === 'Asia/Muscat') return 'OM';
    if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver') || tz.startsWith('America/Montreal') || tz.startsWith('America/Edmonton')) return 'CA';
    if (tz.startsWith('America/')) return 'US';
    if (tz === 'Europe/Berlin') return 'DE';
    if (tz === 'Europe/Paris') return 'FR';
    if (tz === 'Europe/Rome') return 'IT';
    if (tz === 'Europe/Madrid') return 'ES';
    if (tz === 'Europe/Amsterdam') return 'NL';
    if (tz === 'Europe/Brussels') return 'BE';
    if (tz === 'Europe/Vienna') return 'AT';
    if (tz === 'Europe/Zurich') return 'CH';
    if (tz === 'Europe/Stockholm') return 'SE';
    if (tz === 'Europe/Oslo') return 'NO';
    if (tz === 'Europe/Copenhagen') return 'DK';
    if (tz === 'Europe/Helsinki') return 'FI';
    if (tz === 'Europe/Dublin') return 'IE';
    if (tz === 'Europe/Lisbon') return 'PT';
    if (tz === 'Europe/Warsaw') return 'PL';
    if (tz === 'Europe/Athens') return 'GR';
    if (tz === 'Pacific/Auckland') return 'NZ';
    if (tz === 'Asia/Singapore') return 'SG';
    if (tz === 'Asia/Kolkata') return 'IN';
    if (tz === 'Asia/Dhaka') return 'BD';
    if (tz === 'Asia/Colombo') return 'LK';
    if (tz === 'Africa/Johannesburg') return 'ZA';

    return 'US';
  } catch {
    return 'US';
  }
}

export interface ParsedPhoneResult {
  country: string;
  dialCode: string;
  formattedDisplay: string;
  fullInternational: string;
  isValid: boolean;
  isTooLong: boolean;
  isTooShort: boolean;
  hasInvalidChars: boolean;
  lengthError?: 'TOO_LONG' | 'TOO_SHORT' | 'INVALID_COUNTRY' | 'NOT_A_NUMBER';
}

/**
 * Robust phone parser that gracefully handles:
 * - Full international numbers with '+' (e.g. '+61 433 123 456')
 * - Numbers with international prefix '00' (e.g. '0061 433 123 456')
 * - National / domestic numbers starting with '0' (e.g. '0433 123 456' under AU)
 * - Raw digits without leading 0 or + (e.g. '433 123 456' under AU)
 */
export function smartParsePhone(
  rawInput: string,
  selectedCountry: string
): ParsedPhoneResult {
  const currentCountry = (selectedCountry || 'US').toUpperCase();
  const currentDialCode = getDialCode(currentCountry);

  if (!rawInput || !rawInput.trim()) {
    return {
      country: currentCountry,
      dialCode: currentDialCode,
      formattedDisplay: '',
      fullInternational: '',
      isValid: false,
      isTooLong: false,
      isTooShort: false,
      hasInvalidChars: false,
    };
  }

  const hasInvalidChars = /[^\d\s\-()+]/.test(rawInput);
  let text = rawInput.trim();

  // Convert international '00' prefix to '+'
  if (text.startsWith('00')) {
    text = `+${text.slice(2)}`;
  }

  // Length check via libphonenumber-js
  let lengthStatus: any = undefined;
  let isTooLong = false;
  let isTooShort = false;
  try {
    if (text.startsWith('+')) {
      lengthStatus = validatePhoneNumberLength(text);
    } else {
      lengthStatus = validatePhoneNumberLength(text, currentCountry as CountryCode);
    }
    isTooLong = lengthStatus === 'TOO_LONG';
    isTooShort = lengthStatus === 'TOO_SHORT';
  } catch {
    // fallback
  }

  const rawDigits = text.replace(/\D/g, '');
  if (rawDigits.length > 15) {
    isTooLong = true;
  }

  // 1. If text starts with '+', it contains an explicit country calling code
  if (text.startsWith('+')) {
    const parsed = parsePhoneNumberFromString(text);
    if (parsed && parsed.country) {
      const detected = parsed.country.toUpperCase();
      return {
        country: detected,
        dialCode: getDialCode(detected),
        formattedDisplay: new AsYouType(detected as CountryCode).input(text),
        fullInternational: parsed.number, // E.164 e.g. +61433123456
        isValid: parsed.isValid(),
        isTooLong,
        isTooShort,
        hasInvalidChars,
        lengthError: lengthStatus,
      };
    }
    // Partial typing after '+'
    return {
      country: currentCountry,
      dialCode: currentDialCode,
      formattedDisplay: text,
      fullInternational: text,
      isValid: false,
      isTooLong,
      isTooShort,
      hasInvalidChars,
      lengthError: lengthStatus,
    };
  }

  // 2. If text does NOT start with '+', it is typed or autofilled under the selected country.
  // Check if it's a domestic number starting with 0 or local digits
  const parsedDomestic = parsePhoneNumberFromString(text, currentCountry as CountryCode);

  if (parsedDomestic) {
    return {
      country: (parsedDomestic.country || currentCountry).toUpperCase(),
      dialCode: currentDialCode,
      formattedDisplay: new AsYouType(currentCountry as CountryCode).input(text),
      fullInternational: parsedDomestic.number, // e.g. +61433123456
      isValid: parsedDomestic.isValid(),
      isTooLong,
      isTooShort,
      hasInvalidChars,
      lengthError: lengthStatus,
    };
  }

  // Fallback: If it's partial typing (e.g. '0433'), format as-you-type under the selected country
  const formatted = new AsYouType(currentCountry as CountryCode).input(text);

  // If user entered leading 0, strip it to form standard E.164 with dial code
  const digitsOnly = text.replace(/\D/g, '');
  const nationalDigits = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly;
  const callingDigits = currentDialCode.replace('+', '');
  const combinedE164 = digitsOnly ? `+${callingDigits}${nationalDigits}` : '';

  return {
    country: currentCountry,
    dialCode: currentDialCode,
    formattedDisplay: formatted,
    fullInternational: combinedE164,
    isValid: false,
    isTooLong,
    isTooShort,
    hasInvalidChars,
    lengthError: lengthStatus,
  };
}
