'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Sparkles,
  Type,
  LayoutDashboard,
  MessageSquareText,
  Users,
  CheckCircle,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

interface FontOption {
  id: string;
  nameEn: string;
  nameUr: string;
  fontFamily: string;
  category: 'Modern UI (Naskh / Rounded)' | 'Classic Nastaliq (Calligraphic)' | 'Geometric Sans';
  description: string;
  recommendedFor: string;
  tag: string;
  samplePhrases: {
    title: string;
    navItems: string[];
    chatMsg: string;
    buttonText: string;
  };
}

const FONTS: FontOption[] = [
  {
    id: 'baloo',
    nameEn: 'Baloo Bhaijaan 2',
    nameUr: 'بلو بھائی جان 2',
    fontFamily: "'Baloo Bhaijaan 2', system-ui, sans-serif",
    category: 'Modern UI (Naskh / Rounded)',
    tag: '★ Top Recommendation for Dashboard',
    description:
      'Bold, modern, and ultra-readable. Has a flat horizontal baseline so it fits cleanly into buttons, badges, tables, and sidebars without vertical clipping.',
    recommendedFor: 'Mobile views, factory floor kiosks, compact dashboard cards, and navigation buttons.',
    samplePhrases: {
      title: 'ایچ آر اسپورٹس مینوفیکچرنگ ڈیش بورڈ',
      navItems: ['ڈیش بورڈ', 'انکوائریز اور لیڈز', 'کوٹیشن و بلنگ', 'ملازمین کی حاضری', 'کوالٹی کنٹرول'],
      chatMsg: 'السلام علیکم! نیکسٹ جنریشن سم کے 50 سبلیمیشن کٹس کا ڈیزائن منظور ہو چکا ہے اور سرکاری کوٹیشن جاری کر دی گئی ہے۔',
      buttonText: 'کوٹیشن منظور کریں',
    },
  },
  {
    id: 'noto-nastaliq',
    nameEn: 'Noto Nastaliq Urdu',
    nameUr: 'نوٹو نستعلیق اردو',
    fontFamily: "'Noto Nastaliq Urdu', serif",
    category: 'Classic Nastaliq (Calligraphic)',
    tag: 'Official Google Nastaliq',
    description:
      'Authentic traditional Pakistani Nastaliq calligraphy, exactly like Urdu newspapers (Jang, Express), official books, and poetry. Extremely natural and prestigious for native Urdu readers.',
    recommendedFor: 'Formal notices, customer invoices, executive reports, and formal headings.',
    samplePhrases: {
      title: 'ایچ آر اسپورٹس مینوفیکچرنگ ڈیش بورڈ',
      navItems: ['ڈیش بورڈ', 'انکوائریز اور لیڈز', 'کوٹیشن و بلنگ', 'ملازمین کی حاضری', 'کوالٹی کنٹرول'],
      chatMsg: 'السلام علیکم! نیکسٹ جنریشن سم کے 50 سبلیمیشن کٹس کا ڈیزائن منظور ہو چکا ہے اور سرکاری کوٹیشن جاری کر دی گئی ہے۔',
      buttonText: 'کوٹیشن منظور کریں',
    },
  },
  {
    id: 'gulzar',
    nameEn: 'Gulzar',
    nameUr: 'گلزار',
    fontFamily: "'Gulzar', serif",
    category: 'Classic Nastaliq (Calligraphic)',
    tag: 'Modern Screen Nastaliq',
    description:
      'A digital-first Nastaliq font created specifically for computer and mobile screens by Google Fonts. Maintains the beauty of Nastaliq curves with tighter vertical spacing.',
    recommendedFor: 'Clean reading experience combining calligraphy with digital screen rendering.',
    samplePhrases: {
      title: 'ایچ آر اسپورٹس مینوفیکچرنگ ڈیش بورڈ',
      navItems: ['ڈیش بورڈ', 'انکوائریز اور لیڈز', 'کوٹیشن و بلنگ', 'ملازمین کی حاضری', 'کوالٹی کنٹرول'],
      chatMsg: 'السلام علیکم! نیکسٹ جنریشن سم کے 50 سبلیمیشن کٹس کا ڈیزائن منظور ہو چکا ہے اور سرکاری کوٹیشن جاری کر دی گئی ہے۔',
      buttonText: 'کوٹیشن منظور کریں',
    },
  },
  {
    id: 'vazirmatn',
    nameEn: 'Vazirmatn',
    nameUr: 'وزیر متن',
    fontFamily: "'Vazirmatn', sans-serif",
    category: 'Geometric Sans',
    tag: 'Technical / Precision Sans',
    description:
      'The "Inter / Helvetica" of the Urdu and Arabic script. Sharp, crisp geometric lines, crystal-clear numbers, and zero clutter. Highly legible at tiny font sizes (11px, 12px).',
    recommendedFor: 'Dense data grids, numbers, stage timers, and compact tables.',
    samplePhrases: {
      title: 'ایچ آر اسپورٹس مینوفیکچرنگ ڈیش بورڈ',
      navItems: ['ڈیش بورڈ', 'انکوائریز اور لیڈز', 'کوٹیشن و بلنگ', 'ملازمین کی حاضری', 'کوالٹی کنٹرول'],
      chatMsg: 'السلام علیکم! نیکسٹ جنریشن سم کے 50 سبلیمیشن کٹس کا ڈیزائن منظور ہو چکا ہے اور سرکاری کوٹیشن جاری کر دی گئی ہے۔',
      buttonText: 'کوٹیشن منظور کریں',
    },
  },
];

