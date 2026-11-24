'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Testimonial {
  name: string;
  company: string;
  text: string;
  initials: string;
  avatarBg: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Marcus Vance",
    company: "Vance Grappling Co. · USA",
    text: "The seam strength and flatlock stitching on our rashguards are exceptional. Tested over hundreds of hours on the mats with zero unraveling. True direct factory quality.",
    initials: "MV",
    avatarBg: "from-emerald-600 to-teal-500"
  },
  {
    name: "Liam O’Connor",
    company: "Dublin Athletic Club · Ireland",
    text: "We bypassed the middleman and worked directly with HR Sports. Sublimation colors matched our Pantone codes 1:1, and direct pricing cut our kit costs by 30%.",
    initials: "LO",
    avatarBg: "from-blue-600 to-indigo-500"
  },
  {
    name: "Callum Davies",
    company: "AeroCycle Apparel · Australia",
    text: "Their pattern team turned our sketches into factory CAD files in 48 hours. The sample arrived in Sydney in 6 days and went straight to full production.",
    initials: "CD",
    avatarBg: "from-amber-600 to-orange-500"
  },
  {
    name: "Sophie Dubois",
    company: "Nordic Sprint Lab · France",
    text: "Hand cutting makes a world of difference compared to laser. No stiff melted edges, and the natural stretch of the technical polyester remains fully intact.",
    initials: "SD",
    avatarBg: "from-purple-600 to-pink-500"
  },
  {
    name: "Jonas Lindqvist",
    company: "Apex Teamwear · Sweden",
    text: "Every carton arrived perfectly sorted, moisture-sealed, and tagged with our custom woven labels. Zero size errors across 1,800 team kits.",
    initials: "JL",
    avatarBg: "from-cyan-600 to-blue-500"
  },
  {
    name: "Tariq Al-Mansoor",
    company: "Gulf Sports Federation · UAE",
    text: "Reliable dispatch is everything for tournament deadlines. HR Sports delivered 2,500 custom sublimated kits a full week ahead of our kickoff.",
    initials: "TM",
    avatarBg: "from-rose-600 to-red-500"
  }
];

export interface ClientReviewsProps {
  heading?: string;
  subheading?: string;
  // Review 1
  review1Name?: string;
  review1Company?: string;
  review1Text?: string;
  review1Initials?: string;
  // Review 2
  review2Name?: string;
  review2Company?: string;
  review2Text?: string;
  review2Initials?: string;
  // Review 3
  review3Name?: string;
  review3Company?: string;
  review3Text?: string;
  review3Initials?: string;
  // Review 4
  review4Name?: string;
  review4Company?: string;
  review4Text?: string;
  review4Initials?: string;
  // Review 5
  review5Name?: string;
  review5Company?: string;
  review5Text?: string;
  review5Initials?: string;
  // Review 6
  review6Name?: string;
  review6Company?: string;
  review6Text?: string;
  review6Initials?: string;
}

