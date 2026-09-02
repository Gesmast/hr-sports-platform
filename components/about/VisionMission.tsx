import React from 'react';
import { Target, Compass } from 'lucide-react';

export const VisionMission: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
          {/* Vertical Charcoal Hairline Divider on Desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-border" />

          {/* Left Column: Vision */}
          <div className="space-y-4 md:pr-8">
            <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted flex items-center gap-2">
              <Compass className="w-4 h-4 text-ink" />
              Strategic Vision
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Democratizing Tier-1 OEM Manufacturing For High-Growth Brands
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              To eliminate the traditional barriers of high minimum order quantities and multi-tiered broker markups, empowering sporting federations, independent athletic apparel founders, and corporate organizations with direct factory-floor access, digital 3D prototyping, and uncompromising textile science.
            </p>
          </div>

          {/* Right Column: Mission */}
          <div className="space-y-4 md:pl-8">
            <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted flex items-center gap-2">
              <Target className="w-4 h-4 text-ink" />
              Operational Mission
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Zero-Defect Textile Precision & Ethical Industrial Excellence
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              We engineer pro-grade athletic garments utilizing GRS-certified recycled polymers, 1200 DPI high-tension Japanese sublimation, and 4-stage AQL 1.0 quality control. Every seam, print, and custom private-label component is crafted with pride, absolute intellectual property protection, and rapid international air delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
