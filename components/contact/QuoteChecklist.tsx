import React from 'react';
import Link from 'next/link';
import { CheckSquare, ArrowRight, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';
import { BorderCard } from '@/components/shared/BorderCard';
import { SITE_CONFIG, MOQ_LABEL } from '@/lib/constants';

const checklistItems = [
  'Garment/product type (jerseys, kits, corporate uniforms, etc.)',
  'Design files, reference images, or a 3D garment file (CLO3D, Browzwear, etc.)',
  `Estimated order quantity (minimum ${MOQ_LABEL})`,
  'Preferred fabric or material blend',
  'Sizes and color details (mixed size ratios supported)',
  'Printing or embroidery requirements (Dye sublimation, silicone crests, 3D vinyl)',
  'Branding/logo placement (woven neck labels, care tags, polybags)',
  'Target delivery timeline & destination country',
];

const quickFaqs = [
  {
    q: 'Can I split the 30-piece MOQ across sizes?',
    a: 'Yes, you can distribute the 30-unit minimum across sizes S through 3XL at no additional fee.',
  },
  {
    q: 'Do you provide a physical sample first?',
    a: 'Yes. We cut, print, and ship a physical prototype before bulk production ever begins.',
  },
  {
    q: 'How fast do you respond to quotes?',
    a: 'Our textile engineering desk responds with a complete commercial quote within 24 hours.',
  },
];

export const QuoteChecklist: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Pre-Flight Preparation Checklist Card */}
      <BorderCard variant="surface" className="p-6 space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-ink" />
            Preparation Guide
          </div>
          <h3 className="text-lg font-extrabold text-ink tracking-tight">
            What We’ll Need for an Accurate Quote
          </h3>
          <p className="text-xs text-muted mt-1">
            Having these specifications ready ensures we can turn around an exact itemized proforma in 24 hours:
          </p>
        </div>

        <ul className="space-y-2.5 text-xs text-ink/90 border-t border-border-light pt-3">
          {checklistItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-mono text-[10px] bg-ink text-white w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">
                ✓
              </span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </BorderCard>

      {/* Direct Contact Channels */}
      <BorderCard variant="default" className="p-6 space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-ink">
          Factory Contact Desk
        </h4>
        <div className="space-y-3 text-xs text-muted">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-ink shrink-0" />
            <div>
              <span className="font-semibold text-ink block">Direct Quotes:</span>
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:underline">
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-ink shrink-0" />
            <div>
              <span className="font-semibold text-ink block">Phone / Export Desk:</span>
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:underline">
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-ink shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-ink block">Factory & Export Hub:</span>
              <span>{SITE_CONFIG.address}</span>
            </div>
          </div>
        </div>
      </BorderCard>

      {/* Quick FAQ Excerpt */}
      <BorderCard variant="surface" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-ink flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Quick FAQ Excerpt
          </h4>
          <Link
            href="/faq"
            className="text-[11px] font-mono font-bold text-ink hover:underline flex items-center gap-1"
          >
            <span>See all FAQs</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3 text-xs">
          {quickFaqs.map((faq, idx) => (
            <div key={idx} className="border-b border-border-light pb-2.5 last:border-0 last:pb-0">
              <span className="font-bold text-ink block mb-0.5">{faq.q}</span>
              <p className="text-muted text-[11px] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </BorderCard>
    </div>
  );
};

export default QuoteChecklist;
