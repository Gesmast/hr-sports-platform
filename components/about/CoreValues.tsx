import React from 'react';
import { ShieldCheck, Lock, Leaf, CheckCircle2, Award, Clock } from 'lucide-react';
import { BorderCard } from '@/components/shared/BorderCard';
import { SectionHeading } from '@/components/shared/SectionHeading';

interface ValueItem {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
}

const coreValues: ValueItem[] = [
  {
    icon: Award,
    title: 'Quality Assurance Protocol',
    subtitle: 'AQL 1.0 / 2.5 Standards',
    description: 'Every production batch passes 4 strict quality checkpoints: tensile fabric testing, spectrophotometer color calibration, in-line tension stitching, and needle-detector clearance.',
  },
  {
    icon: Lock,
    title: 'NDA & IP Client Protection',
    subtitle: 'Confidential Production Vaults',
    description: 'We execute binding Non-Disclosure Agreements prior to receiving tech packs. Your proprietary patterns, Pantone colorways, and artwork are never disclosed or repurposed.',
  },
  {
    icon: Leaf,
    title: 'Ethical & Sustainable Manufacturing',
    subtitle: 'OEKO-TEX® & GRS Certified',
    description: 'Zero hazardous chemical dyes, fair living wages for our master pattern technicians, clean energy sublimation presses, and GRS-certified recycled ocean yarn options.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery Guarantee',
    subtitle: 'Strict Production SLAs',
    description: 'We understand that team seasons, retail drop dates, and tournament kickoffs cannot move. Our logistics team guarantees dispatch schedules with DDP air courier tracking.',
  },
  {
    icon: CheckCircle2,
    title: '100% Pre-Production Prototyping',
    subtitle: 'Zero Blind Production',
    description: 'We never mass-cut fabric without sending a full physical master prototype to your office for tactile hand-feel and dimensional fitting approval.',
  },
  {
    icon: ShieldCheck,
    title: 'Direct Factory Transparency',
    subtitle: 'Zero Middleman Overhead',
    description: 'Communicate directly with pattern engineers and production leads. No broker layers, no hidden markups, and completely itemized proforma invoices.',
  },
];

export const CoreValues: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-surface border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Guiding Standards"
          title="Engineered On Unwavering Principles."
          description="Industrial manufacturing demands trust, scientific rigor, and punctuality. These six pillars govern every garment that leaves our facility."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((value, idx) => {
            const Icon = value.icon;
            return (
              <BorderCard
                key={idx}
                variant="default"
                hoverEffect
                className="flex flex-col justify-between p-6 sm:p-7"
              >
                <div>
                  <div className="w-10 h-10 rounded-base bg-surface border-hairline border-border flex items-center justify-center text-ink mb-4">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1">
                    {value.subtitle}
                  </div>
                  <h3 className="text-lg font-extrabold text-ink tracking-tight mb-2.5">
                    {value.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {value.description}
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

export default CoreValues;
