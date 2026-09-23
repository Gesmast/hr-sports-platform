'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, AlertCircle } from 'lucide-react';
import { COUNTRIES, CountryItem } from '@/lib/constants';
import { getDialCode, smartParsePhone, ParsedPhoneResult } from '@/lib/phone';

interface PhoneInputProps {
  id?: string;
  label?: string;
  optional?: boolean;
  value?: string;
  countryCode: string;
  onCountryChange: (countryCode: string) => void;
  onChange: (value: string, fullInternational: string, isValid: boolean) => void;
  error?: string;
  placeholder?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  id = 'whatsapp',
  label = 'WhatsApp',
  optional = true,
  value = '',
  countryCode,
  onCountryChange,
  onChange,
  error,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [hasLengthError, setHasLengthError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeCountry =
    COUNTRIES.find((c) => c.code === countryCode.toUpperCase()) ||
    COUNTRIES.find((c) => c.code === 'US') ||
    COUNTRIES[0];

  const dialCode = getDialCode(activeCountry.code);

  // Close popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter countries by name, code, or dial code
  const filteredCountries = COUNTRIES.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const cDial = getDialCode(c.code).replace('+', '');
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      cDial.includes(q.replace('+', ''))
    );
  });

  const [displayVal, setDisplayVal] = useState(value);

  // Sync internal display when external value is cleared or externally updated
  useEffect(() => {
    if (!value) {
      setDisplayVal('');
      setIsTouched(false);
      setHasLengthError(false);
    }
  }, [value]);

  // Parse phone status
  const parsed: ParsedPhoneResult = smartParsePhone(displayVal, activeCountry.code);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const input = e.currentTarget;
      const { selectionStart, selectionEnd } = input;
      if (selectionStart !== null && selectionStart === selectionEnd && selectionStart > 0) {
        const charBefore = displayVal[selectionStart - 1];
        // If backspacing on a non-digit formatting symbol (parentheses, spaces, dashes)
        if (/[() \-]/.test(charBefore)) {
          e.preventDefault();
          // Find the nearest preceding digit before the cursor to delete
          const before = displayVal.slice(0, selectionStart);
          const after = displayVal.slice(selectionStart);
          let digitIdx = -1;
          for (let i = before.length - 1; i >= 0; i--) {
            if (/\d/.test(before[i])) {
              digitIdx = i;
              break;
            }
          }

          if (digitIdx !== -1) {
            const nextRaw = before.slice(0, digitIdx) + before.slice(digitIdx + 1) + after;
            const result = smartParsePhone(nextRaw, activeCountry.code);
            setDisplayVal(result.formattedDisplay);
            onChange(result.formattedDisplay, result.fullInternational, result.isValid);
            requestAnimationFrame(() => {
              const newPos = Math.max(0, digitIdx);
              input.setSelectionRange(newPos, newPos);
            });
          }
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    const previousDigits = displayVal.replace(/\D/g, '');
    const newDigits = raw.replace(/\D/g, '');

    // Mobile / virtual keyboard fallback:
    // If text got shorter but digit count stayed identical, a formatting character like ')' was backspaced
    if (raw.length < displayVal.length && newDigits === previousDigits && previousDigits.length > 0) {
      raw = previousDigits.slice(0, -1);
    }

    // Stripe-style length limit: Check if new value exceeds the country's max digits
    const testResult = smartParsePhone(raw, activeCountry.code);

    if (testResult.isTooLong) {
      setHasLengthError(true);
      // If user attempted to type an extra digit beyond the country's max limit, block the extra digit
      if (newDigits.length > previousDigits.length && previousDigits.length >= 7) {
        return;
      }
    } else {
      setHasLengthError(false);
    }

    const result = smartParsePhone(raw, activeCountry.code);

    // If user pasted/typed an international number starting with '+' from another country,
    // automatically switch the dial code picker to that country!
    if (result.country && result.country !== activeCountry.code && raw.trim().startsWith('+')) {
      onCountryChange(result.country);
    }

    setDisplayVal(result.formattedDisplay);
    onChange(result.formattedDisplay, result.fullInternational, result.isValid);
  };

  const handleSelectCountry = (c: CountryItem) => {
    onCountryChange(c.code);
    setIsOpen(false);
    setSearch('');

    // Re-parse current number under the newly selected country
    if (displayVal) {
      const result = smartParsePhone(displayVal, c.code);
      setDisplayVal(result.formattedDisplay);
      onChange(result.formattedDisplay, result.fullInternational, result.isValid);
    }
  };

  // Stripe-style specific & actionable error messaging
  let errorMessage: string | null = error || null;

  if (!errorMessage && displayVal.trim().length > 0) {
    if (parsed.hasInvalidChars) {
      errorMessage = 'Please use only numbers, spaces, or dashes.';
    } else if (hasLengthError || parsed.isTooLong) {
      errorMessage = `This phone number is too long for ${activeCountry.name}.`;
    } else if (isTouched && !parsed.isValid) {
      if (parsed.isTooShort) {
        errorMessage = `This phone number is too short for ${activeCountry.name}.`;
      } else {
        errorMessage = `Kindly enter a valid phone number for ${activeCountry.name}.`;
      }
    }
  }

  const hasError = Boolean(errorMessage);

  return (
    <div className="w-full">
      {/* Label Row */}
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block text-xs font-mono font-semibold text-ink">
          <span>{label}</span>{' '}
          {optional && (
            <span className="text-zinc-400 font-normal font-sans text-[11px]">(Optional)</span>
          )}
        </label>

        {parsed.isValid && !hasError && (
          <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in duration-150">
            <Check className="w-3 h-3 stroke-[3]" /> Valid Number
          </span>
        )}
      </div>

      {/* Unified Input Container (Stripe & WhatsApp style) */}
      <div
        className={`relative flex items-center w-full bg-white border rounded-full transition-colors ${
          hasError
            ? 'border-red-600 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600'
            : 'border-hairline focus-within:border-ink focus-within:ring-1 focus-within:ring-ink'
        }`}
      >
        {/* Dial Code Button (Left Pill) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={`Select country code, currently ${activeCountry.name} (${dialCode})`}
            className="flex items-center gap-1.5 h-full pl-3.5 pr-2.5 py-2.5 bg-zinc-50 hover:bg-zinc-100/80 transition-colors border-r border-zinc-200 rounded-l-full text-xs font-mono font-medium text-ink shrink-0 select-none cursor-pointer"
          >
            <img
              src={`https://flagcdn.com/${activeCountry.code.toLowerCase()}.svg`}
              alt={activeCountry.name}
              className="w-5 h-3.5 object-cover rounded-[2px] shadow-2xs border border-zinc-200 shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-semibold text-ink text-[12px]">{dialCode}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0 transition-transform duration-150" />
          </button>

          {/* Searchable Country Popover */}
          {isOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-border rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Search Box */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search country or code (e.g. 61)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink"
                />
              </div>

              {/* List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-50 text-xs">
                {filteredCountries.length === 0 ? (
                  <div className="py-4 text-center text-zinc-400 text-xs">No country found</div>
                ) : (
                  filteredCountries.map((c) => {
                    const cDial = getDialCode(c.code);
                    const isSelected = c.code === activeCountry.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-100 font-semibold text-ink'
                            : 'hover:bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate mr-2">
                          <img
                            src={`https://flagcdn.com/${c.code.toLowerCase()}.svg`}
                            alt={c.name}
                            className="w-5 h-3.5 object-cover rounded-[2px] shadow-2xs border border-zinc-200 shrink-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="truncate">{c.name}</span>
                        </span>
                        <span className="font-mono text-zinc-500 shrink-0 font-medium text-[11px]">
                          {cDial}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Number Input (Right Pill) */}
        <input
          id={id}
          name="tel"
          type="tel"
          autoComplete="tel"
          placeholder={placeholder || '433 123 456'}
          value={displayVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (displayVal.trim().length > 0) {
              setIsTouched(true);
            }
          }}
          className="w-full bg-white text-ink rounded-r-full px-3.5 py-2.5 text-sm transition-colors placeholder:text-zinc-400 focus:outline-none"
        />
      </div>

      {hasError && errorMessage && (
        <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
};
