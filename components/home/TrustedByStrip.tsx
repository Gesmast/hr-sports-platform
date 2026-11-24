'use client';

import React from 'react';

// 5 Sample Logoipsum Company Marks (Clean, Authentic Typography & Vector Icons)
const logos = [
  {
    id: 'logo-1',
    name: 'Logoipsum 1',
    svg: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 160 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2.5L28.5 9.7V24.3L16 31.5L3.5 24.3V9.7L16 2.5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M16 8L23 12V20L16 24L9 20V12L16 8Z" fill="currentColor" />
        <text x="38" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.04em">logoipsum</text>
      </svg>
    ),
  },
  {
    id: 'logo-2',
    name: 'Logoipsum 2',
    svg: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 160 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="16" cy="16" r="6" fill="currentColor" />
        <path d="M16 3A13 13 0 0 1 29 16h-6A7 7 0 0 0 16 9V3z" fill="currentColor" />
        <text x="38" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.04em">logoipsum</text>
      </svg>
    ),
  },
  {
    id: 'logo-3',
    name: 'Logoipsum 3',
    svg: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 160 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 25L16 7L27 25H21L16 16.5L11 25H5Z" fill="currentColor" />
        <path d="M16 12L20.5 20H11.5L16 12Z" fill="currentColor" />
        <text x="38" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.04em">logoipsum</text>
      </svg>
    ),
  },
  {
    id: 'logo-4',
    name: 'Logoipsum 4',
    svg: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 160 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="24" height="24" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M9 16L16 9L23 16L16 23Z" fill="currentColor" />
        <text x="38" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.04em">logoipsum</text>
      </svg>
    ),
  },
  {
    id: 'logo-5',
    name: 'Logoipsum 5',
    svg: (
      <svg className="h-7 sm:h-8 w-auto" viewBox="0 0 160 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12h-5c0 3.87-3.13 7-7 7s-7-3.13-7-7 3.13-7 7-7V4z" fill="currentColor" />
        <circle cx="24" cy="8" r="4" fill="currentColor" />
        <text x="38" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" letterSpacing="0.04em">logoipsum</text>
      </svg>
    ),
  },
];

export interface TrustedByStripProps {
  heading?: string;
}

export const TrustedByStrip: React.FC<TrustedByStripProps> = ({
  heading = 'TRUSTED BY',
}) => {
  return (
    <section 
      aria-label="Trusted by companies" 
      className="w-full bg-black text-white border-y border-zinc-800/90 h-20 sm:h-24 overflow-hidden relative select-none z-20 flex items-center"
    >
      {/* ===================================================================== */}
      {/* Fixed Left Section: "TRUSTED BY" with Vertical Divider Line          */}
      {/* Stays pinned while logos scroll behind it                             */}
      {/* ===================================================================== */}
      <div className="relative z-20 flex items-center shrink-0 bg-black pl-5 sm:pl-8 lg:pl-12 pr-4 sm:pr-8 h-full">
        <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.24em] uppercase text-zinc-400 select-none whitespace-nowrap">
          {heading}
        </span>
        
        {/* Sleek Vertical Divider Line */}
        <span className="h-7 sm:h-8 w-[1px] bg-zinc-700 ml-4 sm:ml-7 shrink-0" />

        {/* Soft gradient fade so logos emerge smoothly from behind divider */}
        <div className="absolute left-full top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      </div>

      {/* ===================================================================== */}
      {/* Scrolling Strip: 5 Company Logos with Clean Whitespace Gaps           */}
      {/* No dots, no placeholders, infinite seamless loop                      */}
      {/* ===================================================================== */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <div className="animate-marquee-strip flex items-center">
          
          {/* First Set of 5 Logos */}
          <div className="flex items-center shrink-0 gap-16 sm:gap-24 md:gap-32 pr-16 sm:pr-24 md:pr-32">
            {logos.map((logo) => (
              <div 
                key={`set-1-${logo.id}`} 
                className="shrink-0 text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
                title={logo.name}
              >
                {logo.svg}
              </div>
            ))}
          </div>

          {/* Second Set of 5 Logos (Duplicate for Seamless Loop) */}
          <div className="flex items-center shrink-0 gap-16 sm:gap-24 md:gap-32 pr-16 sm:pr-24 md:pr-32">
            {logos.map((logo) => (
              <div 
                key={`set-2-${logo.id}`} 
                className="shrink-0 text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
                title={logo.name}
              >
                {logo.svg}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Soft gradient fade on right edge of screen */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-black to-transparent z-10" />
    </section>
  );
};

export default TrustedByStrip;
