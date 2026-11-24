'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { RotateCcw, ChevronDown, Check } from 'lucide-react';

export interface ShopifyColorPickerProps {
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange: (color: string) => void;
}

// Curated Shopify-style palette presets for quick branding
const BRAND_SWATCHES = [
  { label: 'Ink Black', value: '#0A0A0A' },
  { label: 'Deep Charcoal', value: '#18181B' },
  { label: 'Muted Slate', value: '#475569' },
  { label: 'Clean White', value: '#FFFFFF' },
  { label: 'Electric Blue', value: '#2563EB' },
  { label: 'Emerald Forest', value: '#059669' },
  { label: 'Amber Gold', value: '#D97706' },
  { label: 'Royal Crimson', value: '#DC2626' },
  { label: 'Deep Violet', value: '#7C3AED' },
  { label: 'Ice Cyan', value: '#0284C7' },
];

export function ShopifyColorPicker({
  name,
  label,
  value = '#0A0A0A',
  defaultValue = '#0A0A0A',
  onChange,
}: ShopifyColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal hex state when value changes externally
  useEffect(() => {
    setHexInput(value || '#0A0A0A');
  }, [value]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleColorChange = (newColor: string) => {
    setHexInput(newColor);
    onChange(newColor);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    setHexInput(input);
    if (!input.startsWith('#')) input = `#${input}`;
    // Simple 3 or 6 hex digit validator
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(input)) {
      onChange(input);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full text-xs">
      {label && (
        <label className="block text-[11px] font-bold text-ink/80 uppercase tracking-wider mb-1.5 font-mono">
          {label}
        </label>
      )}

      {/* Trigger Swatch Bar (Shopify Dawn Style) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Color Swatch Circle */}
            <span
              className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 shrink-0 shadow-inner transition-transform group-hover:scale-105"
              style={{ backgroundColor: value || '#0A0A0A' }}
            />
            {/* Hex Display */}
            <span className="font-mono font-bold text-xs uppercase tracking-wide truncate">
              {value || '#0A0A0A'}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-ink' : ''
            }`}
          />
        </button>

        {/* Reset Button */}
        {defaultValue && value !== defaultValue && (
          <button
            type="button"
            onClick={() => handleColorChange(defaultValue)}
            className="p-2 rounded-xl border border-border hover:bg-surface-elevated text-muted hover:text-ink transition cursor-pointer"
            title={`Reset to default (${defaultValue})`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Color Picker Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 p-3 rounded-2xl border border-border bg-surface-elevated shadow-2xl w-64 animate-in fade-in zoom-in-95 duration-100">
          {/* react-colorful visual spectrum */}
          <div className="custom-color-picker mb-3">
            <HexColorPicker
              color={value?.startsWith('#') ? value : '#0A0A0A'}
              onChange={handleColorChange}
              style={{ width: '100%', height: '140px', borderRadius: '12px' }}
            />
          </div>

          {/* Hex Input & Live Preview */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted font-mono font-bold">#</span>
              <input
                type="text"
                value={hexInput.replace('#', '')}
                onChange={handleHexInputChange}
                maxLength={7}
                placeholder="000000"
                className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-border bg-surface font-mono font-bold text-xs uppercase text-ink focus:outline-hidden focus:ring-1 focus:ring-ink"
              />
            </div>
            <span
              className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/20 shrink-0 shadow-inner"
              style={{ backgroundColor: value || '#0A0A0A' }}
            />
          </div>

          {/* Shopify-Style Preset Color Swatches */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold mb-1.5">
              Preset Palette
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {BRAND_SWATCHES.map((swatch) => {
                const isSelected = value?.toUpperCase() === swatch.value.toUpperCase();
                return (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => handleColorChange(swatch.value)}
                    title={swatch.label}
                    className={`h-7 rounded-lg border relative flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent'
                        : 'border-black/10 dark:border-white/20'
                    }`}
                    style={{ backgroundColor: swatch.value }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          swatch.value === '#FFFFFF' || swatch.value === '#FEF08A'
                            ? 'text-black'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
