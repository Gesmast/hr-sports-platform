'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Globe2, Layers } from 'lucide-react';
import { Button } from '@/components/shared/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-hairline border-border-light bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink leading-[1.05] text-balance">
            Turn Your Designs Into Apparel Worth Putting Your Name On.
          </h1>

          {/* Subcopy */}
          <div className="text-base sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto text-pretty space-y-2">
            <p className="font-medium text-ink">Have a design in mind? Let’s make it production ready.</p>
            <p>
              From team kits to performance wear and corporate apparel, we turn your designs into finished products, starting from as little as 30 pieces with high quality sublimation and 24 hour quotes.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/request-a-quote" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                Start Production Quote
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </Button>
            </Link>
          </div>

          {/* Key Stat Badges Row */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-hairline border-border-light text-left">
            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[11px] font-mono uppercase text-muted tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-ink" />
                Minimum Order
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight tabular-nums mt-1">
                30 Pcs
              </div>
              <div className="text-[11px] text-muted mt-0.5">Per style / mixed sizes</div>
            </div>

            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[11px] font-mono uppercase text-muted tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-ink" />
                Turnaround
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight tabular-nums mt-1">
                10–14 Days
              </div>
              <div className="text-[11px] text-muted mt-0.5">Full batch production</div>
            </div>

            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[11px] font-mono uppercase text-muted tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ink" />
                Sample Signoff
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight tabular-nums mt-1">
                100% Guaranteed
              </div>
              <div className="text-[11px] text-muted mt-0.5">Physical sample prior to run</div>
            </div>

            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[11px] font-mono uppercase text-muted tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-ink" />
                Air Freight
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight tabular-nums mt-1">
                3–5 Days
              </div>
              <div className="text-[11px] text-muted mt-0.5">Direct DDP global dispatch</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