export const ClientReviews: React.FC<ClientReviewsProps> = ({
  heading = 'What clients say.',
  subheading = 'In their own words.',
  review1Name,
  review1Company,
  review1Text,
  review1Initials,
  review2Name,
  review2Company,
  review2Text,
  review2Initials,
  review3Name,
  review3Company,
  review3Text,
  review3Initials,
  review4Name,
  review4Company,
  review4Text,
  review4Initials,
  review5Name,
  review5Company,
  review5Text,
  review5Initials,
  review6Name,
  review6Company,
  review6Text,
  review6Initials,
}) => {
  // Build active testimonials list from editable props, falling back to defaults
  const items: Testimonial[] = [
    {
      name: review1Name || testimonials[0].name,
      company: review1Company || testimonials[0].company,
      text: review1Text || testimonials[0].text,
      initials: review1Initials || (review1Name ? review1Name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : testimonials[0].initials),
      avatarBg: testimonials[0].avatarBg,
    },
    {
      name: review2Name || testimonials[1].name,
      company: review2Company || testimonials[1].company,
      text: review2Text || testimonials[1].text,
      initials: review2Initials || (review2Name ? review2Name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : testimonials[1].initials),
      avatarBg: testimonials[1].avatarBg,
    },
    {
      name: review3Name || testimonials[2].name,
      company: review3Company || testimonials[2].company,
      text: review3Text || testimonials[2].text,
      initials: review3Initials || (review3Name ? review3Name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : testimonials[2].initials),
      avatarBg: testimonials[2].avatarBg,
    },
    {
      name: review4Name || testimonials[3].name,
      company: review4Company || testimonials[3].company,
      text: review4Text || testimonials[3].text,
      initials: review4Initials || (review4Name ? review4Name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : testimonials[3].initials),
      avatarBg: testimonials[3].avatarBg,
    },
    {
      name: review5Name || testimonials[4].name,
      company: review5Company || testimonials[4].company,
      text: review5Text || testimonials[4].text,
      initials: review5Initials || (review5Name ? review5Name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : testimonials[4].initials),
      avatarBg: testimonials[4].avatarBg,
    },
    {
      name: review6Name || testimonials[5].name,
      company: review6Company || testimonials[5].company,
      text: review6Text || testimonials[5].text,
      initials: review6Initials || (review6Name ? review6Name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : testimonials[5].initials),
      avatarBg: testimonials[5].avatarBg,
    },
  ];

  // Continuous index so cards always slide left on Next and right on Prev without wrapping backwards
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const total = items.length;

  const handleNext = () => setCurrentIndex((prev) => prev + 1);
  const handlePrev = () => setCurrentIndex((prev) => prev - 1);

  // Viewport detection: only start sequence once customer scrolls to this section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance reviews sequentially every 5 seconds only when in viewport and not hovering a card
  useEffect(() => {
    if (!isInView || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isInView, isPaused]);

  // Helper to get testimonial by arbitrary integer
  const getTestimonial = (idx: number) => {
    const mod = ((idx % total) + total) % total;
    return items[mod];
  };

  const activeTestimonialIndex = ((currentIndex % total) + total) % total;

  // Visible slots spanning the full screen: -2, -1, 0, 1, 2
  const offsets = [-2, -1, 0, 1, 2];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-[#0A0A0B] py-20 sm:py-28 text-white overflow-hidden border-b border-zinc-800/80"
    >
      
      {/* Subtle Halftone Matrix at Top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)'
        }}
      />

      {/* =================================================================== */}
      {/* Section Header: "What clients say. In their own words."             */}
      {/* =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          {heading}{' '}
          <span className="text-zinc-500 font-bold block sm:inline">
            {subheading}
          </span>
        </h2>
      </div>

      {/* =================================================================== */}
      {/* Full-Width Curved Carousel: Spans Edge-to-Edge with Faint Peeking   */}
      {/* =================================================================== */}
      <div className="relative w-full h-[400px] sm:h-[430px] overflow-hidden select-none">
        <AnimatePresence initial={false} mode="popLayout">
          {offsets.map((offset) => {
            const globalIndex = currentIndex + offset;
            const t = getTestimonial(globalIndex);
            const isCenter = offset === 0;

            return (
              <motion.div
                key={globalIndex}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                onClick={() => {
                  if (offset < 0) handlePrev();
                  if (offset > 0) handleNext();
                }}
                className={`absolute left-1/2 top-4 -ml-[155px] sm:-ml-[180px] md:-ml-[195px] w-[310px] sm:w-[360px] md:w-[390px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer border bg-white text-black shadow-2xl transition-colors ${
                  isCenter
                    ? 'border-zinc-300 shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-20'
                    : 'border-zinc-200 hover:border-zinc-400 z-10'
                }`}
                animate={{
                  x: offset * (typeof window !== 'undefined' && window.innerWidth < 640 ? 320 : 400),
                  y: isCenter ? 0 : Math.abs(offset) * 32,
                  rotate: offset * 4.5,
                  scale: isCenter ? 1 : 0.93,
                  opacity: isCenter ? 1 : Math.abs(offset) === 1 ? 0.75 : 0.35,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              >
                {/* Top: Large Quotation Mark */}
                <span className="text-5xl sm:text-6xl leading-none text-zinc-300 font-serif select-none">
                  “
                </span>

                {/* Middle: Full Testimonial in Pure Black */}
                <p className="mt-2 text-sm sm:text-[15px] md:text-base text-black font-semibold leading-relaxed">
                  {t.text}
                </p>

                {/* Divider & Bottom: Client details with realistic profile avatar */}
                <div className="mt-6 flex items-center gap-3 border-t border-zinc-200 pt-4">
                  {/* Avatar Circle with vibrant profile colors */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.avatarBg} text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0 border border-white/20`}>
                    {t.initials}
                  </div>

                  <div className="truncate">
                    <p className="font-extrabold text-sm text-black truncate">{t.name}</p>
                    <p className="text-xs text-zinc-500 font-mono truncate">{t.company}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* =================================================================== */}
      {/* Navigation Controls: Previous | Dots (White active) | Next          */}
      {/* =================================================================== */}
      <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4 select-none relative z-10">
        <div className="inline-flex items-center gap-3 sm:gap-4 bg-[#141518] border border-white/15 p-1.5 rounded-full shadow-lg backdrop-blur-md">
          
          {/* Previous Button */}
          <button 
            onClick={handlePrev}
            className="px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous review"
          >
            Previous
          </button>

          {/* Pagination Dots (Active is solid pure WHITE) */}
          <div className="flex items-center gap-1.5 px-1">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const diff = i - activeTestimonialIndex;
                  setCurrentIndex((prev) => prev + diff);
                }}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  i === activeTestimonialIndex 
                    ? "h-2 w-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110" 
                    : "h-1.5 w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Next Button (Solid White Pill) */}
          <button 
            onClick={handleNext}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
            aria-label="Next review"
          >
            Next
          </button>

        </div>
      </div>

    </section>
  );
};

export default ClientReviews;
