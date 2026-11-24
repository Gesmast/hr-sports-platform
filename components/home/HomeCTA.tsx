'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export interface HomeCTAProps {
  headlineTop?: string;
  headlineBottom?: string;
  speechBubble?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export const HomeCTA: React.FC<HomeCTAProps> = ({
  headlineTop = "LET'S",
  headlineBottom = "TALK?",
  speechBubble = "Got a design? Let's build.",
  subtitle = "Got a sketch, an Instagram reference, or a complete tech pack? Send it over. We review your specifications, suggest athletic fabrics, and deliver an exact factory quote in 24 hours.",
  primaryButtonText = "Request a quote",
  primaryButtonLink = "/request-a-quote",
  secondaryButtonText = "Contact our team",
  secondaryButtonLink = "/contact",
}) => {
  return (
    <section id="cta" className="relative py-20 sm:py-28 md:py-36 bg-white text-zinc-900 overflow-hidden border-t border-zinc-200">
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* =================================================================== */}
        {/* Giant Headline + Circular HR Avatar with Pure Black Ring            */}
        {/* =================================================================== */}
        <div className="inline-block text-left mb-6 sm:mb-8">
          
          {/* Top Line: LET'S + Circular Avatar */}
          <div className="flex items-center justify-start gap-4 sm:gap-6 md:gap-8">
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[130px] font-black tracking-tight leading-[0.88] text-black uppercase select-none">
              {headlineTop}
            </h2>

            {/* Circular HR Avatar with Speech Bubble */}
            <div className="relative flex flex-col items-center shrink-0 -mt-6 sm:-mt-10 md:-mt-14">
              
              {/* Speech Bubble Tooltip */}
              <div className="relative mb-2 sm:mb-3 bg-white text-zinc-900 text-[11px] sm:text-xs md:text-sm font-semibold px-3.5 sm:px-4 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-zinc-200 whitespace-nowrap">
                <span>{speechBubble}</span>
                {/* Speech Bubble Downward Tail */}
                <div 
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid #FFFFFF'
                  }}
                />
              </div>

              {/* Circular Avatar: Original Color HR Logo with a Pure Black Ring */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-white ring-4 sm:ring-8 ring-black shadow-[0_16px_36px_rgba(0,0,0,0.18)] flex items-center justify-center p-3.5 sm:p-5 md:p-6 transition-transform hover:scale-105 duration-300 cursor-pointer">
                <Logo className="w-full h-auto text-black" />
              </div>

            </div>
          </div>

          {/* Bottom Line: TALK? */}
          <div className="text-left">
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[130px] font-black tracking-tight leading-[0.88] text-black uppercase select-none block">
              {headlineBottom}
            </span>
          </div>

        </div>

        {/* =================================================================== */}
        {/* Subtitle / Plain honest value proposition                          */}
        {/* =================================================================== */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          {subtitle}
        </p>

        {/* =================================================================== */}
        {/* Action Buttons: Pure Black Pill Button & Outlined Pill Button       */}
        {/* =================================================================== */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          
          {/* Primary Quote Button: Pure Black Pill Shaped Button with Arrow */}
          <Link href={primaryButtonLink || '/request-a-quote'}>
            <button className="inline-flex items-center gap-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.35)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              <span>{primaryButtonText}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </Link>

          {/* Secondary Contact Button: Pill Shaped Outlined Button */}
          <Link href={secondaryButtonLink || '/contact'}>
            <button className="inline-flex items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black text-black font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-200 cursor-pointer shadow-xs">
              <Mail className="w-4 h-4 text-zinc-700" />
              <span>{secondaryButtonText}</span>
            </button>
          </Link>

        </div>

      </div>
    </section>
  );
};

export default HomeCTA;
