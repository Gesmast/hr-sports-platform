'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check, ChevronRight, Layers } from 'lucide-react';
import { styleCategories } from '@/data/styles';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { BorderCard } from '@/components/shared/BorderCard';

export const ChooseYourStyle: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sport' | 'fitness' | 'casual'>('all');

  const filteredCategories = activeFilter === 'all'
    ? styleCategories
    : activeFilter === 'fitness'
    ? styleCategories.filter((c) => c.slug === 'activewear')
    : activeFilter === 'casual'
    ? styleCategories.filter((c) => c.slug === 'casual-wear')
    : styleCategories.filter((c) => c.slug !== 'activewear' && c.slug !== 'casual-wear');

  return (
    <section id="styles" className="py-20 md:py-28 bg-white border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ink" />
            Custom Apparel Catalog
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-[1.1]">
            Choose Your Apparel
          </h2>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none font-mono text-xs select-none">
          {[
            { id: 'all', label: 'All Categories (8)' },
            { id: 'sport', label: 'Team Sportswear' },
            { id: 'fitness', label: 'Activewear & Compression' },
            { id: 'casual', label: 'Casual & Merch' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-base uppercase font-semibold tracking-wider transition-colors border-hairline shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-ink text-white border-ink'
                  : 'bg-surface text-muted border-border hover:text-ink hover:border-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/styles/${category.slug}`}
              className="group flex flex-col justify-between h-full block"
            >
              <BorderCard
                variant="surface"
                className="p-5 sm:p-6 h-full flex flex-col justify-between transition-all duration-200 group-hover:border-ink group-hover:bg-white group-hover:translate-y-[-2px] shadow-xs"
              >
                <div>
                  {/* Category Image */}
                  <div className="relative w-full aspect-4/3 rounded-base overflow-hidden border-hairline border-border-light mb-4 bg-zinc-900">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover grayscale-15 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-ink/90 text-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm backdrop-blur-xs">
                      {category.itemCount} Items
                    </div>
                  </div>

                  {/* Category Name & Tagline */}
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1">
                    {category.tagline}
                  </div>
                  <h3 className="text-xl font-extrabold text-ink tracking-tight mb-2 group-hover:underline">
                    {category.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    {category.description}
                  </p>

                  {/* Featured Sub-Products Snippet */}
                  <div className="bg-white border-hairline border-border-light rounded-base p-3 mb-4 space-y-1.5 text-[11px] font-mono">
                    <div className="text-muted text-[10px] uppercase font-bold">Includes:</div>
                    <div className="flex flex-wrap gap-1 text-ink">
                      {category.featuredProducts.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="bg-surface px-1.5 py-0.5 rounded-sm">
                          {item}
                        </span>
                      ))}
                      {category.featuredProducts.length > 3 && (
                        <span className="text-muted py-0.5">+{category.featuredProducts.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Explore Button */}
                <div className="pt-3 border-t border-border-light flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-ink group-hover:text-black">
                  <span>Explore Apparel</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </BorderCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseYourStyle;
