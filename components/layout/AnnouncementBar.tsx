'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Volume2,
} from 'lucide-react';

export interface AnnouncementBarProps {
  enabled?: boolean;
  animation?: 'marquee' | 'slide' | 'crossfade' | 'vertical-flip' | 'pulse' | 'static';
  speed?: number;
  pauseOnHover?: boolean;
  backgroundColor?: string;
  textColor?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  height?: 'compact' | 'normal' | 'tall';
  textSize?: 'xs' | 'sm' | 'base' | 'custom';
  customTextSize?: number;
  paddingVertical?: 'compact' | 'normal' | 'spacious' | 'custom';
  customPadding?: number;
  dismissible?: boolean;

  // Slide 1 (Primary Announcement)
  badge?: string;
  text?: string;
  linkText?: string;
  linkUrl?: string;

  // Slide 2 (Optional Second Announcement)
  badge2?: string;
  text2?: string;
  linkText2?: string;
  linkUrl2?: string;

  // Slide 3 (Optional Third Announcement)
  badge3?: string;
  text3?: string;
  linkText3?: string;
  linkUrl3?: string;

  // Slide Count Control (1, 2, or 3 slides)
  slideCount?: 1 | 2 | 3;
}

export function AnnouncementBar() {
  const pathname = usePathname();
  const [config, setConfig] = useState<AnnouncementBarProps>({
    enabled: true,
    animation: 'marquee',
    speed: 5,
    pauseOnHover: true,
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    badgeBgColor: 'rgba(255, 255, 255, 0.2)',
    badgeTextColor: '#FFFFFF',
    height: 'normal',
    dismissible: false,
    badge: 'FACTORY DIRECT',
    text: 'Custom Sports Apparel OEM Manufacturer — 24h Formal Quotation, 3D Mockups & Global Shipping',
    linkText: 'Request Quote →',
    linkUrl: '/#styles',
    badge2: '3D CAD PROOFS',
    text2: 'Free 3D Digital Mockup with every Club, School & Brand Inquiry',
    linkText2: 'Upload Specs →',
    linkUrl2: '/#styles',
    badge3: 'WORLDWIDE COURIER',
    text3: 'Fast 7-Day Express Dispatch to UK, USA, Europe & Australia',
    linkText3: 'Check Shipping →',
    linkUrl3: '/shipping-and-returns',
    slideCount: 3,
  });

  const [isDismissed, setIsDismissed] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSelectedInPreview, setIsSelectedInPreview] = useState(false);
  const isPreview = typeof window !== 'undefined' && window.location.search.includes('preview=true');

  // Check session storage on client mount for dismissal memory
  useEffect(() => {
    if (typeof window !== 'undefined' && !isPreview) {
      const dismissed = sessionStorage.getItem('hr_announcement_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, [isPreview]);

  // Fetch dynamic published theme settings
  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/theme');
        if (res.ok) {
          const json = await res.json();
          if (json.announcementBar) {
            setConfig((prev) => ({ ...prev, ...json.announcementBar }));
          }
        }
      } catch (err) {
        // Fallback silently to defaults
      }
    }
    loadTheme();
  }, []);

  // Live preview postMessage listener for Puck editor
  useEffect(() => {
    if (isPreview) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'PUCK_PREVIEW_UPDATE') {
          const content = event.data.data?.content;
          if (Array.isArray(content)) {
            const bar = content.find(
              (item: any) => item.type === 'AnnouncementBar' || item.type === 'LiveAnnouncementBar'
            );
            if (bar && bar.props) {
              setConfig((prev) => ({ ...prev, ...bar.props }));
            }
          }
        } else if (event.data?.type === 'PUCK_BLOCK_HIGHLIGHT') {
          setIsSelectedInPreview(event.data.index === 0);
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isPreview]);

  // Build the list of active slides respecting slideCount (defaults to 3 if multi-slide content exists)
  const count = config.slideCount ?? 3;
  const slides = [
    {
      badge: config.badge ?? 'FACTORY DIRECT',
      text: config.text ?? 'Custom Sports Apparel OEM Manufacturer — 24h Formal Quotation, 3D Mockups & Global Shipping',
      linkText: config.linkText ?? 'Request Quote →',
      linkUrl: config.linkUrl ?? '/#styles',
    },
    ...(count >= 2 && config.text2
      ? [{
          badge: config.badge2 || 'PROMO',
          text: config.text2,
          linkText: config.linkText2 || '',
          linkUrl: config.linkUrl2 || '',
        }]
      : []),
    ...(count >= 3 && config.text3
      ? [{
          badge: config.badge3 || 'SHIPPING',
          text: config.text3,
          linkText: config.linkText3 || '',
          linkUrl: config.linkUrl3 || '',
        }]
      : []),
  ];

  const animation = config.animation || 'marquee';
  const speed = config.speed || 5;

  // Auto-advance for multi-slide modes (slide, crossfade, vertical-flip)
  useEffect(() => {
    if (slides.length <= 1) return;
    if (animation === 'slide' || animation === 'crossfade' || animation === 'vertical-flip') {
      if (isPaused) return;
      const intervalMs = Math.max(2500, (speed || 5) * 1000);
      const timer = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % slides.length);
      }, intervalMs);
      return () => clearInterval(timer);
    }
  }, [animation, speed, slides.length, isPaused]);

  // Do not render on company portal or factory dashboard or when hidden/dismissed
  // (All hooks above have unconditionally executed, so returning null is 100% React-compliant)
  if (pathname?.startsWith('/portal') || !config.enabled || (isDismissed && !isPreview)) {
    return null;
  }

  const {
    pauseOnHover = true,
    backgroundColor = '#0A0A0A',
    textColor = '#FFFFFF',
    badgeBgColor = 'rgba(255, 255, 255, 0.2)',
    badgeTextColor = '#FFFFFF',
    height = 'normal',
    dismissible = false,
  } = config;

  // Global click freeze in preview mode for Announcement Bar
  const handlePreviewLinkClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage({ type: 'PUCK_BLOCK_SELECTED', index: 0 }, '*');
    }
  };

  // Dismiss handler
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hr_announcement_dismissed', 'true');
    }
  };

  // Dynamic typography sizing (Shopify Dawn Style)
  let calculatedFontSize: string | undefined = undefined;
  let textSizeClass = 'text-xs';
  if (config.textSize === 'custom' && config.customTextSize) {
    calculatedFontSize = `${config.customTextSize}px`;
    textSizeClass = '';
  } else if (config.textSize === 'xs') {
    textSizeClass = 'text-[11px]';
  } else if (config.textSize === 'sm') {
    textSizeClass = 'text-xs';
  } else if (config.textSize === 'base') {
    textSizeClass = 'text-sm';
  } else {
    textSizeClass = {
      compact: 'text-[11px]',
      normal: 'text-xs',
      tall: 'text-sm',
    }[height] || 'text-xs';
  }

  // Dynamic vertical padding sizing (Shopify Dawn Style)
  let calculatedPaddingTop: string | undefined = undefined;
  let calculatedPaddingBottom: string | undefined = undefined;
  let paddingClass = 'py-2';
  if (config.paddingVertical === 'custom' && typeof config.customPadding === 'number') {
    calculatedPaddingTop = `${config.customPadding}px`;
    calculatedPaddingBottom = `${config.customPadding}px`;
    paddingClass = '';
  } else if (config.paddingVertical === 'compact') {
    paddingClass = 'py-1';
  } else if (config.paddingVertical === 'normal') {
    paddingClass = 'py-2';
  } else if (config.paddingVertical === 'spacious') {
    paddingClass = 'py-3.5';
  } else {
    paddingClass = {
      compact: 'py-1',
      normal: 'py-2',
      tall: 'py-3',
    }[height] || 'py-2';
  }

  const isMarquee = animation === 'marquee';

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        fontSize: calculatedFontSize,
        paddingTop: calculatedPaddingTop,
        paddingBottom: calculatedPaddingBottom,
      }}
      onClick={() => {
        if (isPreview) {
          window.parent.postMessage({ type: 'PUCK_BLOCK_SELECTED', index: 0 }, '*');
        }
      }}
      onMouseEnter={() => {
        if (pauseOnHover) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setIsPaused(false);
      }}
      className={`relative z-50 w-full overflow-hidden select-none transition-all duration-200 ${
        isMarquee ? 'border-none p-0' : 'border-b border-white/10 px-3 sm:px-6'
      } ${paddingClass} ${textSizeClass} ${
        isPreview ? 'cursor-pointer hover:ring-1 hover:ring-blue-400' : ''
      } ${isSelectedInPreview ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-black' : ''}`}
      title={isPreview ? 'Click to edit Announcement Bar in Theme Editor' : undefined}
    >
      <div className={`${isMarquee ? 'w-full' : 'max-w-7xl mx-auto px-3 sm:px-6'} flex items-center justify-between gap-3`}>
        {/* Main Content Area by Animation Mode */}
        <div className="flex-1 min-w-0 flex items-center justify-center w-full">
          
          {/* MODE 1: Continuous Smooth Marquee Ticker */}
          {isMarquee && (
            <div className="relative w-full overflow-hidden flex items-center">
              <div
                className={`flex items-center gap-8 whitespace-nowrap animate-marquee ${
                  pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
                }`}
                style={{
                  animationDuration: `${Math.max(12, 38 - (speed || 5) * 2.5)}s`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              >
                {[0, 1, 2, 3].map((rep) => (
                  <div key={rep} className="flex items-center gap-8">
                    {slides.map((s, sIdx) => (
                      <React.Fragment key={`${rep}-${sIdx}`}>
                        <span className="inline-flex items-center gap-2 font-bold">
                          {s.badge && (
                            <span
                              style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                              className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold shadow-2xs"
                            >
                              {s.badge}
                            </span>
                          )}
                          <span>{s.text}</span>
                        </span>
                        {s.linkText && s.linkUrl && (
                          <Link
                            href={s.linkUrl}
                            onClick={handlePreviewLinkClick}
                            className="underline font-bold hover:opacity-80 transition underline-offset-4 shrink-0"
                          >
                            {s.linkText}
                          </Link>
                        )}
                        <span className="opacity-40">&bull;</span>
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: Slide Carousel with Arrows & Indicators */}
          {animation === 'slide' && (
            <div className="flex items-center justify-center gap-3 text-center w-full">
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
                  }}
                  className="opacity-60 hover:opacity-100 p-0.5 cursor-pointer transition-opacity"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              
              <div className="transition-all duration-300 flex items-center justify-center gap-2 max-w-full">
                {slides[slideIndex]?.badge && (
                  <span
                    style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                    className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold shrink-0"
                  >
                    {slides[slideIndex].badge}
                  </span>
                )}
                <span className="font-medium truncate max-w-md sm:max-w-xl">
                  {slides[slideIndex]?.text}
                </span>
                {slides[slideIndex]?.linkText && slides[slideIndex]?.linkUrl && (
                  <Link
                    href={slides[slideIndex].linkUrl}
                    onClick={handlePreviewLinkClick}
                    className="underline font-bold hover:opacity-80 transition underline-offset-4 shrink-0 hidden sm:inline"
                  >
                    {slides[slideIndex].linkText}
                  </Link>
                )}
              </div>

              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideIndex((prev) => (prev + 1) % slides.length);
                  }}
                  className="opacity-60 hover:opacity-100 p-0.5 cursor-pointer transition-opacity"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Dots indicator for multi-slides */}
              {slides.length > 1 && (
                <div className="hidden md:flex items-center gap-1 ml-2">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIndex(dotIdx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        slideIndex === dotIdx ? 'bg-current scale-125' : 'bg-current opacity-30 hover:opacity-60'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MODE 3: Smooth Crossfade */}
          {animation === 'crossfade' && (
            <div className="flex items-center justify-center gap-2 text-center animate-in fade-in duration-500">
              {slides[slideIndex]?.badge && (
                <span
                  style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                  className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold"
                >
                  {slides[slideIndex].badge}
                </span>
              )}
              <span className="font-medium">{slides[slideIndex]?.text}</span>
              {slides[slideIndex]?.linkText && slides[slideIndex]?.linkUrl && (
                <Link
                  href={slides[slideIndex].linkUrl}
                  onClick={handlePreviewLinkClick}
                  className="underline font-bold hover:opacity-80 transition underline-offset-4 ml-1 hidden sm:inline"
                >
                  {slides[slideIndex].linkText}
                </Link>
              )}
            </div>
          )}

          {/* MODE 4: Vertical Flip / Rolling Board */}
          {animation === 'vertical-flip' && (
            <div className="relative h-6 overflow-hidden flex items-center justify-center w-full">
              <div
                className="transition-transform duration-500 ease-out flex flex-col items-center"
                style={{ transform: `translateY(-${slideIndex * 24}px)` }}
              >
                {slides.map((s, idx) => (
                  <div key={idx} className="h-6 flex items-center justify-center gap-2">
                    {s.badge && (
                      <span
                        style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                        className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold"
                      >
                        {s.badge}
                      </span>
                    )}
                    <span className="font-medium truncate max-w-md sm:max-w-xl">{s.text}</span>
                    {s.linkText && s.linkUrl && (
                      <Link
                        href={s.linkUrl}
                        onClick={handlePreviewLinkClick}
                        className="underline font-bold hover:opacity-80 transition underline-offset-4 ml-1 hidden sm:inline"
                      >
                        {s.linkText}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 5: Pulsing Attention Dot */}
          {animation === 'pulse' && (
            <div className="flex items-center justify-center gap-2 text-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {slides[0]?.badge && (
                <span
                  style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                  className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold"
                >
                  {slides[0].badge}
                </span>
              )}
              <span className="font-bold">{slides[0]?.text}</span>
              {slides[0]?.linkText && slides[0]?.linkUrl && (
                <Link
                  href={slides[0].linkUrl}
                  onClick={handlePreviewLinkClick}
                  className="inline-flex items-center gap-1 font-bold ml-2 underline underline-offset-4 hover:opacity-80 transition"
                >
                  <span>{slides[0].linkText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}

          {/* MODE 6: Static Clean Bar */}
          {animation === 'static' && (
            <div className="flex items-center justify-center gap-2 text-center">
              {slides[0]?.badge && (
                <span
                  style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                  className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold"
                >
                  {slides[0].badge}
                </span>
              )}
              <span className="font-medium">{slides[0]?.text}</span>
              {slides[0]?.linkText && slides[0]?.linkUrl && (
                <Link
                  href={slides[0].linkUrl}
                  onClick={handlePreviewLinkClick}
                  className="inline-flex items-center gap-1 font-bold ml-2 underline underline-offset-4 hover:opacity-80 transition"
                >
                  <span>{slides[0].linkText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Optional Dismiss Cross Button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="opacity-60 hover:opacity-100 p-1 rounded transition-opacity cursor-pointer shrink-0"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
