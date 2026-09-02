'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

const steps: ProcessStep[] = [
  {
    number: '1.',
    title: 'Pattern Making',
    description: 'Patterns are created to match your required sizes and design geometries. Each product features a unique 3D CAD pattern, crafted with millimeter accuracy and grading precision.',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Textile master cutting and paper pattern drafting for custom sportswear',
  },
  {
    number: '2.',
    title: 'Pre-Production Sample',
    description: 'Before bulk production, we create a full-spec physical master sample and ship it to you for approval. Once signed off, we proceed immediately to the next step.',
    imageUrl: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Precision artisan sample sewing machine stitching athletic garment',
  },
  {
    number: '3.',
    title: 'Material & Fabric Sourcing',
    description: 'Performance fabrics are milled and inspected in our climate-controlled warehouse. We test GSM weight, 4-way stretch recovery, and capillary moisture-wicking before cutting.',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'High-performance colorful moisture-wicking and jersey fabrics',
  },
  {
    number: '4.',
    title: 'Precision Laser Cutting',
    description: 'Automated computer-guided CNC laser cutters slice multi-layer fabric panels with zero distortion, guaranteeing 100% seam alignment and uniform sizing across the entire batch.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Industrial automated laser fabric cutter slicing garment panels',
  },
  {
    number: '5.',
    title: 'Sublimation & Bulk Assembly',
    description: 'Full orders are produced on our high-density 1200 DPI Japanese sublimation printers and 6-needle flatlock stitching lines, with in-line AQL 1.0 quality checkpoints at every stage.',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Industrial garment production line with spools of thread and sewing machines',
  },
  {
    number: '6.',
    title: 'Packaging & Global Logistics',
    description: 'Garments are individual polybagged with your private labels, custom barcodes, and size tags, packed into reinforced export cartons, and dispatched via tracked express air cargo.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Export carton packaging and tape sealing for international air freight delivery',
  },
];

export const HowWeWork: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-hairline border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header with HR Sports Brand Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* Eyebrow with horizontal hairline rules */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-10 sm:w-16 h-[2px] bg-ink" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-ink">
              Direct Factory Protocol
            </span>
            <span className="w-10 sm:w-16 h-[2px] bg-ink" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-ink leading-tight">
            How We Work With Your Brand.
          </h2>
          
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto mt-4 leading-relaxed">
            From initial 3D tech-pack submission to final physical sample approval and international air delivery, our workflow is transparent, rapid, and zero-compromise.
          </p>
        </div>

        {/* 6-Step Circular Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-16 gap-x-8 lg:gap-x-12">
          {steps.map((step) => {
            return (
              <div
                key={step.number}
                className="flex flex-col items-center text-center group"
              >
                {/* Circular Image Container with Step Number Badge */}
                <div className="relative mb-6">
                  {/* Circular Image Frame */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-border-light group-hover:border-ink transition-all duration-300 shadow-sm bg-surface">
                    <img
                      src={step.imageUrl}
                      alt={step.imageAlt}
                      className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  {/* Overlapping Number Badge (Top-Right) */}
                  <div className="absolute top-1 right-2 sm:top-2 sm:right-3 w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-ink text-white font-extrabold font-mono text-base sm:text-lg flex items-center justify-center border-2 border-white shadow-lg select-none transition-transform group-hover:scale-110">
                    {step.number}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-ink tracking-tight mb-2.5">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xs text-pretty">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
