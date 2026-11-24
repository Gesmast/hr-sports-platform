'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ChevronDown, 
  HelpCircle, 
  ArrowRight, 
  MessageCircle, 
  Mail, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { faqs as allFaqs } from '@/data/faqs';
import { Button } from '@/components/shared/Button';
import { SITE_CONFIG } from '@/lib/constants';
import { FAQItem } from '@/types';

// Category Labels mapping
const categoryLabels: Record<string, string> = {
  all: 'All Questions',
  ordering: 'Ordering & MOQ',
  production: 'Production & Quality',
  policies: 'Policies & Returns',
  shipping: 'Shipping & Customs',
  design: 'Design & NDAs',
  payment: 'Payment & Terms',
};

// Rich semantic synonym & intent dictionary
// Maps common customer phrasing, informal language, and intents to underlying manufacturing/policy topics
const INTENT_SYNONYMS: Record<string, string[]> = {
  // Returns, Refunds, Quality issues
  refund: ['returns', 'remake', 'money', 'credit', 'defective', 'replacement', 'dispute', 'guarantee', 'broken'],
  refunds: ['returns', 'remake', 'money', 'credit', 'defective', 'replacement', 'dispute', 'guarantee'],
  return: ['refund', 'remake', 'defective', 'damaged', 'exchange', 'warranty', 'guarantee', 'replacement', 'problem'],
  returns: ['refund', 'remake', 'defective', 'damaged', 'exchange', 'warranty', 'guarantee', 'replacement'],
  remake: ['return', 'refund', 'replacement', 'redo', 'defective', 'aql', 'guarantee'],
  defective: ['broken', 'damaged', 'remake', 'flaw', 'stitching', 'wrong', 'quality', 'aql', 'guarantee'],
  defect: ['broken', 'damaged', 'remake', 'flaw', 'stitching', 'wrong', 'quality', 'aql', 'guarantee'],
  defects: ['broken', 'damaged', 'remake', 'flaw', 'stitching', 'wrong', 'quality', 'aql', 'guarantee'],
  broken: ['damaged', 'defective', 'remake', 'puncture', 'transit', 'tear', 'flaw', 'faulty'],
  damaged: ['broken', 'defective', 'remake', 'puncture', 'transit', 'water', 'insurance', 'courier'],
  damage: ['broken', 'defective', 'remake', 'puncture', 'transit', 'water', 'insurance', 'courier'],
  faulty: ['defective', 'remake', 'quality', 'stitching', 'aql', 'inspection', 'guarantee'],
  flawed: ['defective', 'remake', 'quality', 'flaw', 'stitching', 'guarantee'],
  mistake: ['remake', 'defective', 'wrong size', 'dispute', 'guarantee', 'exchange'],
  wrong: ['defective', 'remake', 'wrong size', 'misprinted', 'deviate', 'exchange'],
  exchange: ['return', 'remake', 'replacement', 'swap', 'wrong size'],
  money: ['refund', 'deposit', 'payment', 'cost', 'price', 'credit', 'balance'],
  reimburse: ['refund', 'credit', 'return', 'money'],

  // Taxes, Customs, DDP, Duties
  tax: ['customs', 'duty', 'duties', 'tariff', 'tariffs', 'ddp', 'vat', 'import', 'clearance', 'border'],
  taxes: ['customs', 'duty', 'duties', 'tariff', 'tariffs', 'ddp', 'vat', 'import', 'clearance', 'border'],
  customs: ['duty', 'duties', 'tariff', 'ddp', 'clearance', 'border', 'taxes', 'import', 'fees'],
  duty: ['customs', 'taxes', 'tariff', 'ddp', 'clearance', 'import', 'tariffs'],
  duties: ['customs', 'taxes', 'tariff', 'ddp', 'clearance', 'import', 'tariffs'],
  tariff: ['customs', 'duty', 'tariffs', 'ddp', 'taxes', 'import', 'clearance'],
  tariffs: ['customs', 'duty', 'tariff', 'ddp', 'taxes', 'import', 'clearance'],
  vat: ['taxes', 'customs', 'duty', 'ddp', 'import'],
  ddp: ['customs', 'duty', 'taxes', 'tariffs', 'delivered duty paid', 'clearance', 'door to door'],
  clearance: ['customs', 'duty', 'border', 'hs code', 'proforma', 'invoice', 'import'],
  import: ['customs', 'duty', 'tariffs', 'taxes', 'international', 'ddp', 'transit'],

  // Speed, Lead times, Timelines, Rush
  fast: ['lead time', 'turnaround', 'speed', 'quick', 'rush', 'urgent', 'express', 'air', 'how long'],
  speed: ['lead time', 'turnaround', 'fast', 'quick', 'rush', 'urgent', 'days', 'transit', 'timeline'],
  quick: ['lead time', 'turnaround', 'fast', 'speed', 'rush', 'urgent', 'express'],
  rush: ['urgent', 'emergency', 'tournament', 'fast', 'expedited', 'priority', 'quick'],
  urgent: ['rush', 'emergency', 'tournament', 'fast', 'expedited', 'priority', 'deadline'],
  time: ['lead time', 'turnaround', 'how long', 'transit', 'duration', 'schedule', 'days'],
  timeline: ['lead time', 'turnaround', 'schedule', 'production time', 'transit', 'how long'],
  when: ['lead time', 'turnaround', 'transit', 'delivery', 'arrival', 'how long'],
  howlong: ['lead time', 'turnaround', 'transit', 'days', 'duration'],
  duration: ['lead time', 'turnaround', 'transit', 'timeline', 'days'],

  // Shipping & Couriers
  shipping: ['transit', 'delivery', 'courier', 'dhl', 'fedex', 'ups', 'freight', 'air', 'ocean', 'tracking'],
  ship: ['shipping', 'delivery', 'courier', 'freight', 'transit', 'dispatch'],
  courier: ['dhl', 'fedex', 'ups', 'express', 'shipping', 'delivery'],
  dhl: ['courier', 'express', 'air', 'shipping', 'tracking', 'transit'],
  fedex: ['courier', 'express', 'air', 'shipping', 'tracking', 'transit'],
  ups: ['courier', 'express', 'air', 'shipping', 'tracking', 'transit'],
  plane: ['air express', 'air freight', 'flying', 'dhl', 'fedex', 'fast'],
  air: ['air express', 'dhl', 'fedex', 'transit', 'fast'],
  ocean: ['sea', 'cargo', 'container', 'freight', 'boat', 'vessel', '1000 units'],
  sea: ['ocean', 'cargo', 'container', 'freight', 'boat', 'vessel'],
  container: ['ocean freight', 'sea', 'large volume', '1000 units', 'cargo'],
  tracking: ['delivery', 'courier', 'dhl', 'fedex', 'shipping', 'transit'],

  // Legal, Privacy, NDA, IP
  secret: ['nda', 'confidential', 'intellectual property', 'privacy', 'ip', 'protection', 'copyright'],
  confidential: ['nda', 'intellectual property', 'privacy', 'secret', 'protection'],
  steal: ['nda', 'intellectual property', 'copyright', 'trademark', 'protection', 'stolen'],
  stolen: ['nda', 'intellectual property', 'copyright', 'trademark', 'protection'],
  protect: ['nda', 'intellectual property', 'privacy', 'security', 'confidentiality'],
  protection: ['nda', 'intellectual property', 'privacy', 'security', 'confidentiality'],
  nda: ['confidentiality', 'intellectual property', 'copyright', 'contract', 'protection', 'secret'],
  ip: ['intellectual property', 'nda', 'copyright', 'trademark', 'ownership', 'designs'],
  trademark: ['intellectual property', 'brand', 'copyright', 'nda', 'logo'],
  copyright: ['intellectual property', 'brand', 'trademark', 'nda', 'patterns'],
  privacy: ['gdpr', 'data protection', 'security', 'encryption', 'confidentiality'],
  data: ['privacy', 'gdpr', 'security', 'encryption', 'confidentiality'],
  gdpr: ['privacy', 'data protection', 'security', 'legal'],
  contract: ['terms of service', 'agreement', 'proforma', 'purchase order', 'legal'],
  legal: ['terms of service', 'contract', 'agreement', 'law', 'nda', 'policy'],
  lawyer: ['terms of service', 'legal', 'contract', 'agreement', 'nda'],

  // Ordering & MOQ
  minimum: ['moq', 'units', 'pieces', 'smallest', 'batch', '15 pieces', 'small quantity'],
  moq: ['minimum', 'units', 'pieces', 'smallest', 'batch', '15 pieces', 'small quantity'],
  small: ['moq', 'minimum', 'pieces', 'batch', 'units', '15 units', 'starter'],
  few: ['moq', 'minimum', 'pieces', 'batch', '15'],
  pieces: ['moq', 'minimum', 'units', 'garments', 'volume', 'batch'],
  units: ['moq', 'minimum', 'pieces', 'garments', 'volume', 'batch'],
  quantity: ['volume', 'units', 'pieces', 'moq', 'batch size'],

  // Samples & Prototyping
  sample: ['prototype', 'test piece', 'proof', 'mockup', 'fitting', 'pre-production', 'swatch'],
  samples: ['prototype', 'test piece', 'proof', 'mockup', 'fitting', 'pre-production'],
  prototype: ['sample', 'test piece', 'proof', 'mockup', 'pre-production'],
  proof: ['sample', 'prototype', 'mockup', 'approval', 'color test'],
  mockup: ['design', 'sample', '3d', 'render', 'proof', 'cad'],
  swatch: ['color', 'fabric test', 'pantone', 'sample'],

  // Wash, Durability & Fabric
  wash: ['durability', 'fade', 'peeling', 'cracking', 'colorfastness', 'laundry', 'shrinkage'],
  washing: ['durability', 'fade', 'peeling', 'cracking', 'colorfastness', 'laundry', 'shrinkage'],
  laundry: ['wash', 'durability', 'colorfastness', 'temperature', 'care'],
  fade: ['wash', 'durability', 'colorfastness', 'sublimation', 'pantone', 'quality', 'iso'],
  fading: ['wash', 'durability', 'colorfastness', 'sublimation', 'pantone', 'quality'],
  peeling: ['sublimation', 'durability', 'heat press', 'cracking', 'quality'],
  cracking: ['sublimation', 'durability', 'quality', 'peeling'],
  durability: ['wash', 'colorfastness', 'seam strength', 'tensile', 'quality', 'lifespan'],
  fabric: ['materials', 'textiles', 'mesh', 'polyester', 'interlock', 'spandex', 'gsm'],
  fabrics: ['materials', 'textiles', 'mesh', 'polyester', 'interlock', 'spandex', 'gsm'],
  cloth: ['fabric', 'materials', 'textiles', 'polyester'],
  material: ['fabric', 'textiles', 'mesh', 'polyester', 'interlock', 'gsm'],
  materials: ['fabric', 'textiles', 'mesh', 'polyester', 'interlock', 'gsm'],
  gsm: ['weight', 'thickness', 'fabric weight', 'grams', 'density'],

  // Payment & Invoicing
  pay: ['payment', 'deposit', 'wire', 'swift', 'invoice', 'card', 'terms', 'milestones'],
  payment: ['deposit', 'wire', 'swift', 'invoice', 'credit card', 'terms', '50%', 'balance'],
  payments: ['deposit', 'wire', 'swift', 'invoice', 'credit card', 'terms'],
  card: ['credit card', 'payment', 'stripe', 'visa', 'mastercard'],
  creditcard: ['payment', 'card', 'visa', 'mastercard'],
  wire: ['bank wire', 'swift', 't/t', 'bank transfer', 'international transfer'],
  swift: ['bank wire', 'wire transfer', 't/t', 'bank payment'],
  deposit: ['50%', 'milestone', 'payment', 'advance', 'order start'],
  invoice: ['proforma', 'commercial invoice', 'receipt', 'billing', 'hs code'],
  cancel: ['cancellation', 'modify', 'change order', 'deposit refund', 'stop order'],
  cancelling: ['cancellation', 'modify', 'change order', 'deposit refund'],
  cancellation: ['cancel', 'modify', 'change order', 'deposit refund', 'stop order'],

  // Sports & Apparel Categories
  cricket: ['custom sportswear', 'sublimation jersey', 'cricket kit', 'uniforms'],
  football: ['soccer', 'custom sportswear', 'match kit', 'jerseys'],
  soccer: ['football', 'custom sportswear', 'match kit', 'jerseys'],
  basketball: ['custom sportswear', 'court jersey', 'mesh shorts'],
  hockey: ['custom sportswear', 'ice hockey', 'sweater', 'field hockey'],
  uniform: ['uniforms', 'corporate', 'security', 'promotional', 'workwear'],
  uniforms: ['uniform', 'corporate', 'security', 'promotional', 'workwear'],
  corporate: ['uniforms', 'polo', 'tech uniform', 'company wear'],
  security: ['uniforms', 'tactical', 'guard', 'durable'],
  promotional: ['uniforms', 'events', 'brand promo', 'giveaway'],
};

