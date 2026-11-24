'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Languages, ChevronDown, Check } from 'lucide-react';

/**
 * Authentic crisp SVG Flag for the United States
 */
export function UsFlag({ className = 'w-5 h-3.5' }: { className?: string }) {
  // 5-pointed star coordinates scaled for standard US canton grid
  const starPath =
    'M 0,-4.5 L 1.35,-1.35 L 4.5,-1.35 L 2.0,0.6 L 2.9,3.7 L 0,1.8 L -2.9,3.7 L -2.0,0.6 L -4.5,-1.35 L -1.35,-1.35 Z';

  return (
    <svg
      viewBox="0 0 640 480"
      className={`${className} rounded-[2px] shadow-2xs shrink-0 inline-block`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="United States Flag"
    >
      <g fillRule="evenodd">
        {/* Red Base */}
        <rect width="640" height="480" fill="#B22234" />
        {/* 6 White Stripes */}
        <path
          stroke="#FFFFFF"
          strokeWidth="36.92"
          d="M0 55.38h640M0 129.23h640M0 203.08h640M0 276.92h640M0 350.77h640M0 424.62h640"
        />
        {/* Blue Canton (Union) */}
        <rect width="256" height="258.46" fill="#3C3B6E" />
        {/* Crisp grid representation of stars */}
        <g fill="#FFFFFF">
          {[0, 1, 2, 3, 4].map((r) =>
            [0, 1, 2, 3, 4, 5].map((c) => (
              <path
                key={`star-${r}-${c}`}
                d={starPath}
                transform={`translate(${21 + c * 42}, ${26 + r * 51}) scale(1.1)`}
              />
            ))
          )}
        </g>
      </g>
    </svg>
  );
}

/**
 * Authentic crisp SVG Flag for Pakistan (Official 3:2 geometry)
 */
export function PakistanFlag({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 600"
      className={`${className} rounded-[2px] shadow-2xs shrink-0 inline-block`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pakistan Flag"
    >
      {/* Dark Green Field (Federal Green #01411C) */}
      <rect width="900" height="600" fill="#01411C" />
      {/* Vertical White Hoist Stripe (1/4 total width = 225px) */}
      <rect width="225" height="600" fill="#FFFFFF" />
      {/* White Crescent Circle */}
      <circle cx="562.5" cy="300" r="180" fill="#FFFFFF" />
      {/* Green Mask Circle offset towards upper fly creating crescent */}
      <circle cx="612" cy="265" r="162" fill="#01411C" />
      {/* 5-Pointed Tilted White Star */}
      <g transform="translate(615, 235) rotate(-28)">
        <polygon
          fill="#FFFFFF"
          points="0,-72 22,-22 74,-22 32,8 48,59 0,26 -48,59 -32,8 -74,-22 -22,-22"
        />
      </g>
    </svg>
  );
}

interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export function LanguageToggle({ className = '', showIcon = true }: LanguageToggleProps) {
  const { locale, setLocale, isUrdu } = useI18n();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Pill Toggle Button styled matching reference screenshot */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-border bg-surface hover:bg-surface-elevated transition shadow-2xs text-ink cursor-pointer group"
        aria-expanded={open}
        title={isUrdu ? 'زبان تبدیل کریں' : 'Switch Language'}
      >
        {showIcon && <Languages className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
        {locale === 'en' ? (
          <UsFlag className="w-4.5 h-3" />
        ) : (
          <PakistanFlag className="w-4.5 h-3" />
        )}
        <span className="font-mono text-[11px] font-bold text-ink uppercase">
          {locale === 'ur' ? 'UR' : locale === 'roman' ? 'ROMAN' : 'US'}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-muted transition-transform group-hover:text-ink ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Card with Country Flags */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-surface shadow-2xl z-[9999] p-1.5 animate-in fade-in zoom-in-95 duration-100 divide-y divide-border/60">
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted font-bold">
            {isUrdu ? 'زبان منتخب کریں' : locale === 'roman' ? 'Zuban Select Karo' : 'Select Language'}
          </div>

          <div className="pt-1 space-y-0.5">
            {/* English (US) Option */}
            <button
              type="button"
              onClick={() => {
                setLocale('en');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition cursor-pointer ${
                locale === 'en'
                  ? 'bg-ink text-surface font-bold shadow-2xs'
                  : 'text-ink hover:bg-surface-elevated font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UsFlag className="w-5 h-3.5" />
                <span className="font-mono text-[11px] font-bold tracking-tight">
                  US - ENGLISH
                </span>
              </div>
              {locale === 'en' && <Check className="w-3.5 h-3.5 text-surface shrink-0" />}
            </button>

            {/* Urdu (PK) Option */}
            <button
              type="button"
              onClick={() => {
                setLocale('ur');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition cursor-pointer ${
                locale === 'ur'
                  ? 'bg-ink text-surface font-bold shadow-2xs'
                  : 'text-ink hover:bg-surface-elevated font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PakistanFlag className="w-5 h-3.5" />
                <span className="font-urdu text-[14px] font-bold leading-tight">
                  PK - اردو (URDU)
                </span>
              </div>
              {locale === 'ur' && <Check className="w-3.5 h-3.5 text-surface shrink-0" />}
            </button>

            {/* Roman Urdu (PK - Gen Z) Option */}
            <button
              type="button"
              onClick={() => {
                setLocale('roman');
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition cursor-pointer ${
                locale === 'roman'
                  ? 'bg-ink text-surface font-bold shadow-2xs'
                  : 'text-ink hover:bg-surface-elevated font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PakistanFlag className="w-5 h-3.5" />
                <span className="font-mono text-[11px] font-bold tracking-tight">
                  PK - ROMAN URDU (GEN Z)
                </span>
              </div>
              {locale === 'roman' && <Check className="w-3.5 h-3.5 text-surface shrink-0" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