export default function UrduFontPreviewPage() {
  const [selectedFont, setSelectedFont] = useState<string>('baloo');
  const [customText, setCustomText] = useState<string>(
    'ایچ آر اسپورٹس — پاکستان کی جدید ترین اسپورٹس مینوفیکچرنگ فیکٹری'
  );
  const [fontSize, setFontSize] = useState<number>(18);
  const [isBold, setIsBold] = useState<boolean>(true);

  const activeFontObj = FONTS.find((f) => f.id === selectedFont) || FONTS[0];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-muted hover:text-ink transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
                Typography Selection
              </span>
              <span className="text-xs text-muted font-mono">• Urdu Style Customizer</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink mt-0.5">
              Urdu Font Selector & Live Comparison
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-base bg-brand hover:bg-brand/90 text-white text-xs font-semibold shadow-xs transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Intro Note */}
      <div className="p-4 rounded-xl border border-border bg-surface-elevated/40 text-xs text-muted leading-relaxed">
        <p>
          <strong className="text-ink">Why Urdu looks hard to read right now:</strong> The previous default was{' '}
          <code className="text-brand">Noto Sans Arabic</code>, which was made for standard Arabic text. For Pakistani
          readers, it looks stiff and unnatural. Below are the <strong>4 top Urdu fonts</strong>. Click on any font card to preview it in real-time across dashboard widgets, buttons, and customer chat.
        </p>
      </div>

      {/* Font Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FONTS.map((font) => {
          const isSelected = selectedFont === font.id;
          return (
            <div
              key={font.id}
              onClick={() => setSelectedFont(font.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden select-none ${
                isSelected
                  ? 'border-brand bg-brand/5 shadow-md ring-2 ring-brand/30'
                  : 'border-border bg-surface hover:border-brand/40 hover:bg-surface-elevated/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isSelected
                          ? 'bg-brand text-white'
                          : 'bg-surface-elevated text-muted border border-border'
                      }`}
                    >
                      {font.tag}
                    </span>
                    <span className="text-[11px] text-muted font-mono">{font.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-ink mt-2 flex items-center gap-2">
                    <span>{font.nameEn}</span>
                    <span
                      dir="rtl"
                      style={{ fontFamily: font.fontFamily }}
                      className="text-lg font-bold text-brand mr-1"
                    >
                      ({font.nameUr})
                    </span>
                  </h3>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-brand border-brand text-white' : 'border-border bg-surface'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Live Card Heading Sample */}
              <div
                dir="rtl"
                style={{
                  fontFamily: font.fontFamily,
                  lineHeight: font.id === 'noto-nastaliq' ? 2.2 : 1.6,
                }}
                className="mt-4 p-3 rounded-lg bg-surface border border-border text-center text-xl font-bold text-ink"
              >
                {font.samplePhrases.title}
              </div>

              {/* Description */}
              <p className="text-xs text-muted mt-3 leading-relaxed">{font.description}</p>
              <div className="mt-2 text-[11px] text-brand/90 font-medium">
                Best for: <span className="text-ink">{font.recommendedFor}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Controls & Live Customizer */}
      <div className="p-6 rounded-2xl border border-border bg-surface space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <Type className="w-4 h-4 text-brand" />
              <span>Live Interactive Sandbox — {activeFontObj.nameEn}</span>
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Type any custom Urdu text or test how buttons, badges, and chat bubbles look.
            </p>
          </div>

          {/* Controls: Size & Weight */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span>Size:</span>
              <button
                onClick={() => setFontSize((s) => Math.max(13, s - 2))}
                className="w-7 h-7 rounded border border-border bg-surface-elevated hover:bg-surface text-ink font-bold"
              >
                -
              </button>
              <span className="font-mono text-ink px-1">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(32, s + 2))}
                className="w-7 h-7 rounded border border-border bg-surface-elevated hover:bg-surface text-ink font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setIsBold((b) => !b)}
              className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                isBold
                  ? 'bg-ink text-surface border-ink'
                  : 'bg-surface text-muted border-border hover:text-ink'
              }`}
            >
              Bold: {isBold ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">
            Type custom Urdu text to test live rendering:
          </label>
          <input
            type="text"
            dir="rtl"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            style={{
              fontFamily: activeFontObj.fontFamily,
              fontSize: `${fontSize}px`,
              fontWeight: isBold ? 700 : 400,
              lineHeight: activeFontObj.id === 'noto-nastaliq' ? 2.2 : 1.6,
            }}
            className="w-full px-4 py-3 rounded-xl border border-brand/40 bg-surface-elevated text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Real UI Components Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* 1. Sidebar Nav Items */}
          <div className="p-4 rounded-xl border border-border bg-surface-elevated/30 space-y-3">
            <div className="text-[11px] uppercase font-mono tracking-wider font-semibold text-muted flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Sidebar Navigation View</span>
            </div>
            <div className="space-y-1.5" dir="rtl">
              {activeFontObj.samplePhrases.navItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    fontFamily: activeFontObj.fontFamily,
                    fontWeight: isBold ? 700 : 500,
                  }}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center justify-between transition ${
                    idx === 0
                      ? 'bg-ink text-surface font-bold'
                      : 'bg-surface text-muted hover:text-ink border border-border'
                  }`}
                >
                  <span>{item}</span>
                  {idx === 1 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500 text-white font-bold">
                      3
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Customer WhatsApp Chat Message */}
          <div className="p-4 rounded-xl border border-border bg-surface-elevated/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-[11px] uppercase font-mono tracking-wider font-semibold text-muted flex items-center gap-1.5 mb-3">
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Customer Chat Bubble</span>
              </div>
              <div
                dir="rtl"
                style={{
                  fontFamily: activeFontObj.fontFamily,
                  fontWeight: isBold ? 600 : 400,
                  lineHeight: activeFontObj.id === 'noto-nastaliq' ? 2.2 : 1.6,
                }}
                className="p-3.5 rounded-2xl bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] text-sm shadow-xs border border-emerald-500/20"
              >
                <p>{activeFontObj.samplePhrases.chatMsg}</p>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-200 text-left font-mono mt-1">
                  12:45 PM • پڑھ لیا گیا ✓✓
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                dir="rtl"
                style={{
                  fontFamily: activeFontObj.fontFamily,
                  fontWeight: 700,
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-brand hover:bg-brand/90 text-white text-sm shadow-xs transition"
              >
                {activeFontObj.samplePhrases.buttonText}
              </button>
            </div>
          </div>

          {/* 3. Metrics & Status Badges */}
          <div className="p-4 rounded-xl border border-border bg-surface-elevated/30 space-y-3">
            <div className="text-[11px] uppercase font-mono tracking-wider font-semibold text-muted flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Kiosk & Badges View</span>
            </div>

            <div className="space-y-2.5" dir="rtl">
              <div className="p-3 rounded-lg bg-surface border border-border">
                <div
                  style={{ fontFamily: activeFontObj.fontFamily, fontWeight: 600 }}
                  className="text-xs text-muted"
                >
                  حالت: ڈیزائن منظور شدہ
                </div>
                <div className="text-lg font-bold font-mono text-ink mt-0.5">50 کٹس — نیکسٹ جنریشن سم</div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  style={{ fontFamily: activeFontObj.fontFamily, fontWeight: 700 }}
                  className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                >
                  آن لائن شفٹ
                </span>
                <span
                  style={{ fontFamily: activeFontObj.fontFamily, fontWeight: 700 }}
                  className="px-2.5 py-1 rounded-full text-xs bg-amber-500/15 text-amber-500 border border-amber-500/30"
                >
                  کوٹیشن زیر غور
                </span>
                <span
                  style={{ fontFamily: activeFontObj.fontFamily, fontWeight: 700 }}
                  className="px-2.5 py-1 rounded-full text-xs bg-purple-500/15 text-purple-500 border border-purple-500/30"
                >
                  کٹنگ فلور جاری
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-border">
                <div
                  style={{ fontFamily: activeFontObj.fontFamily, fontWeight: 600 }}
                  className="text-xs text-muted"
                >
                  کوالٹی چیک انسپیکشن (QC)
                </div>
                <div className="text-sm font-bold text-emerald-500 mt-1">
                  پاس: 48 | ری ورک: 2 | مسترد: 0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
