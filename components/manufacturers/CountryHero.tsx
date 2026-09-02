import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe2, ShieldCheck, Zap, Layers } from 'lucide-react';
import { Country } from '@/types';
import { Button } from '@/components/shared/Button';

interface CountryHeroProps {
  country: Country;
}

export const CountryHero: React.FC<CountryHeroProps> = ({ country }) => {
  return (
    <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-6">
          {/* Flag & Region Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-surface border-hairline border-border rounded-base text-xs font-mono font-semibold uppercase tracking-widest text-ink">
            <span className="text-base leading-none">{country.flagIcon}</span>
            <span>Direct OEM Export & Supply • {country.name}</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink leading-[1.08] text-balance">
            {country.headline}
          </h1>

          {/* Subcopy */}
          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-3xl text-pretty">
            {country.subcopy}
          </p>

          {/* Dual CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href={`/contact?market=${encodeURIComponent(country.slug)}`}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                Request {country.name} Production Quote
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </Button>
            </Link>
            <Link href="#comparison">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Direct vs. Local Retail Comparison
              </Button>
            </Link>
          </div>

          {/* Country Stat Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-hairline border-border-light text-left font-mono">
            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[10px] uppercase text-muted tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-ink" />
                Minimum Order
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-ink tracking-tight mt-1">
                {country.heroStats.moq.split(' ')[0]} {country.heroStats.moq.split(' ')[1]}
              </div>
              <div className="text-[10px] text-muted mt-0.5">Per style / mixed sizes</div>
            </div>

            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[10px] uppercase text-muted tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-ink" />
                Factory Production
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-ink tracking-tight mt-1">
                {country.heroStats.productionDays}
              </div>
              <div className="text-[10px] text-muted mt-0.5">Standard batch run</div>
            </div>

            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[10px] uppercase text-muted tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-ink" />
                Express Shipping
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-ink tracking-tight mt-1">
                {country.heroStats.shippingDays}
              </div>
              <div className="text-[10px] text-muted mt-0.5">Tracked DDP freight</div>
            </div>

            <div className="p-3.5 bg-surface border-hairline border-border-light rounded-base">
              <div className="text-[10px] uppercase text-muted tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ink" />
                Market Footprint
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-ink tracking-tight mt-1 truncate">
                {country.heroStats.happyClients || '500+ OEM Clients'}
              </div>
              <div className="text-[10px] text-muted mt-0.5">Verified deliveries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountryHero;
