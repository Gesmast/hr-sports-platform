'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Wind, Droplets, Activity } from 'lucide-react';
import { materials, fabricCategoryMap } from '@/data/materials';
import { Toggle } from '@/components/shared/Toggle';
import { BorderCard } from '@/components/shared/BorderCard';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Material } from '@/types';

interface CapabilityCardConfig {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  defaultMaterialId: string;
  options: { id: string; label: string }[];
}

const capabilityCards: CapabilityCardConfig[] = [
  {
    id: 'jerseys',
    title: 'Pro Performance Match Jerseys',
    eyebrow: 'Tier-1 Sublimation',
    description: 'Ultra-lightweight tournament kits engineered for pro football, basketball, rugby, and track athletes with high-velocity moisture management.',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800&auto=format&fit=crop',
    defaultMaterialId: 'mat-perf-mesh',
    options: [
      { id: 'mat-perf-mesh', label: 'Micro-Mesh' },
      { id: 'mat-dryfit-interlock', label: 'DuraFit Knit' },
      { id: 'mat-eco-jersey', label: 'Eco-Recycled' },
    ],
  },
  {
    id: 'activewear',
    title: 'Compression & Training Activewear',
    eyebrow: 'Precision Cut & Sew',
    description: 'High-tensile compression rashguards, squat-proof athletic leggings, gym singlets, and sports bras with flatlock structural stability.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
    defaultMaterialId: 'mat-compression-shield',
    options: [
      { id: 'mat-compression-shield', label: 'PowerFlex™' },
      { id: 'mat-perf-mesh', label: 'AeroVent™' },
      { id: 'mat-thermal-fleece', label: 'Grid Fleece' },
    ],
  },
  {
    id: 'corporate',
    title: 'Corporate Polos & Sideline Kits',
    eyebrow: 'Executive Uniforms',
    description: 'Long-staple cotton-poly blend technical piqués, coach tracksuits, and weather-resistant fleece jackets for corporate staff and athletic departments.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    defaultMaterialId: 'mat-tech-pique',
    options: [
      { id: 'mat-tech-pique', label: 'Vanguard Piqué' },
      { id: 'mat-thermal-fleece', label: 'Storm Fleece' },
      { id: 'mat-dryfit-interlock', label: 'Interlock' },
    ],
  },
];

export const CapabilityGrid: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, string>>({
    jerseys: 'mat-perf-mesh',
    activewear: 'mat-compression-shield',
    corporate: 'mat-tech-pique',
  });

  const handleMaterialChange = (cardId: string, materialId: string) => {
    setSelectedMaterials((prev) => ({ ...prev, [cardId]: materialId }));
  };

  const getMaterial = (id: string): Material => {
    return materials.find((m) => m.id === id) || materials[0];
  };

  return (
    <section id="capabilities" className="py-16 md:py-24 bg-white border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Manufacturing Capabilities"
          title="Engineered For Extreme Performance."
          description="Every apparel category is precision-matched with functional technical knits. Toggle below to compare fabric weights, tensile stretch, and moisture transfer ratings."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {capabilityCards.map((card) => {
            const activeMatId = selectedMaterials[card.id] || card.defaultMaterialId;
            const currentMat = getMaterial(activeMatId);

            return (
              <BorderCard key={card.id} variant="surface" className="flex flex-col justify-between p-6">
                <div>
                  {/* Visual Header */}
                  <div className="relative w-full aspect-16/10 rounded-base overflow-hidden border-hairline border-border-light mb-5 bg-zinc-200">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-ink text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm">
                      {card.eyebrow}
                    </div>
                  </div>

                  {/* Card Title & Copy */}
                  <h3 className="text-xl font-extrabold text-ink tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-5">
                    {card.description}
                  </p>

                  {/* Segmented Material Toggle */}
                  <div className="mb-4">
                    <div className="text-[10px] font-mono uppercase text-muted tracking-wider mb-2">
                      Active Fabric Spec Swatch:
                    </div>
                    <Toggle
                      options={card.options}
                      activeId={activeMatId}
                      onChange={(matId) => handleMaterialChange(card.id, matId)}
                      size="sm"
                      className="w-full justify-between"
                    />
                  </div>

                  {/* Dynamic Spec Metrics Box */}
                  <div className="bg-white border-hairline border-border rounded-base p-4 space-y-2.5 text-xs mb-6">
                    <div className="font-bold text-ink text-xs border-b border-border-light pb-1.5 flex items-center justify-between">
                      <span>{currentMat.name}</span>
                      <span className="font-mono text-[11px] bg-surface px-1.5 py-0.5 rounded-sm">
                        {currentMat.gsmWeight} GSM
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-mono">Composition</span>
                        <span className="font-semibold text-ink leading-tight block truncate" title={currentMat.blendComposition}>
                          {currentMat.blendComposition}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-mono">Stretch Recovery</span>
                        <span className="font-semibold text-ink leading-tight block">
                          {currentMat.stretchRating}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-mono">Moisture Rating</span>
                        <span className="font-semibold text-ink leading-tight block">
                          {currentMat.moistureWickingRating.split(' ')[0]} {currentMat.moistureWickingRating.split(' ')[1]}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-mono">Breathability</span>
                        <span className="font-semibold text-ink leading-tight block">
                          {currentMat.breathabilityIndex}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <Link
                  href={`/request-a-quote?garment=${encodeURIComponent(card.title)}&fabric=${encodeURIComponent(currentMat.name)}`}
                  className="pt-2 text-xs font-mono font-bold uppercase tracking-wider text-ink hover:text-black flex items-center justify-between border-t border-border-light group"
                >
                  <span>Request Spec Sample</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </BorderCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CapabilityGrid;
