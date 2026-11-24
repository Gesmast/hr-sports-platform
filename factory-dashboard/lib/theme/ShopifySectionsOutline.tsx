'use client';

import React from 'react';
import { usePuck } from '@puckeditor/core';
import {
  Megaphone,
  Layout,
  Film,
  Sparkles,
  Layers,
  FileText,
  Boxes,
  HelpCircle,
  MessageSquare,
  Globe,
  Award,
  Video,
  Share2,
  PhoneCall,
  CheckCircle,
  Sliders,
  Eye,
  EyeOff,
  ChevronRight,
  Shield,
  ChevronDown,
} from 'lucide-react';

const COMPONENT_METADATA: Record<string, { label: string; icon: React.ReactNode }> = {
  AnnouncementBar: { label: 'Announcement Bar', icon: <Megaphone className="w-3.5 h-3.5 text-amber-500" /> },
  HeaderNav: { label: 'Header Navigation', icon: <Layout className="w-3.5 h-3.5 text-blue-500" /> },
  HeroSection: { label: 'Hero Headline & Video', icon: <Film className="w-3.5 h-3.5 text-purple-500" /> },
  TrustedByStrip: { label: 'Trusted By Strip', icon: <Shield className="w-3.5 h-3.5 text-emerald-500" /> },
  TheHRSportsBanner: { label: 'The HR Sports Banner', icon: <Sparkles className="w-3.5 h-3.5 text-pink-500" /> },
  VideoSection: { label: 'Video Banner', icon: <Video className="w-3.5 h-3.5 text-red-500" /> },
  ChooseYourStyle: { label: 'Apparel Categories Grid', icon: <Layers className="w-3.5 h-3.5 text-indigo-500" /> },
  CategoryHeader: { label: 'Category Header & Tagline', icon: <FileText className="w-3.5 h-3.5 text-sky-500" /> },
  CategoryProductGrid: { label: 'Category Products Grid', icon: <Boxes className="w-3.5 h-3.5 text-cyan-500" /> },
  HowWeWork: { label: 'How We Work (Process)', icon: <Sliders className="w-3.5 h-3.5 text-orange-500" /> },
  WhyChooseHRSports: { label: 'Why Choose HR Sports', icon: <Award className="w-3.5 h-3.5 text-emerald-500" /> },
  CapabilityGrid: { label: 'Machinery Capabilities', icon: <Layers className="w-3.5 h-3.5 text-zinc-500" /> },
  ShipWorldwideGrid: { label: 'We Ship Everywhere', icon: <Globe className="w-3.5 h-3.5 text-blue-500" /> },
  ClientReviews: { label: 'Client Testimonials', icon: <MessageSquare className="w-3.5 h-3.5 text-teal-500" /> },
  LocalRetailComparisonTable: { label: 'Retail Comparison Table', icon: <Sliders className="w-3.5 h-3.5 text-violet-500" /> },
  CoreValues: { label: 'Core Values Pillars', icon: <Award className="w-3.5 h-3.5 text-amber-500" /> },
  VisionMission: { label: 'Vision & Mission', icon: <Sparkles className="w-3.5 h-3.5 text-rose-500" /> },
  HomeFAQSection: { label: 'FAQ Accordion', icon: <HelpCircle className="w-3.5 h-3.5 text-yellow-500" /> },
  SocialFollowApp: { label: 'Social Community Follow', icon: <Share2 className="w-3.5 h-3.5 text-blue-600" /> },
  HomeCta: { label: "Let's Talk CTA Banner", icon: <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> },
  RichTextSection: { label: 'Rich Text Section', icon: <FileText className="w-3.5 h-3.5 text-zinc-600" /> },
};

interface ShopifySectionsOutlineProps {
  pageName: string;
}

export function ShopifySectionsOutline({ pageName }: ShopifySectionsOutlineProps) {
  const { appState, dispatch } = usePuck();
  const selectedIndex = appState.ui.itemSelector?.index;

  const content = appState.data?.content || [];

  const handleSelectSection = (index: number) => {
    dispatch({
      type: 'setUi',
      ui: { itemSelector: { index } },
    });

    // Notify iframe to scroll to this block
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'PUCK_BLOCK_SCROLL', index },
        '*'
      );
    }
  };

  // Header group is item 0 (AnnouncementBar) and HeaderNav if present
  const headerItems = content.filter((item, idx) => idx === 0 || item.type === 'HeaderNav');
  const templateItems = content.filter((item, idx) => idx > 0 && item.type !== 'HeaderNav');

  return (
    <div className="w-72 h-full min-h-0 flex flex-col bg-surface border-r border-border select-none text-ink shrink-0 overflow-hidden font-sans">
      {/* Pane Header */}
      <div className="p-3.5 border-b border-border bg-surface-elevated flex items-center justify-between shrink-0">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-muted block">
            Sections
          </span>
          <span className="text-xs font-bold text-ink truncate block">
            {pageName}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface border border-border text-muted">
          {content.length} sections
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border/60 pb-16">
        
        {/* ── 1. HEADER GROUP ── */}
        <div className="p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-bold flex items-center justify-between">
            <span>Header Group</span>
            <span className="text-[9px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">Global</span>
          </div>

          {headerItems.map((item, localIdx) => {
            const actualIndex = content.indexOf(item);
            const isSelected = selectedIndex === actualIndex;
            const meta = COMPONENT_METADATA[item.type] || {
              label: item.type,
              icon: <Layout className="w-3.5 h-3.5 text-zinc-500" />,
            };

            return (
              <button
                key={item.props?.id || actualIndex}
                type="button"
                onClick={() => handleSelectSection(actualIndex)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-300 font-bold border border-sky-300 dark:border-sky-800 shadow-2xs'
                    : 'hover:bg-surface-elevated text-ink/90 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="shrink-0">{meta.icon}</span>
                  <span className="truncate">{meta.label}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── 2. TEMPLATE SECTIONS ── */}
        <div className="p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-bold flex items-center justify-between">
            <span>Template</span>
            <span className="text-[9px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">Page</span>
          </div>

          {templateItems.map((item) => {
            const actualIndex = content.indexOf(item);
            const isSelected = selectedIndex === actualIndex;
            const meta = COMPONENT_METADATA[item.type] || {
              label: item.type,
              icon: <Layout className="w-3.5 h-3.5 text-zinc-500" />,
            };

            return (
              <button
                key={item.props?.id || actualIndex}
                type="button"
                onClick={() => handleSelectSection(actualIndex)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-300 font-bold border border-sky-300 dark:border-sky-800 shadow-2xs'
                    : 'hover:bg-surface-elevated text-ink/90 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="shrink-0">{meta.icon}</span>
                  <span className="truncate">{meta.label}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── 3. FOOTER GROUP ── */}
        <div className="p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted font-bold flex items-center justify-between">
            <span>Footer Group</span>
            <span className="text-[9px] px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">Global</span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-muted bg-surface-elevated/40 border border-border/50">
            <div className="flex items-center gap-2">
              <Boxes className="w-3.5 h-3.5 text-muted" />
              <span>Footer (Copyright &amp; Links)</span>
            </div>
            <span className="text-[10px] font-mono text-muted">Fixed</span>
          </div>
        </div>

      </div>

      {/* Pane Footer Tip */}
      <div className="p-2.5 bg-surface-elevated border-t border-border text-[10px] text-muted flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
        <span className="leading-tight">
          Click any section or button in preview to edit its settings.
        </span>
      </div>
    </div>
  );
}
