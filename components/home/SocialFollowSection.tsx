'use client';

import React, { useEffect } from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';

const FacebookIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export interface SocialFollowSectionProps {
  facebookUrl?: string;
  embedId?: string;
  eyebrow?: string;
  heading?: string;
  accent?: string;
  followerText?: string;
}

export const SocialFollowSection: React.FC<SocialFollowSectionProps> = ({
  facebookUrl = 'https://www.facebook.com/thehrsports',
  embedId = '25727583',
  eyebrow = 'Official Community',
  heading = 'Stay connected with us.',
  accent = 'Follow our journey.',
  followerText = '12.4K+ Active Sports Clubs & Apparel Buyers',
}) => {
  // Dynamically load and re-evaluate SociableKit script whenever component mounts
  useEffect(() => {
    // Remove any previously appended sociablekit script to force fresh execution
    const staleScripts = document.querySelectorAll('script[src*="sociablekit.com"]');
    staleScripts.forEach((s) => s.remove());

    const script = document.createElement('script');
    script.src = `https://widgets.sociablekit.com/facebook-page-posts/widget.js?t=${Date.now()}`;
    script.defer = true;
    script.id = 'sociablekit-facebook-widget';
    document.body.appendChild(script);

    return () => {
      const currentScript = document.getElementById('sociablekit-facebook-widget');
      if (currentScript) currentScript.remove();
    };
  }, [embedId]);

  return (
    <section id="social" className="py-12 sm:py-16 md:py-20 bg-white border-t border-zinc-200 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* =============================================================== */}
        {/* Header: Positioned directly above the laptop                    */}
        {/* =============================================================== */}
        <div className="text-center max-w-4xl mx-auto mb-4 sm:mb-6">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#1877F2] text-xs font-mono font-bold tracking-wide uppercase mb-3 shadow-2xs">
            <FacebookIcon className="w-3.5 h-3.5" />
            <span>{eyebrow}</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-black leading-tight">
            {heading}{' '}
            <span className="text-zinc-500 block font-bold">
              {accent}
            </span>
          </h2>

        </div>

        {/* =============================================================== */}
        {/* Large MacBook Showcase: Cropped with zero gap, transparent bg   */}
        {/* =============================================================== */}
        <div className="relative mx-auto w-full max-w-[1140px] aspect-[736/590] select-none">
          
          {/* Transparent Cropped Laptop Image */}
          <img
            src="/laptop-mockup.png"
            alt="HR Sports Facebook Community on MacBook"
            className="w-full h-full object-contain pointer-events-none relative z-0"
          />

          {/* Inner MacBook Retina Screen */}
          <div
            className="absolute z-10 overflow-y-auto overflow-x-hidden bg-white scrollbar-thin scrollbar-thumb-zinc-300 hover:scrollbar-thumb-zinc-400"
            style={{
              left: '12.228%',
              top: '2.373%',
              width: '75.408%',
              height: '61.186%',
              borderRadius: '8px 8px 3px 3px',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Top Webcam Notch */}
            <div className="sticky top-0 left-1/2 -translate-x-1/2 w-[11%] max-w-[70px] h-[10px] bg-[#1C1C1E] rounded-b-md z-30 pointer-events-none flex items-center justify-center mx-auto -mb-[10px] shadow-2xs">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A0C] border border-[#2C2C2E]" />
            </div>

            {/* SociableKit Facebook Page Posts Feed */}
            <div className="w-full min-h-full bg-white">
              <div 
                className="sk-ww-facebook-page-posts w-full" 
                data-embed-id={embedId} 
              />
            </div>
          </div>

        </div>

        {/* =============================================================== */}
        {/* Action Buttons: Moved below the laptop                           */}
        {/* =============================================================== */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-6 sm:mt-8 relative z-20">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm md:text-base transition-all duration-150 shadow-md hover:shadow-xl active:scale-98 cursor-pointer"
          >
            <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            <span>Follow @thehrsports</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>

          <a
            href="https://m.me/thehrsports"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 font-bold text-xs sm:text-sm md:text-base transition-all duration-150 shadow-xs hover:border-zinc-400 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#1877F2]" />
            <span>Message on Facebook</span>
          </a>
        </div>

        {/* Scroll Instruction */}
        <div className="text-center mt-3 relative z-20">
          <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase select-none">
            Scroll inside the laptop screen to view live posts ↓
          </span>
        </div>

      </div>
    </section>
  );
};

export default SocialFollowSection;
