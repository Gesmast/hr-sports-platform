'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Award, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Factory
} from 'lucide-react';
import { BorderCard } from '@/components/shared/BorderCard';

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    icon: Factory,
    title: 'Direct Factory Transparency',
    description: 'Work directly with our factory floor. No middlemen, no hidden fees, and clear, honest pricing on every order.',
  },
  {
    icon: CheckCircle2,
    title: '100% Sample Approval First',
    description: 'We craft and send a physical master sample for your sign-off. Bulk production begins only when you are completely satisfied.',
  },
  {
    icon: Sparkles,
    title: 'Vibrant, Long-Lasting Colors',
    description: 'High-definition sublimation with premium eco-inks that never fade, crack, or peel — even after 100+ washes.',
  },
  {
    icon: Clock,
    title: 'Reliable 10–14 Day Delivery',
    description: 'We respect your tournament and launch deadlines with guaranteed production schedules and tracked global air shipping.',
  },
  {
    icon: Award,
    title: 'Multi-Stage Quality Control',
    description: 'Every piece passes rigorous inspections for fabric weight, color accuracy, seam strength, and exact sizing before dispatch.',
  },
  {
    icon: Lock,
    title: 'Complete Design & IP Protection',
    description: 'Your artwork, custom patterns, and tech packs remain 100% confidential with signed NDAs to protect your brand.',
  },
];

export const WhyChooseHRSports: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-surface border-b border-hairline border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-burgundy" />
            20+ Years of Manufacturing Excellence
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink leading-[1.08]">
            Why Brands Choose HR Sports.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-2xl text-pretty">
            For over 20 years, we have manufactured professional sportswear and technical activewear for leading athletic brands, sports leagues, and global retailers.
          </p>
        </div>

        {/* 20+ Years Stats Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 p-6 sm:p-8 bg-white border-hairline border-border rounded-base shadow-xs font-mono">
          <div className="border-r border-border-light pr-4">
            <span className="text-[11px] text-muted uppercase tracking-wider block font-bold">Industry Experience</span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight tabular-nums mt-1">20+</div>
            <span className="text-xs text-muted mt-1 block">Years in business</span>
          </div>

          <div className="lg:border-r border-border-light pr-4 pl-2 sm:pl-4">
            <span className="text-[11px] text-muted uppercase tracking-wider block font-bold">Annual Volume</span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight tabular-nums mt-1">3.5M+</div>
            <span className="text-xs text-muted mt-1 block">Garments delivered</span>
          </div>

          <div className="border-r border-border-light pr-4 pl-0 sm:pl-4 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0">
            <span className="text-[11px] text-muted uppercase tracking-wider block font-bold">Global Reach</span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight tabular-nums mt-1">42+</div>
            <span className="text-xs text-muted mt-1 block">Export countries</span>
          </div>

          <div className="pl-2 sm:pl-4 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0">
            <span className="text-[11px] text-muted uppercase tracking-wider block font-bold">Accessible MOQ</span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight tabular-nums mt-1">30 Pcs</div>
            <span className="text-xs text-muted mt-1 block">Per design / style</span>
          </div>
        </div>

        {/* 6 Value Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <BorderCard
                key={idx}
                variant="default"
                hoverEffect
                className="flex flex-col justify-between p-6 sm:p-7 bg-white group hover:border-ink hover:translate-y-[-2px] transition-all duration-200"
              >
                <div>
                  <div className="w-11 h-11 rounded-base bg-surface border-hairline border-border-light flex items-center justify-center text-ink mb-4 group-hover:bg-burgundy group-hover:text-white transition-colors duration-200">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-ink tracking-tight mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </BorderCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseHRSports;
