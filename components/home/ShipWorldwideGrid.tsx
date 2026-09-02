'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CountryItem {
  slug: string;
  name: string;
  code: string;
}

const countryList: CountryItem[] = [
  { slug: 'usa', name: 'USA', code: 'USA' },
  { slug: 'uk', name: 'UK', code: 'UK' },
  { slug: 'australia', name: 'AUSTRALIA', code: 'AU' },
  { slug: 'canada', name: 'CANADA', code: 'CA' },
  { slug: 'germany', name: 'GERMANY', code: 'DE' },
  { slug: 'france', name: 'FRANCE', code: 'FR' },
  { slug: 'netherlands', name: 'NETHERLANDS', code: 'NL' },
  { slug: 'ireland', name: 'IRELAND', code: 'IE' },
  { slug: 'worldwide', name: 'WORLDWIDE', code: 'GLOBAL' },
];

// High-Definition Circular SVG Flag Renderers
const renderCircularFlag = (slug: string) => {
  switch (slug) {
    case 'usa':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-usa">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-usa)">
            {/* White Base */}
            <rect width="100" height="100" fill="#FFFFFF" />
            {/* 13 Red & White Stripes */}
            {[0, 2, 4, 6, 8, 10, 12].map((i) => (
              <rect
                key={i}
                y={i * (100 / 13)}
                width="100"
                height={100 / 13}
                fill="#B22234"
              />
            ))}
            {/* Blue Canton */}
            <rect width="45" height="53.8" fill="#3C3B6E" />
            {/* Stars Matrix Representation */}
            <g fill="#FFFFFF">
              <circle cx="9" cy="8" r="2.2" />
              <circle cx="22.5" cy="8" r="2.2" />
              <circle cx="36" cy="8" r="2.2" />
              <circle cx="15.75" cy="17" r="2.2" />
              <circle cx="29.25" cy="17" r="2.2" />
              <circle cx="9" cy="26" r="2.2" />
              <circle cx="22.5" cy="26" r="2.2" />
              <circle cx="36" cy="26" r="2.2" />
              <circle cx="15.75" cy="35" r="2.2" />
              <circle cx="29.25" cy="35" r="2.2" />
              <circle cx="9" cy="44" r="2.2" />
              <circle cx="22.5" cy="44" r="2.2" />
              <circle cx="36" cy="44" r="2.2" />
            </g>
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'uk':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-uk">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-uk)">
            {/* Navy Background */}
            <rect width="100" height="100" fill="#012169" />
            {/* White Saltire */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="#FFFFFF" strokeWidth="18" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="18" />
            {/* Red Saltire */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="#C8102E" strokeWidth="8" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#C8102E" strokeWidth="8" />
            {/* White St George Cross */}
            <rect x="38" width="24" height="100" fill="#FFFFFF" />
            <rect y="38" width="100" height="24" fill="#FFFFFF" />
            {/* Red St George Cross */}
            <rect x="42" width="16" height="100" fill="#C8102E" />
            <rect y="42" width="100" height="16" fill="#C8102E" />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'australia':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-au">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
            <clipPath id="au-canton-clip">
              <rect width="50" height="50" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-au)">
            {/* Blue Ensign Field */}
            <rect width="100" height="100" fill="#00008B" />
            {/* Union Jack Canton */}
            <g clipPath="url(#au-canton-clip)">
              <rect width="50" height="50" fill="#012169" />
              <line x1="0" y1="0" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="9" />
              <line x1="50" y1="0" x2="0" y2="50" stroke="#FFFFFF" strokeWidth="9" />
              <line x1="0" y1="0" x2="50" y2="50" stroke="#C8102E" strokeWidth="4" />
              <line x1="50" y1="0" x2="0" y2="50" stroke="#C8102E" strokeWidth="4" />
              <rect x="19" width="12" height="50" fill="#FFFFFF" />
              <rect y="19" width="50" height="12" fill="#FFFFFF" />
              <rect x="21" width="8" height="50" fill="#C8102E" />
              <rect y="21" width="50" height="8" fill="#C8102E" />
            </g>
            {/* Commonwealth Star */}
            <polygon
              points="25,60 27,67 34,67 29,71 31,78 25,74 19,78 21,71 16,67 23,67"
              fill="#FFFFFF"
            />
            {/* Southern Cross Stars */}
            <circle cx="75" cy="22" r="3.5" fill="#FFFFFF" />
            <circle cx="85" cy="42" r="3.5" fill="#FFFFFF" />
            <circle cx="75" cy="78" r="4" fill="#FFFFFF" />
            <circle cx="62" cy="50" r="3.5" fill="#FFFFFF" />
            <circle cx="79" cy="58" r="2.5" fill="#FFFFFF" />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'canada':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-ca">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-ca)">
            {/* Left Red Bar */}
            <rect width="25" height="100" fill="#D80621" />
            {/* Center White */}
            <rect x="25" width="50" height="100" fill="#FFFFFF" />
            {/* Right Red Bar */}
            <rect x="75" width="25" height="100" fill="#D80621" />
            {/* Stylized Red Maple Leaf */}
            <path
              d="M50 20 L53 36 L64 30 L61 42 L72 47 L67 55 L58 52 L60 62 L53 62 L52 74 L48 74 L47 62 L40 62 L42 55 L33 47 L44 42 L41 30 L52 36 Z"
              fill="#D80621"
            />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'germany':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-de">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-de)">
            <rect width="100" height="33.33" fill="#000000" />
            <rect y="33.33" width="100" height="33.33" fill="#DD0000" />
            <rect y="66.66" width="100" height="33.34" fill="#FFCC00" />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'france':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-fr">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-fr)">
            <rect width="33.33" height="100" fill="#002654" />
            <rect x="33.33" width="33.33" height="100" fill="#FFFFFF" />
            <rect x="66.66" width="33.34" height="100" fill="#ED2939" />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'netherlands':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-nl">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-nl)">
            <rect width="100" height="33.33" fill="#AE1C28" />
            <rect y="33.33" width="100" height="33.33" fill="#FFFFFF" />
            <rect y="66.66" width="100" height="33.34" fill="#21468B" />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'ireland':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-ie">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-ie)">
            <rect width="33.33" height="100" fill="#169B62" />
            <rect x="33.33" width="33.33" height="100" fill="#FFFFFF" />
            <rect x="66.66" width="33.34" height="100" fill="#FF883E" />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );

    case 'worldwide':
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip-globe">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>
          <g clipPath="url(#circle-clip-globe)">
            {/* Ocean Blue */}
            <rect width="100" height="100" fill="#4B90E2" />
            {/* Green Continents Graphic */}
            <path
              d="M18 35 Q22 25 35 22 Q45 20 48 30 Q42 42 32 45 Q22 48 18 35 Z"
              fill="#7ED321"
            />
            <path
              d="M32 55 Q38 52 42 62 Q36 78 28 85 Q22 80 26 68 Q28 60 32 55 Z"
              fill="#7ED321"
            />
            <path
              d="M52 20 Q65 18 78 25 Q82 35 75 42 Q62 48 55 38 Q50 28 52 20 Z"
              fill="#7ED321"
            />
            <path
              d="M55 45 Q68 42 72 58 Q68 75 58 78 Q50 72 52 58 Z"
              fill="#7ED321"
            />
            <path
              d="M72 65 Q85 62 88 72 Q82 82 72 78 Z"
              fill="#7ED321"
            />
          </g>
          <circle cx="50" cy="50" r="48" fill="none" stroke="#E4E4E7" strokeWidth="2" />
        </svg>
      );
  }
};

export const ShipWorldwideGrid: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-surface border-b border-hairline border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Headline without eyebrow */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            We Ship Everywhere.
          </h2>
          <div className="w-12 h-[2px] bg-ink mx-auto mt-3 mb-3" />
          <p className="text-xs sm:text-sm text-muted">
            Custom sportswear, made for you and delivered straight to your door with fast, tracked delivery.
          </p>
        </div>

        {/* 5 + 4 Centered Flag Cards Grid */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 max-w-5xl mx-auto">
          {countryList.map((country) => (
            <Link
              key={country.slug}
              href={`/manufacturers/${country.slug}`}
              className="group flex flex-col items-center justify-center w-[130px] sm:w-[155px] p-4 sm:p-5 bg-white hover:bg-zinc-50 border-hairline border-border rounded-base transition-all duration-150 text-center shadow-xs hover:border-ink hover:translate-y-[-2px] cursor-pointer"
            >
              {/* Circular Flag */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105 mb-3">
                {renderCircularFlag(country.slug)}
              </div>

              {/* Country Name */}
              <span className="text-xs sm:text-sm font-extrabold font-mono tracking-wider text-ink group-hover:underline">
                {country.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShipWorldwideGrid;