// Popular Quick Search Suggestions
const QUICK_SUGGESTIONS = [
  { label: 'Returns & Quality Guarantee', query: 'returns policy defect replacement' },
  { label: 'DDP & Customs Duties', query: 'customs duties taxes DDP' },
  { label: 'MOQ (15 Pieces)', query: 'minimum order quantity MOQ' },
  { label: 'NDAs & IP Protection', query: 'protect brand designs NDA' },
  { label: 'Rush Orders & Timelines', query: 'rush order turnaround time' },
  { label: 'Wash & Durability', query: 'washing durability color fade' },
  { label: 'Payment & 50% Deposit', query: 'payment methods bank wire deposit' },
];

export const FAQSearchHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'faq-moq': true,
    'faq-return-remake-policy': true,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smart Search Engine with Synonym Expansion & Intent Scoring
  const scoredFaqs = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();

    // If empty query, return all matching category
    if (!rawQuery) {
      return allFaqs
        .filter((item) => selectedCategory === 'all' || item.category === selectedCategory)
        .map((item) => ({ ...item, score: 0 }));
    }

    // Tokenize query words
    const queryTokens = rawQuery
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1);

    // Expand query words with semantic synonyms
    const expandedIntents = new Set<string>();
    queryTokens.forEach((token) => {
      expandedIntents.add(token);
      // Check direct synonyms
      if (INTENT_SYNONYMS[token]) {
        INTENT_SYNONYMS[token].forEach((syn) => expandedIntents.add(syn.toLowerCase()));
      }
      // Check singular / plural forms (e.g. refunds -> refund)
      if (token.endsWith('s')) {
        const singular = token.slice(0, -1);
        if (INTENT_SYNONYMS[singular]) {
          INTENT_SYNONYMS[singular].forEach((syn) => expandedIntents.add(syn.toLowerCase()));
        }
      }
      if (token.endsWith('ing')) {
        const base = token.slice(0, -3);
        if (INTENT_SYNONYMS[base]) {
          INTENT_SYNONYMS[base].forEach((syn) => expandedIntents.add(syn.toLowerCase()));
        }
      }
    });

    const intentList = Array.from(expandedIntents);

    // Score every FAQ item
    const results = allFaqs
      .filter((item) => selectedCategory === 'all' || item.category === selectedCategory)
      .map((item) => {
        let score = 0;
        const qLower = item.question.toLowerCase();
        const aLower = item.answer.toLowerCase();
        const catLabelLower = (categoryLabels[item.category] || '').toLowerCase();
        const keywordsLower = (item.keywords || []).map((k) => k.toLowerCase());
        const tagsLower = (item.tags || []).map((t) => t.toLowerCase());

        // 1. Exact phrase match in Question (+120)
        if (qLower.includes(rawQuery)) {
          score += 120;
        }

        // 2. Exact phrase match in Answer (+50)
        if (aLower.includes(rawQuery)) {
          score += 50;
        }

        // 3. Query tokens matched in Question / Keywords / Answer
        queryTokens.forEach((token) => {
          if (qLower.includes(token)) score += 45;
          if (keywordsLower.some((k) => k.includes(token))) score += 40;
          if (tagsLower.some((t) => t.includes(token))) score += 35;
          if (aLower.includes(token)) score += 18;
          if (catLabelLower.includes(token)) score += 20;
        });

        // 4. Semantic Synonyms / Intent match
        intentList.forEach((intent) => {
          if (qLower.includes(intent)) score += 30;
          if (keywordsLower.some((k) => k.includes(intent))) score += 25;
          if (tagsLower.some((t) => t.includes(intent))) score += 20;
          if (aLower.includes(intent)) score += 10;
        });

        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return results;
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    scoredFaqs.forEach((f) => {
      allOpen[f.id] = true;
    });
    setExpandedIds(allOpen);
  };

  const handleCollapseAll = () => {
    setExpandedIds({});
  };

  // Helper function to highlight search matches
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const terms = query.trim().split(/\s+/).filter((t) => t.length > 1);
    if (terms.length === 0) return text;

    const regex = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-black font-semibold rounded-xs px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="py-12 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono uppercase tracking-wider text-black font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-black" />
            Knowledge Base &amp; Policies
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black leading-tight">
            How Can We Help You?
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
            Search our complete manufacturing policies, minimum order quantities ({SITE_CONFIG.productionLeadTimeDays}), sample approval protocols, DDP customs clearance, and defect return guarantees.
          </p>
        </div>

        {/* Smart Semantic Search Box */}
        <div className="max-w-3xl mx-auto relative space-y-3">
          <div className="relative flex items-center shadow-sm">
            <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything: refund policy, DDP taxes, MOQ, turnaround, NDAs, wash fade..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-12 pr-28 py-4 text-sm sm:text-base text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
            />
            <div className="absolute right-3 flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-zinc-400 hover:text-black rounded-md transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono text-zinc-500 bg-white border border-zinc-300 rounded-md shadow-2xs">
                /
              </kbd>
            </div>
          </div>

          {/* Quick Clickable Search Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono text-zinc-500">
            <span className="shrink-0 text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick topics:
            </span>
            {QUICK_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchQuery(sug.label);
                  setSelectedCategory('all');
                }}
                className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-black transition-colors shrink-0 whitespace-nowrap"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mt-2 px-1">
            <span>
              {searchQuery ? (
                <>
                  Semantic engine matched <strong>{scoredFaqs.length}</strong> questions for &ldquo;{searchQuery}&rdquo;
                </>
              ) : (
                <>Showing <strong>{scoredFaqs.length}</strong> questions</>
              )}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExpandAll}
                className="hover:text-black underline transition-colors"
              >
                Expand all
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="hover:text-black underline transition-colors"
              >
                Collapse all
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 select-none max-w-4xl mx-auto">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const count = key === 'all' 
              ? allFaqs.length 
              : allFaqs.filter((f) => f.category === key).length;
            const isSelected = selectedCategory === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-black text-white border-black font-bold shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200 hover:text-black'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {scoredFaqs.length > 0 ? (
            scoredFaqs.map((faq, index) => {
              const isOpen = !!expandedIds[faq.id];
              const isTopMatch = searchQuery && index === 0;

              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl overflow-hidden bg-white transition-all ${
                    isTopMatch ? 'border-black ring-1 ring-black/20 shadow-sm' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-sm">
                          {categoryLabels[faq.category] || faq.category}
                        </span>
                        {faq.category === 'policies' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Official Policy
                          </span>
                        )}
                        {isTopMatch && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Best Answer Match
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-black tracking-tight leading-snug">
                        {highlightText(faq.question, searchQuery)}
                      </h3>
                    </div>
                    <div className="mt-1 text-zinc-500 transition-transform duration-200">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : ''}`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-sm sm:text-base text-zinc-700 leading-relaxed border-t border-zinc-100 pt-4 space-y-4">
                          <p>{highlightText(faq.answer, searchQuery)}</p>

                          {/* Related Tags Strip */}
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-2">
                              <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                                <Tag className="w-2.5 h-2.5" />
                                Topics:
                              </span>
                              {faq.tags.map((tag, tIdx) => (
                                <button
                                  key={tIdx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                  }}
                                  className="text-[10px] font-mono px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            /* No Results Empty State */
            <div className="text-center py-16 px-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-black">No questions found matching &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                Our semantic search understands questions even if words don&apos;t match exactly. Try asking about <span className="font-semibold text-black">returns</span>, <span className="font-semibold text-black">customs duties</span>, <span className="font-semibold text-black">MOQ</span>, or <span className="font-semibold text-black">wash care</span>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-black underline underline-offset-4 hover:text-zinc-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Policy Direct Links Strip */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-black">Need the full unedited legal texts?</h4>
            <p className="text-xs text-zinc-500 font-mono">Review our comprehensive commercial agreements and export policies.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center font-mono text-xs">
            <Link href="/shipping-and-returns" className="text-black underline underline-offset-4 hover:opacity-75">
              Shipping &amp; Returns
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" className="text-black underline underline-offset-4 hover:opacity-75">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="text-black underline underline-offset-4 hover:opacity-75">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Didn't Find Your Answer? Contact Banner */}
        <div className="max-w-4xl mx-auto mt-16 bg-[#111215] text-white rounded-2xl p-8 sm:p-10 border border-zinc-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
                <MessageCircle className="w-4 h-4 text-white" />
                Still have questions?
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Didn&apos;t find the answer you need?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our manufacturing engineers and apparel specialists are available 24/7 to review your tech pack, provide custom fabric guidance, and calculate exact production quotes.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3">
              <Link href="/contact" className="w-full">
                <Button
                  variant="silver"
                  size="md"
                  className="w-full justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Our Production Team
                </Button>
              </Link>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello HR Sports team, I reviewed your FAQ page and have a specific custom inquiry.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-center gap-2 text-white border-zinc-700 hover:bg-zinc-900"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQSearchHub;
