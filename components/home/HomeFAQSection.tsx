'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, MessageSquare } from 'lucide-react';
import { faqs } from '@/data/faqs';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { Button } from '@/components/shared/Button';

export const HomeFAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-white border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-burgundy" />
            Questions & Direct Answers
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink leading-[1.08]">
            Frequently Asked Questions.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-2xl text-pretty">
            Everything you need to know about our minimum order quantities (30 pcs), physical sample approvals, tech pack intake, and worldwide DDP air freight delivery.
          </p>
        </div>

        {/* Master FAQ Grid: Left Accordion & Right Sticky Help Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Categorized FAQ Accordion */}
          <div className="lg:col-span-8 space-y-6">
            <FAQAccordion items={faqs} />
          </div>

          {/* Right Column: Sticky Contact & Help Prompt */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 sm:p-7 bg-surface border-hairline border-border rounded-base space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-base bg-white border-hairline border-border flex items-center justify-center text-burgundy">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-ink tracking-tight">
                  Have a specific question?
                </h3>
                <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                  Our team is available to discuss your fabrics, tech packs, and delivery timelines directly.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Link href="/contact" className="block">
                  <Button variant="primary" size="md" className="w-full gap-2">
                    Contact Us
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick 24h quote note */}
            <div className="p-4 bg-white border-hairline border-border-light rounded-base text-[11px] font-mono text-muted space-y-1">
              <div className="font-bold uppercase text-ink">Commercial Quote SLA</div>
              <p>• 24-Hour turnaround for complete tech packs</p>
              <p>• Itemized price matrix per volume tier</p>
              <p>• Direct WhatsApp / email engineer contact</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQSection;
