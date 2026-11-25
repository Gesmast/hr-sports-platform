'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Truck,
  Shield,
  Factory,
  Scissors,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Flame,
  MessageCircle,
  Mail,
  Play,
  Pause,
  Share2,
  HelpCircle,
  ShieldCheck,
  Award,
  Clock,
  Lock,
  Target,
  Compass,
  Users,
  MessageSquare,
  Phone,
  FileText,
  Layers,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   1. DYNAMIC ANNOUNCEMENT BAR (5 Animation Modes)
   ───────────────────────────────────────────────────────────── */
export interface AnnouncementBarProps {
  id?: string;
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

export function LiveAnnouncementBar({
  enabled = true,
  animation = 'marquee',
  speed = 5,
  pauseOnHover = true,
  backgroundColor = '#0A0A0A',
  textColor = '#FFFFFF',
  badgeBgColor = 'rgba(255, 255, 255, 0.2)',
  badgeTextColor = '#FFFFFF',
  height = 'normal',
  textSize,
  customTextSize,
  paddingVertical,
  customPadding,
  dismissible = false,
  slideCount = 3,
  badge = 'FACTORY DIRECT',
  text = 'Custom Sports Apparel OEM Manufacturer — 24h Formal Quotation, 3D Mockups & Global Shipping',
  linkText = 'Request Quote →',
  linkUrl = '/request-a-quote',
  badge2 = '3D CAD PROOFS',
  text2 = 'Free 3D Digital Mockup with every Club, School & Brand Inquiry',
  linkText2 = 'Upload Specs →',
  linkUrl2 = '/request-a-quote',
  badge3 = 'WORLDWIDE COURIER',
  text3 = 'Fast 7-Day Express Dispatch to UK, USA, Europe & Australia',
  linkText3 = 'Check Shipping →',
  linkUrl3 = '/shipping-and-returns',
}: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  if (!enabled || isDismissed) return null;

  const count = Number(slideCount) || 3;
  const slides = [
    { badge, text, linkText, linkUrl },
    ...(count >= 2 && text2 ? [{ badge: badge2 || 'PROMO', text: text2, linkText: linkText2, linkUrl: linkUrl2 }] : []),
    ...(count >= 3 && text3 ? [{ badge: badge3 || 'SHIPPING', text: text3, linkText: linkText3, linkUrl: linkUrl3 }] : []),
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    if (animation === 'slide' || animation === 'crossfade' || animation === 'vertical-flip') {
      if (isPaused) return;
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % slides.length);
      }, Math.max(2500, (speed || 5) * 1000));
      return () => clearInterval(interval);
    }
  }, [animation, speed, slides.length, isPaused]);

  // Dynamic typography sizing (Shopify Dawn Style)
  let calculatedFontSize: string | undefined = undefined;
  let textSizeClass = 'text-xs';
  if (textSize === 'custom' && customTextSize) {
    calculatedFontSize = `${customTextSize}px`;
    textSizeClass = '';
  } else if (textSize === 'xs') {
    textSizeClass = 'text-[11px]';
  } else if (textSize === 'sm') {
    textSizeClass = 'text-xs';
  } else if (textSize === 'base') {
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
  if (paddingVertical === 'custom' && typeof customPadding === 'number') {
    calculatedPaddingTop = `${customPadding}px`;
    calculatedPaddingBottom = `${customPadding}px`;
    paddingClass = '';
  } else if (paddingVertical === 'compact') {
    paddingClass = 'py-1';
  } else if (paddingVertical === 'normal') {
    paddingClass = 'py-2';
  } else if (paddingVertical === 'spacious') {
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
      onMouseEnter={() => { if (pauseOnHover) setIsPaused(true); }}
      onMouseLeave={() => { if (pauseOnHover) setIsPaused(false); }}
      className={`relative z-50 w-full overflow-hidden select-none transition-colors ${
        isMarquee ? 'border-none p-0' : 'border-b border-white/10 px-3 sm:px-6'
      } ${paddingClass} ${textSizeClass}`}
    >
      <div className={`${isMarquee ? 'w-full' : 'max-w-7xl mx-auto px-3 sm:px-6'} flex items-center justify-between gap-3`}>
        <div className="flex-1 min-w-0 flex items-center justify-center w-full">
          {/* Mode 1: Marquee */}
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
                        <span className="inline-flex items-center gap-1.5 font-bold">
                          {s.badge && (
                            <span
                              style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                              className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold"
                            >
                              {s.badge}
                            </span>
                          )}
                          <span>{s.text}</span>
                        </span>
                        {s.linkText && s.linkUrl && (
                          <Link
                            href={s.linkUrl}
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

          {/* Mode 2: Slide Carousel */}
          {animation === 'slide' && (
            <div className="flex items-center justify-center gap-3 text-center w-full">
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="opacity-60 hover:opacity-100 p-0.5"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="transition-all duration-300 flex items-center justify-center gap-2">
                {slides[slideIndex]?.badge && (
                  <span
                    style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
                    className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold"
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
                    className="underline font-bold hover:opacity-80 transition underline-offset-4 shrink-0 hidden sm:inline"
                  >
                    {slides[slideIndex].linkText}
                  </Link>
                )}
              </div>
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
                  className="opacity-60 hover:opacity-100 p-0.5"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Mode 3: Crossfade */}
          {animation === 'crossfade' && (
            <div className="flex items-center justify-center gap-2 text-center animate-in fade-in duration-300">
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
                  className="underline font-bold hover:opacity-80 transition underline-offset-4 ml-1 hidden sm:inline"
                >
                  {slides[slideIndex].linkText}
                </Link>
              )}
            </div>
          )}

          {/* Mode 4: Vertical Flip */}
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

          {/* Mode 5: Pulse */}
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
                  className="inline-flex items-center gap-1 font-bold ml-2 underline underline-offset-4 hover:opacity-80 transition"
                >
                  <span>{slides[0].linkText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}

          {/* Mode 6: Static */}
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
                  className="underline font-bold hover:opacity-80 transition underline-offset-4 ml-1"
                >
                  {slides[0].linkText}
                </Link>
              )}
            </div>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-sm opacity-60 hover:opacity-100 hover:bg-white/10 transition shrink-0"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HERO SECTION COMPONENT (Matches Live Website 1:1)
   ───────────────────────────────────────────────────────────── */
export interface HeroSectionProps {
  headline1?: string;
  headline2?: string;
  headline3?: string;
  subheading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  headlineColor?: string;
  subheadingColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  heroVideo1?: string;
  heroVideo2?: string;
  heroVideo3?: string;
  mobileHeroVideo?: string;
  posterImage?: string;
  aspectRatio?: '9/16' | '16/9' | '4/3' | '1/1' | 'auto';
  videoHeight?: 'small' | 'medium' | 'large' | 'fullscreen' | 'auto';
  videoFit?: 'cover' | 'contain';
  videoZoom?: string;
  borderRadius?: 'none' | 'medium' | 'large' | 'full';
  overlayDarkness?: 'none' | 'subtle' | 'medium' | 'deep';
}

interface FactoryHeroVideo {
  id: string;
  src: string;
  focalX?: number;
  focalY?: number;
  zoom?: number;
}

const DEFAULT_FACTORY_HERO_VIDEOS: FactoryHeroVideo[] = [
  {
    id: 'vid-1',
    src: '/hero-section-videos/new-video-1.mp4',
    focalX: 50,
    focalY: 50,
    zoom: 1.0,
  },
  {
    id: 'vid-2',
    src: '/hero-section-videos/hero-video-2.mp4',
    focalX: 50,
    focalY: 50,
    zoom: 1.0,
  },
  {
    id: 'vid-3',
    src: '/hero-section-videos/hero-video-3.mp4',
    focalX: 50,
    focalY: 50,
    zoom: 1.0,
  },
];

export function LiveHeroSection({
  headline1 = 'YOUR DESIGN.',
  headline2 = 'OUR FACTORY.',
  headline3 = 'DELIVERED.',
  subheading = 'Have a design in mind? Let’s make it production ready.',
  description = 'From team kits to performance wear and corporate apparel, we turn your designs into finished products, starting from as little as 30 pieces with high quality sublimation and 24 hour quotes.',
  buttonText = 'Request a Quote',
  buttonLink = '/request-a-quote',
  headlineColor,
  subheadingColor,
  buttonBgColor,
  buttonTextColor,
  heroVideo1,
  heroVideo2,
  heroVideo3,
  mobileHeroVideo,
  posterImage,
  aspectRatio = '9/16',
  videoHeight = 'medium',
  videoFit = 'cover',
  videoZoom = '1.0',
  borderRadius = 'large',
  overlayDarkness = 'subtle',
}: HeroSectionProps) {
  const [videos, setVideos] = useState<FactoryHeroVideo[]>(DEFAULT_FACTORY_HERO_VIDEOS);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Apply custom videos passed via Theme Editor if provided
  useEffect(() => {
    if (heroVideo1 || heroVideo2 || heroVideo3) {
      setVideos([
        {
          id: 'custom-1',
          src: heroVideo1 || DEFAULT_FACTORY_HERO_VIDEOS[0].src,
          focalX: 50,
          focalY: 50,
          zoom: Number(videoZoom) || 1.0,
        },
        {
          id: 'custom-2',
          src: heroVideo2 || heroVideo1 || DEFAULT_FACTORY_HERO_VIDEOS[1].src,
          focalX: 50,
          focalY: 50,
          zoom: Number(videoZoom) || 1.0,
        },
        {
          id: 'custom-3',
          src: heroVideo3 || heroVideo1 || DEFAULT_FACTORY_HERO_VIDEOS[2].src,
          focalX: 50,
          focalY: 50,
          zoom: Number(videoZoom) || 1.0,
        },
      ]);
      return;
    }

    // Fetch live video slots from Supabase
    const fetchHeroSlots = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('website_video_slots')
          .select('slot_key, current_video_url, focal_point_x, focal_point_y, zoom_level')
          .in('slot_key', ['hero_reel_1', 'hero_reel_2', 'hero_reel_3'])
          .order('slot_key', { ascending: true });

        if (data && data.length > 0) {
          setVideos(
            data.map((item) => ({
              id: item.slot_key,
              src: item.current_video_url,
              focalX: Number(item.focal_point_x) || 50,
              focalY: Number(item.focal_point_y) || 50,
              zoom: Number(item.zoom_level) || 1.0,
            }))
          );
        }
      } catch (err) {
        console.warn('Hero video slots fetch error, using defaults:', err);
      }
    };
    fetchHeroSlots();
  }, [heroVideo1, heroVideo2, heroVideo3, videoZoom]);

  const activeVideo = videos[activeVideoIndex] || videos[0] || DEFAULT_FACTORY_HERO_VIDEOS[0];

  // Dynamic aspect ratio, sizing & styling classes
  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9] w-full'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3] w-full'
      : aspectRatio === '1/1'
      ? 'aspect-square w-full max-w-[540px]'
      : aspectRatio === 'auto'
      ? 'aspect-auto w-auto'
      : 'aspect-[9/16] w-auto';

  const heightClass =
    videoHeight === 'small'
      ? 'max-h-[420px] min-h-[320px]'
      : videoHeight === 'large'
      ? 'max-h-[740px] min-h-[500px]'
      : videoHeight === 'fullscreen'
      ? 'max-h-[88vh] min-h-[540px]'
      : videoHeight === 'auto'
      ? ''
      : 'max-h-[640px] min-h-[440px]';

  const radiusClass =
    borderRadius === 'none'
      ? 'rounded-none'
      : borderRadius === 'medium'
      ? 'rounded-2xl'
      : borderRadius === 'full'
      ? 'rounded-full'
      : 'rounded-[28px] sm:rounded-[36px]';

  const overlayClass =
    overlayDarkness === 'none'
      ? 'hidden'
      : overlayDarkness === 'medium'
      ? 'bg-black/30'
      : overlayDarkness === 'deep'
      ? 'bg-black/55'
      : 'bg-gradient-to-t from-black/40 via-transparent to-black/30';

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback resume failed:', err);
      });
    }
  };

  const handleSelectVideo = (index: number) => {
    setActiveVideoIndex(index);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleVideoEnded = () => {
    setProgress(0);
    setActiveVideoIndex((prev) => (prev + 1) % (videos.length || DEFAULT_FACTORY_HERO_VIDEOS.length));
  };

  useEffect(() => {
    if (videoRef.current) {
      setProgress(0);
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [activeVideoIndex]);

  return (
    <section className="relative w-full pt-2 sm:pt-4 pb-8 sm:pb-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-start">
          
          {/* Left Column: Bold Typography & Action Button */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-6 pt-0.5">
            {/* Giant Stacked Brutalist Headline */}
            <div
              style={headlineColor ? { color: headlineColor } : undefined}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] xl:text-[80px] font-black uppercase tracking-[-0.035em] text-black leading-[0.92] select-none"
            >
              <div>{headline1}</div>
              <div>{headline2}</div>
              <div className="text-zinc-400">{headline3}</div>
            </div>

            {/* Sub-heading & Description */}
            <div className="space-y-2 max-w-xl text-pretty">
              <p
                style={subheadingColor ? { color: subheadingColor } : undefined}
                className="text-base sm:text-lg font-semibold text-black tracking-tight"
              >
                {subheading}
              </p>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Request a Quote Button */}
            <div className="pt-1 sm:pt-2">
              <Link href={buttonLink || '/request-a-quote'}>
                <button
                  type="button"
                  style={{
                    backgroundColor: buttonBgColor || undefined,
                    color: buttonTextColor || undefined,
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-black text-white hover:bg-zinc-800 rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-sm tracking-wide cursor-pointer"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Video Card with Dynamic Aspect Ratio & Styling */}
          <div className="md:col-span-6 lg:col-span-6 xl:col-span-6 flex items-start justify-center lg:justify-center">
            <div className={`relative ${aspectClass} h-[calc(100vh-140px)] ${heightClass} ${radiusClass} overflow-hidden bg-black border-2 border-zinc-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] group`}>
              {/* HTML5 Video Element (Silent: Muted Always, No Sound Button) */}
              <video
                ref={videoRef}
                src={activeVideo.src}
                poster={posterImage}
                style={{
                  objectFit: videoFit === 'contain' ? 'contain' : 'cover',
                  objectPosition: `${activeVideo.focalX || 50}% ${activeVideo.focalY || 50}%`,
                  transform: `scale(${Number(videoZoom) || activeVideo.zoom || 1.0})`,
                  transformOrigin: `${activeVideo.focalX || 50}% ${activeVideo.focalY || 50}%`,
                }}
                className="w-full h-full"
                autoPlay
                playsInline
                muted
                loop={false}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
              />

              {/* Dynamic Vignette / Darkening overlay for clean edge blending & text contrast */}
              <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />

              {/* Top Bar Loaders (Progress Between Videos) */}
              <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-4 right-3.5 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2">
                {videos.map((vid, idx) => {
                  let barWidth = '0%';
                  if (idx < activeVideoIndex) {
                    barWidth = '100%';
                  } else if (idx === activeVideoIndex) {
                    barWidth = `${progress}%`;
                  }
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => handleSelectVideo(idx)}
                      className="flex-1 h-1 sm:h-1.5 rounded-full bg-white/30 backdrop-blur-xs overflow-hidden cursor-pointer hover:bg-white/40 transition-colors p-0 border-0 focus:outline-none"
                      aria-label={`Jump to video ${idx + 1}`}
                      title={`Video ${idx + 1}`}
                    >
                      <div
                        className="h-full bg-white rounded-full transition-[width] duration-100 ease-linear"
                        style={{ width: barWidth }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Bottom Left: Little Black Play/Pause Button */}
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 z-20">
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/90 hover:bg-black text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/20 cursor-pointer focus:outline-none"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  title={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. TRUSTED BY / PARTNER LOGO STRIP
   ───────────────────────────────────────────────────────────── */
export interface TrustedByStripProps {
  heading?: string;
}

export function LiveTrustedByStrip({
  heading = 'TRUSTED BY SPORTS CLUBS, SCHOOLS & ATHLETIC BRANDS WORLDWIDE',
}: TrustedByStripProps) {
  const brandNames = ['APEX TEAMWEAR', 'DUBLIN ATHLETIC', 'AEROCYCLE', 'NORDIC SPRINT', 'GULF FEDERATION', 'VANCE GRAPPLING'];

  return (
    <div className="bg-[#111215] text-zinc-300 py-4 border-b border-zinc-800 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        {heading && (
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 shrink-0 font-bold">
            {heading}
          </span>
        )}
        <div className="flex-1 overflow-hidden flex items-center gap-8 whitespace-nowrap">
          <div className="flex items-center gap-8 animate-marquee">
            {brandNames.concat(brandNames).map((name, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <span className="text-xs font-black tracking-wider text-zinc-200 uppercase font-mono">
                  {name}
                </span>
                <span className="text-zinc-600">&bull;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. HOW WE WORK (6-Station Production Workflow)
   ───────────────────────────────────────────────────────────── */
export interface HowWeWorkProps {
  id?: string;
  title?: string;
  subtitle?: string;
  // Station 1: Design
  stage1Title?: string;
  stage1Description?: string;
  stage1Video?: string;
  // Station 2: Precision Hand Cutting
  stage2Title?: string;
  stage2Description?: string;
  stage2Video?: string;
  // Station 3: Sublimation Printing
  stage3Title?: string;
  stage3Description?: string;
  stage3Video?: string;
  stage3Video2?: string;
  // Station 4: Stitching & Assembly
  stage4Title?: string;
  stage4Description?: string;
  stage4Video?: string;
  // Station 5: Quality Check & Global Shipping
  stage5Title?: string;
  stage5Description?: string;
  stage5Video?: string;
  stage5Video2?: string;
}

export function LiveHowWeWork({
  title = 'The journey of every garment we make.',
  subtitle = 'Six transparent manufacturing stations from digital CAD mockups to global dispatch.',
  stage1Title,
  stage1Description,
  stage1Video,
  stage2Title,
  stage2Description,
  stage2Video,
  stage3Title,
  stage3Description,
  stage3Video,
  stage4Title,
  stage4Description,
  stage4Video,
  stage5Title,
  stage5Description,
  stage5Video,
}: HowWeWorkProps) {
  const stages = [
    {
      num: '01',
      title: stage1Title || 'Design.',
      desc: stage1Description || 'Our in-house designers create your custom designs and mockups according to your exact needs. Send us a sketch, a photo, or an idea—we build full 2D and 3D visual mockups and production-ready vector patterns.',
      video: stage1Video || '/process-videos/design-1.mp4',
    },
    {
      num: '02',
      title: stage2Title || 'Precision Hand Cutting.',
      desc: stage2Description || 'Every panel is cut 100% by hand by master pattern cutters using high-precision shears. No laser burning and no melted edges, preserving the full natural stretch, softness, and grain alignment of performance fabrics.',
      video: stage2Video || '/process-videos/cutting-1.mp4',
    },
    {
      num: '03',
      title: stage3Title || 'Sublimation Printing.',
      desc: stage3Description || 'Custom artwork, sponsor logos, and vibrant colors are molecularly infused directly into technical fibers using high-heat thermal presses. Zero cracking, zero peeling, and permanent wash-fast durability.',
      video: stage3Video || '/process-videos/printing-1.mp4',
    },
    {
      num: '04',
      title: stage4Title || 'Stitching & Assembly.',
      desc: stage4Description || 'Cut panels are assembled using 4-needle flatlock and heavy-duty athletic overlock machines. Seams lie completely flush against the skin to eliminate friction and withstand high-stress game movement.',
      video: stage4Video || '/process-videos/stitching-1.mp4',
    },
    {
      num: '05',
      title: stage5Title || 'Quality Check & Global Shipping.',
      desc: stage5Description || 'Every piece is hand-inspected for measurements and stitch integrity, steam-pressed, custom tagged with your woven brand labels and polybags, and dispatched worldwide via tracked express air freight.',
      video: stage5Video || '/process-videos/packing-1.mp4',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white text-zinc-900 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-zinc-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stages.map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:shadow-md transition space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400">Station {st.num}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                {st.video && (
                  <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative">
                    <video
                      src={st.video}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop
                      playsInline
                    />
                  </div>
                )}
                <h3 className="font-bold text-sm text-zinc-900">{st.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. SHIP WORLDWIDE GRID
   ───────────────────────────────────────────────────────────── */
export interface ShipWorldwideGridProps {
  heading?: string;
  subheading?: string;
}

export function LiveShipWorldwideGrid({
  heading = 'We Ship Everywhere.',
  subheading = 'Custom sportswear, made for you and delivered straight to your door with fast, tracked delivery.',
}: ShipWorldwideGridProps) {
  const countries = ['USA', 'UK', 'AUSTRALIA', 'CANADA', 'GERMANY', 'FRANCE', 'NETHERLANDS', 'IRELAND', 'WORLDWIDE'];

  return (
    <section className="py-12 sm:py-16 bg-[#F8F9FA] text-zinc-900 border-b border-zinc-200">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{heading}</h2>
          <div className="w-12 h-[2px] bg-black mx-auto mt-2 mb-2" />
          <p className="text-xs sm:text-sm text-zinc-600">{subheading}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {countries.map((c) => (
            <div
              key={c}
              className="w-[120px] sm:w-[140px] p-3.5 bg-white border border-zinc-200 rounded-xl shadow-xs text-center select-none"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-2 text-xs font-bold text-zinc-700">
                <Globe className="w-5 h-5 text-zinc-600" />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-black">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. CLIENT REVIEWS
   ───────────────────────────────────────────────────────────── */
export interface ClientReviewsProps {
  id?: string;
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

export function LiveClientReviews({
  heading = 'What clients say.',
  subheading = 'In their own words.',
  review1Name = 'Marcus Vance',
  review1Company = 'Vance Grappling Co. · USA',
  review1Text = 'The seam strength and flatlock stitching on our rashguards are exceptional. Tested over hundreds of hours on the mats with zero unraveling.',
  review2Name = 'Liam O’Connor',
  review2Company = 'Dublin Athletic Club · Ireland',
  review2Text = 'We bypassed the middleman and worked directly with HR Sports. Sublimation colors matched our Pantone codes 1:1, and direct pricing cut our kit costs by 30%.',
  review3Name = 'Callum Davies',
  review3Company = 'AeroCycle Apparel · Australia',
  review3Text = 'Their pattern team turned our sketches into factory CAD files in 48 hours. The sample arrived in Sydney in 6 days and went straight to full production.',
  review4Name = 'Sophie Dubois',
  review4Company = 'Nordic Sprint Lab · France',
  review4Text = 'Hand cutting makes a world of difference compared to laser. No stiff melted edges, and the natural stretch of the technical polyester remains fully intact.',
  review5Name = 'Jonas Lindqvist',
  review5Company = 'Apex Teamwear · Sweden',
  review5Text = 'Every carton arrived perfectly sorted, moisture-sealed, and tagged with our custom woven labels. Zero size errors across 1,800 team kits.',
  review6Name = 'Tariq Al-Mansoor',
  review6Company = 'Gulf Sports Federation · UAE',
  review6Text = 'Reliable dispatch is everything for tournament deadlines. HR Sports delivered 2,500 custom sublimated kits a full week ahead of our kickoff.',
}: ClientReviewsProps) {
  const reviews = [
    { name: review1Name, company: review1Company, text: review1Text },
    { name: review2Name, company: review2Company, text: review2Text },
    { name: review3Name, company: review3Company, text: review3Text },
    { name: review4Name, company: review4Company, text: review4Text },
    { name: review5Name, company: review5Company, text: review5Text },
    { name: review6Name, company: review6Company, text: review6Text },
  ];

  return (
    <section className="py-16 sm:py-20 bg-black text-white border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-10">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          {heading} <span className="text-zinc-500 font-bold block sm:inline">{subheading}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white text-black border border-zinc-200 text-left flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed italic">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="border-t border-zinc-200 pt-3">
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[11px] text-zinc-500">{r.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. SHOPIFY APP INTEGRATION: FACEBOOK & MACBOOK SHOWCASE
   ───────────────────────────────────────────────────────────── */
export interface SocialFollowAppProps {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  accent?: string;
  facebookUrl?: string;
  embedId?: string;
  followerText?: string;
}

export function LiveSocialFollowApp({
  enabled = true,
  eyebrow = 'Official Community',
  heading = 'Stay connected with us.',
  accent = 'Follow our journey.',
  facebookUrl = 'https://www.facebook.com/thehrsports',
  embedId = '25727583',
  followerText = '12.4K+ Active Sports Clubs & Apparel Buyers',
}: SocialFollowAppProps) {
  if (!enabled) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-t border-zinc-200 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1877F2] text-xs font-mono font-bold tracking-wide uppercase mb-3 shadow-2xs">
          <Share2 className="w-3.5 h-3.5" />
          <span>{eyebrow}</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black leading-tight mb-6">
          {heading}{' '}
          <span className="text-zinc-500 block font-bold">{accent}</span>
        </h2>

        {/* MacBook Laptop Mockup Showcase */}
        <div className="relative mx-auto w-full max-w-[940px] aspect-[736/590] select-none">
          <img
            src="/laptop-mockup.png"
            alt="HR Sports Facebook Community on MacBook"
            className="w-full h-full object-contain pointer-events-none relative z-0"
          />

          {/* Inner MacBook Screen */}
          <div
            className="absolute z-10 overflow-hidden bg-white flex flex-col items-center justify-center p-6 text-center"
            style={{
              left: '12.228%',
              top: '2.373%',
              width: '75.408%',
              height: '61.186%',
              borderRadius: '8px 8px 3px 3px',
            }}
          >
            <div className="space-y-3 max-w-md">
              <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center mx-auto shadow-md">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="font-black text-sm sm:text-base text-zinc-900">
                Official HR Sports Facebook Page
              </div>
              <div className="text-xs text-zinc-500">
                Live Factory Reels, Behind-The-Scenes Sublimation, & Client Unboxing
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                SociableKit Embed ID: {embedId}
              </div>
              <div className="pt-2">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1877F2] text-white text-xs font-bold shadow hover:bg-blue-600 transition"
                >
                  <span>Follow on Facebook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-zinc-500 mt-4">{followerText}</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   8. HOME CTA BANNER
   ───────────────────────────────────────────────────────────── */
export interface HomeCtaProps {
  headlineTop?: string;
  headlineBottom?: string;
  speechBubble?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function LiveHomeCta({
  headlineTop = "LET'S",
  headlineBottom = 'TALK?',
  speechBubble = "Got a design? Let's build.",
  subtitle = 'Got a sketch, an Instagram reference, or a complete tech pack? Send it over. We review your specifications, suggest athletic fabrics, and deliver an exact factory quote in 24 hours.',
  primaryButtonText = 'Request a quote',
  primaryButtonLink = '/request-a-quote',
  secondaryButtonText = 'Contact our team',
  secondaryButtonLink = '/contact',
}: HomeCtaProps) {
  return (
    <section className="relative py-16 sm:py-24 bg-white text-zinc-900 border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        
        <div className="inline-block text-left mb-4">
          <div className="flex items-center justify-start gap-4">
            <span className="text-5xl sm:text-7xl font-black text-black uppercase tracking-tight">
              {headlineTop}
            </span>
            <div className="px-3 py-1 rounded-full bg-white border border-zinc-300 text-xs font-bold text-zinc-800 shadow-sm">
              {speechBubble}
            </div>
          </div>
          <span className="text-5xl sm:text-7xl font-black text-black uppercase tracking-tight block">
            {headlineBottom}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href={primaryButtonLink || '/request-a-quote'}>
            <button className="inline-flex items-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition cursor-pointer">
              <span>{primaryButtonText}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </Link>
          <Link href={secondaryButtonLink || '/contact'}>
            <button className="inline-flex items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-300 text-black font-semibold text-sm px-7 py-3.5 rounded-full transition cursor-pointer">
              <Mail className="w-4 h-4 text-zinc-700" />
              <span>{secondaryButtonText}</span>
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   9. SHOPIFY APP INTEGRATION: FLOATING WHATSAPP CONCIERGE APP
   ───────────────────────────────────────────────────────────── */
export interface WhatsAppConciergeAppProps {
  enabled?: boolean;
  phoneNumber?: string;
  greetingMessage?: string;
  buttonText?: string;
}

export function LiveWhatsAppConciergeApp({
  enabled = true,
  phoneNumber = '+923000000000',
  greetingMessage = 'Hi HR Sports team! I want to inquire about custom sportswear manufacturing.',
  buttonText = 'Chat on WhatsApp',
}: WhatsAppConciergeAppProps) {
  if (!enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] select-none">
      <a
        href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(greetingMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition hover:scale-105 active:scale-95 font-bold text-xs"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>{buttonText}</span>
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   10. GENERAL RICH TEXT BLOCK
   ───────────────────────────────────────────────────────────── */
export interface RichTextSectionProps {
  heading?: string;
  body?: string;
  align?: 'left' | 'center' | 'right';
  background?: 'white' | 'dark' | 'gray';
}

export function LiveRichTextSection({
  heading = 'Factory Direct Manufacturing Specifications',
  body = 'HR Sports is an established sporting goods and apparel factory based in Lahore, Pakistan. We specialize in performance technical wear, custom sublimation, and OEM exports to sports clubs globally.',
  align = 'center',
  background = 'white',
}: RichTextSectionProps) {
  const bgClass =
    background === 'dark'
      ? 'bg-[#0A0A0A] text-white border-zinc-800'
      : background === 'gray'
      ? 'bg-zinc-50 text-zinc-900 border-zinc-200'
      : 'bg-white text-zinc-900 border-zinc-200';

  const alignClass =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <section className={`py-12 sm:py-16 px-4 border-b ${bgClass}`}>
      <div className={`max-w-4xl mx-auto space-y-3 ${alignClass}`}>
        {heading && <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{heading}</h2>}
        <p className="text-xs sm:text-sm leading-relaxed opacity-80 whitespace-pre-line">{body}</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   11. CHOOSE YOUR STYLE (Apparel Categories Grid)
   ───────────────────────────────────────────────────────────── */
export interface ChooseYourStyleProps {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export function LiveChooseYourStyle({
  badge = 'CUSTOM APPAREL CATALOG',
  title = 'Apparel Categories & Teamwear Kits',
  subtitle = 'Choose a category to start customizing with our 3D mockup generator, tech pack spec builder, and 24-hour formal quotation.',
}: ChooseYourStyleProps) {
  const categories = [
    { name: 'Cricket Apparel', sub: 'Sublimated white kits & coloured T20 jerseys', slug: 'cricket' },
    { name: 'Football / Soccer', sub: 'Pro match kits, goalkeeper sets & training tops', slug: 'football' },
    { name: 'Basketball Uniforms', sub: 'Mesh singlets, pro shorts & reversible kits', slug: 'basketball' },
    { name: 'Gym & Activewear', sub: 'Performance compression rashguards & leggings', slug: 'gym-activewear' },
    { name: 'Field Hockey Kits', sub: 'Lightweight breathable sublimated kits', slug: 'hockey' },
    { name: 'Corporate Uniforms', sub: 'Custom embroidered polos & corporate jackets', slug: 'corporate-uniforms' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-zinc-900 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl space-y-3">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[11px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{title}</h2>
          <p className="text-sm text-zinc-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <div
              key={c.slug}
              className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:shadow-md transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Sportswear</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h3 className="font-bold text-base text-zinc-900">{c.name}</h3>
              <p className="text-xs text-zinc-600">{c.sub}</p>
              <div className="pt-2 text-xs font-bold text-black flex items-center gap-1">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   12. WHY CHOOSE HR SPORTS (Factory Advantages)
   ───────────────────────────────────────────────────────────── */
export interface WhyChooseHRSportsProps {
  title?: string;
  subtitle?: string;
}

export function LiveWhyChooseHRSports({
  title = 'Why Sports Brands & Clubs Partner Directly With Our Factory Floor',
  subtitle = 'Zero middlemen, direct factory-floor transparency, and uncompromising textile engineering.',
}: WhyChooseHRSportsProps) {
  const cards = [
    { title: 'Direct Factory Transparency', desc: 'Work directly with our factory floor. No middlemen, no hidden fees, clear pricing.' },
    { title: '100% Sample Approval First', desc: 'We craft and send a physical master sample for your sign-off before full production.' },
    { title: 'Vibrant, Long-Lasting Colors', desc: 'High-definition sublimation with premium eco-inks that never fade, crack, or peel.' },
    { title: 'Reliable 10–14 Day Delivery', desc: 'Guaranteed production schedules with tracked global express air shipping.' },
    { title: 'Multi-Stage Quality Control', desc: 'Every piece passes rigorous inspections for fabric weight, color accuracy, and seams.' },
    { title: 'Complete NDA & IP Protection', desc: 'Your custom patterns and artwork remain 100% confidential with signed NDAs.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F8F9FA] text-zinc-900 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-3xl space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-500">
            THE FACTORY ADVANTAGE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{title}</h2>
          <p className="text-sm text-zinc-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-sm text-zinc-900">{c.title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   13. CAPABILITY GRID (Plant Machinery & Metrics)
   ───────────────────────────────────────────────────────────── */
export interface CapabilityGridProps {
  heading?: string;
  subheading?: string;
}

export function LiveCapabilityGrid({
  heading = 'Industrial Manufacturing Capacity & Infrastructure',
  subheading = 'Our Lahore production facility spans automated laser cutting, high-volume thermal sublimation presses, and specialized activewear stitching lines.',
}: CapabilityGridProps) {
  const metrics = [
    { num: '30,000+', label: 'Monthly Garment Capacity' },
    { num: '4', label: 'In-Line QC Checkpoints' },
    { num: '24h', label: 'CAD Pattern & 3D Proof SLA' },
    { num: 'AQL 1.0', label: 'Strict Quality Standard' },
  ];

  return (
    <section className="py-16 sm:py-20 bg-black text-white border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{heading}</h2>
          <p className="text-xs sm:text-sm text-zinc-400">{subheading}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-1">
              <div className="text-3xl sm:text-4xl font-mono font-black text-white">{m.num}</div>
              <div className="text-xs text-zinc-400 font-mono">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   14. HOME FAQ SECTION
   ───────────────────────────────────────────────────────────── */
export interface HomeFAQSectionProps {
  heading?: string;
  subheading?: string;
}

export function LiveHomeFAQSection({
  heading = 'Frequently Asked Questions.',
  subheading = 'Everything you need to know about our minimum order quantities (30 pcs), physical sample approvals, tech pack intake, and worldwide DDP air freight delivery.',
}: HomeFAQSectionProps) {
  const faqs = [
    { q: 'What is the Minimum Order Quantity (MOQ)?', a: 'Our standard factory MOQ starts at only 30 pieces per design, allowing sports clubs and startup brands to produce pro-tier kits without massive inventory risk.' },
    { q: 'How long does physical sampling and bulk production take?', a: 'Pre-production physical samples are crafted and shipped within 3 to 5 business days. Once approved, bulk runs typically dispatch in 10 to 14 business days.' },
    { q: 'Can you match custom team Pantone colors exactly?', a: 'Yes. Our digital sublimation spectrophotometers calibrate colors 1:1 against your provided Pantone TCX or PMS swatches.' },
    { q: 'How do you handle international shipping and customs?', a: 'We ship DDP (Delivered Duty Paid) express via DHL and FedEx directly to your door in the UK, USA, Europe, and Australia.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-zinc-900 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-zinc-500">
            <HelpCircle className="w-4 h-4 text-black" />
            <span>Questions & Direct Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{heading}</h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {faqs.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-2">
              <h3 className="font-bold text-sm text-zinc-900">{f.q}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   15. CORE VALUES (About Page Section)
   ───────────────────────────────────────────────────────────── */
export interface CoreValuesProps {
  title?: string;
  subtitle?: string;
}

export function LiveCoreValues({
  title = 'Our Four Core Manufacturing Pillars',
  subtitle = 'Engineered for zero defects, complete IP confidentiality, and reliable delivery schedules.',
}: CoreValuesProps) {
  const values = [
    { title: 'Quality Assurance Protocol', sub: 'AQL 1.0 Standards', desc: 'Tensile fabric testing, spectrophotometer color calibration, and needle-detector clearance.' },
    { title: 'NDA & IP Client Protection', sub: 'Confidential Production', desc: 'Your proprietary patterns, Pantone colorways, and artwork are never disclosed or repurposed.' },
    { title: 'Ethical & Sustainable', sub: 'OEKO-TEX Certified', desc: 'Zero hazardous chemical dyes, fair living wages for technicians, and clean sublimation presses.' },
    { title: 'On-Time Delivery Guarantee', sub: 'Strict Production SLAs', desc: 'Direct factory scheduling tracked day-by-day with live production milestones in your portal.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-zinc-900 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-zinc-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-2">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">{v.sub}</span>
              <h3 className="font-bold text-sm text-zinc-900">{v.title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   16. VISION & MISSION
   ───────────────────────────────────────────────────────────── */
export interface VisionMissionProps {
  visionTitle?: string;
  visionDesc?: string;
  missionTitle?: string;
  missionDesc?: string;
}

export function LiveVisionMission({
  visionTitle = 'Democratizing Tier-1 OEM Manufacturing For High-Growth Brands',
  visionDesc = 'To eliminate the traditional barriers of high minimum order quantities and multi-tiered broker markups, empowering sporting federations, independent athletic apparel founders, and corporate organizations with direct factory-floor access.',
  missionTitle = 'Precision Industrial Execution With Complete Honesty',
  missionDesc = 'To manufacture every jersey, rashguard, and teamwear garment with meticulous technical precision, using verified sustainable fibers and on-time international dispatch.',
}: VisionMissionProps) {
  return (
    <section className="py-16 sm:py-24 bg-white text-zinc-900 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50 space-y-4">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">STRATEGIC VISION</div>
          <h3 className="text-xl sm:text-2xl font-black text-black">{visionTitle}</h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{visionDesc}</p>
        </div>

        <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50 space-y-4">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">OPERATIONAL MISSION</div>
          <h3 className="text-xl sm:text-2xl font-black text-black">{missionTitle}</h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{missionDesc}</p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   17. LOCAL RETAIL COMPARISON TABLE
   ───────────────────────────────────────────────────────────── */
export interface LocalRetailComparisonTableProps {
  countryName?: string;
  title?: string;
}

export function LiveLocalRetailComparisonTable({
  countryName = 'International',
  title = 'Direct Factory Floor vs. Traditional Domestic Resellers',
}: LocalRetailComparisonTableProps) {
  const rows = [
    { feature: 'Pricing Layer', factory: 'Direct Factory Floor (Zero Middlemen Markups)', retail: 'Multi-tiered brokers (30% to 60% markups)' },
    { feature: 'Customization Scope', factory: '100% Full Custom Sublimation & Cut/Sew', retail: 'Blank catalog stock with limited heat presses' },
    { feature: 'Physical Master Sample', factory: 'Custom physical sample delivered for sign-off', retail: 'Generic digital proof only' },
    { feature: 'Production Lead Time', factory: '10–14 days guaranteed dispatch', retail: '3 to 6 weeks depending on overseas shipping' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F8F9FA] text-zinc-900 border-b border-zinc-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">ECONOMIC COMPARISON</span>
          <h2 className="text-2xl sm:text-4xl font-black">{title} ({countryName})</h2>
        </div>

        <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-black text-white font-mono uppercase text-xs">
                <th className="p-4">Feature / Standard</th>
                <th className="p-4 text-emerald-400">HR Sports Factory Direct</th>
                <th className="p-4 text-zinc-400">Local Retailers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-zinc-50">
                  <td className="p-4 font-bold text-zinc-900">{r.feature}</td>
                  <td className="p-4 text-emerald-600 font-semibold">{r.factory}</td>
                  <td className="p-4 text-zinc-500">{r.retail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   18. THE HR SPORTS BANNER (Statement Strip)
   ───────────────────────────────────────────────────────────── */
export interface TheHRSportsBannerProps {
  badge?: string;
  title?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function LiveTheHRSportsBanner({
  badge = 'DIRECT FROM LAHORE, PAKISTAN',
  title = 'Crafting World-Class Custom Sports Apparel Since 2008',
  ctaText = 'Explore Categories →',
  ctaLink = '/#styles',
}: TheHRSportsBannerProps) {
  return (
    <div className="bg-black text-white py-8 px-4 sm:px-8 border-b border-zinc-800 text-center select-none">
      <div className="max-w-4xl mx-auto space-y-3">
        {badge && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            {badge}
          </span>
        )}
        <h2 className="text-xl sm:text-3xl font-black">{title}</h2>
        {ctaText && (
          <div className="pt-1">
            <Link href={ctaLink || '/#styles'} className="text-xs font-mono font-bold text-zinc-300 underline underline-offset-4 hover:text-white">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   19. SHOPIFY-STYLE MODULAR VIDEO SECTION (HTML5 & Iframe Facade)
   ───────────────────────────────────────────────────────────── */
export interface VideoSectionProps {
  sourceType?: 'mp4' | 'youtube' | 'vimeo';
  videoUrl?: string;
  mobileVideoUrl?: string;
  posterUrl?: string;
  containerWidth?: 'full' | 'page';
  sizingMode?: 'aspect' | 'hero';
  aspectRatio?: '16/9' | '9/16' | '1/1' | '4/3';
  desktopHeight?: '400px' | '500px' | '600px' | '80vh' | '100vh';
  mobileHeight?: '300px' | '400px' | '500px' | '70vh';
  borderRadius?: '0px' | '12px' | '24px' | '32px';
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  overlayOpacity?: number;
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function getVideoEmbedUrl(
  url: string,
  autoplay: boolean = true,
  loop: boolean = true,
  muted: boolean = true,
  controls: boolean = false
): string {
  if (!url) return '';

  // YouTube Link (watch?v=, youtu.be, shorts, embed)
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?#/]+)/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted || autoplay ? '1' : '0',
      loop: loop ? '1' : '0',
      playlist: loop ? videoId : '',
      controls: controls ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    });
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }

  // Vimeo Link
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      muted: muted || autoplay ? '1' : '0',
      loop: loop ? '1' : '0',
      controls: controls ? '1' : '0',
    });
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }

  return url;
}

export function LiveVideoSection({
  sourceType = 'mp4',
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  mobileVideoUrl = '',
  posterUrl = '',
  containerWidth = 'page',
  sizingMode = 'aspect',
  aspectRatio = '16/9',
  desktopHeight = '600px',
  mobileHeight = '500px',
  borderRadius = '12px',
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  overlayOpacity = 0.25,
  heading = 'Engineered In Lahore. Delivered Worldwide.',
  subheading = 'High-performance athletic apparel manufactured directly from raw yarn to finished garments.',
  buttonText = 'Request Factory Quote',
  buttonLink = '/request-a-quote',
}: VideoSectionProps) {
  const isHero = sizingMode === 'hero';
  const isIframe = sourceType === 'youtube' || sourceType === 'vimeo';

  // Dynamic CSS variables for responsive hero heights
  const containerStyle: React.CSSProperties = {
    borderRadius,
    aspectRatio: !isHero ? aspectRatio.replace('/', ' / ') : undefined,
    ['--desktop-h' as any]: desktopHeight,
    ['--mobile-h' as any]: mobileHeight,
  };

  const embedUrl = isIframe ? getVideoEmbedUrl(videoUrl, autoplay, loop, muted, controls) : '';

  return (
    <section className={`py-4 sm:py-6 ${containerWidth === 'page' ? 'max-w-7xl mx-auto px-4 sm:px-6' : 'w-full px-0'}`}>
      <div
        style={containerStyle}
        className={`relative w-full overflow-hidden bg-black shadow-xl border border-zinc-800 ${
          isHero ? 'h-[var(--mobile-h)] md:h-[var(--desktop-h)]' : 'w-full'
        }`}
      >
        {/* Direct HTML5 Video Player */}
        {!isIframe && (
          <video
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            controls={controls}
            poster={posterUrl || undefined}
            className={`w-full h-full ${isHero ? 'object-cover' : 'object-contain bg-black'}`}
          >
            {mobileVideoUrl && (
              <source media="(max-width: 768px)" src={mobileVideoUrl} type="video/mp4" />
            )}
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* External YouTube / Vimeo Iframe Facade */}
        {isIframe && (
          <iframe
            src={embedUrl}
            title={heading || 'HR Sports Video'}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}

        {/* Optional Dark Overlay for Text Readability */}
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity"
            style={{ opacity: overlayOpacity }}
          />
        )}

        {/* Structured Text & CTA Overlay */}
        {(heading || subheading || buttonText) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white z-10 pointer-events-none">
            <div className="max-w-2xl space-y-3 pointer-events-auto">
              {heading && (
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="text-xs sm:text-base md:text-lg text-zinc-200 leading-relaxed drop-shadow font-medium max-w-xl mx-auto">
                  {subheading}
                </p>
              )}
              {buttonText && (
                <div className="pt-2">
                  <Link
                    href={buttonLink || '/request-a-quote'}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:bg-zinc-200 transition shadow-lg hover:scale-105 active:scale-95"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   19. HEADER NAVIGATION & MEGA DROPDOWN SETTINGS
   Controls sticky mode, quote button, Apparel promo card, and Contact details
   ───────────────────────────────────────────────────────────── */
export interface HeaderNavProps {
  id?: string;
  stickyMode?: 'always' | 'scroll-up' | 'none';
  quoteButtonText?: string;
  quoteButtonLink?: string;

  /* Sportswear col 1 */
  col1Heading?: string;
  col1Badge?: string;
  sportswear1Title?: string;
  sportswear1Desc?: string;
  sportswear1Link?: string;
  sportswear2Title?: string;
  sportswear2Desc?: string;
  sportswear2Link?: string;
  sportswear3Title?: string;
  sportswear3Desc?: string;
  sportswear3Link?: string;
  sportswear4Title?: string;
  sportswear4Desc?: string;
  sportswear4Link?: string;
  sportswear5Title?: string;
  sportswear5Desc?: string;
  sportswear5Link?: string;

  /* Uniforms col 2 */
  col2Heading?: string;
  col2Badge?: string;
  uniform1Title?: string;
  uniform1Desc?: string;
  uniform1Link?: string;
  uniform2Title?: string;
  uniform2Desc?: string;
  uniform2Link?: string;
  uniform3Title?: string;
  uniform3Desc?: string;
  uniform3Link?: string;

  /* Promo card col 3 */
  apparelPromoHeading?: string;
  apparelPromoSub?: string;
  apparelPromoButtonText?: string;
  apparelPromoButtonLink?: string;

  /* Contact info */
  contactAddress?: string;
  contactHours?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export function LiveHeaderNav({
  stickyMode = 'scroll-up',
  quoteButtonText = 'Request a Quote',
  quoteButtonLink = '/request-a-quote',
  col1Heading = 'Custom Sportswear',
  col1Badge = 'Coming Soon',
  sportswear1Title = 'Cricket',
  sportswear1Desc = 'Matchday whites, T20 color kits & gear',
  sportswear2Title = 'Football / Soccer',
  sportswear2Desc = 'Match jerseys, shorts & drill kits',
  sportswear3Title = 'Basketball',
  sportswear3Desc = 'Game jerseys & open-hole mesh shorts',
  sportswear4Title = 'Gym & Activewear',
  sportswear4Desc = 'Compression tops, leggings & tanks',
  sportswear5Title = 'Hockey',
  sportswear5Desc = 'Pro sublimated ice & field hockey kits',

  col2Heading = 'Uniforms',
  col2Badge = 'Coming Soon',
  uniform1Title = 'Corporate Uniforms',
  uniform1Desc = 'Executive tech polos & corporate workwear',
  uniform2Title = 'Security Uniforms',
  uniform2Desc = 'Ripstop patrol shirts, tactical cargo & vests',
  uniform3Title = 'Promotional Uniforms',
  uniform3Desc = 'Event crew tees, exhibition polos & caps',

  apparelPromoHeading = 'Custom Sports Clothes',
  apparelPromoSub = 'Send us your idea or design. We make a physical sample for you to check before starting your batch.',
  apparelPromoButtonText = 'See All Styles',
  apparelPromoButtonLink = '/#styles',
  contactAddress = 'Green Building, Block B New Chauburji Park, Multan Road, Lahore, Pakistan',
  contactHours = 'Mon to Saturday 9 am to 10 pm',
  contactPhone = '+92 300 0000000',
  contactEmail = 'sales@thehrsports.com',
}: HeaderNavProps) {
  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs select-none space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-ink" />
          <h3 className="font-bold text-sm text-ink">Storefront Header &amp; Mega Menus</h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-bold">
          Sticky: {stickyMode}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Col 1 summary */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">{col1Heading}</span>
            <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-black">{col1Badge}</span>
          </div>
          <p className="text-[11px] text-zinc-600 font-medium">1. {sportswear1Title} — {sportswear1Desc}</p>
          <p className="text-[11px] text-zinc-600 font-medium">2. {sportswear2Title} — {sportswear2Desc}</p>
          <p className="text-[11px] text-zinc-600 font-medium">3. {sportswear3Title} — {sportswear3Desc}</p>
          <p className="text-[11px] text-zinc-600 font-medium">4. {sportswear4Title} — {sportswear4Desc}</p>
          <p className="text-[11px] text-zinc-600 font-medium">5. {sportswear5Title} — {sportswear5Desc}</p>
        </div>

        {/* Col 2 summary */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">{col2Heading}</span>
            <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-black">{col2Badge}</span>
          </div>
          <p className="text-[11px] text-zinc-600 font-medium">1. {uniform1Title} — {uniform1Desc}</p>
          <p className="text-[11px] text-zinc-600 font-medium">2. {uniform2Title} — {uniform2Desc}</p>
          <p className="text-[11px] text-zinc-600 font-medium">3. {uniform3Title} — {uniform3Desc}</p>
        </div>

        {/* Col 3 summary */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
          <div className="font-bold text-zinc-800 text-[11px] uppercase tracking-wider">Promo Card & Contact</div>
          <p className="font-semibold text-ink text-xs">{apparelPromoHeading}</p>
          <p className="text-[10px] text-zinc-500 line-clamp-2">{apparelPromoSub}</p>
          <p className="text-[10px] text-zinc-600 truncate">📞 {contactPhone} | ✉️ {contactEmail}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   20. STYLE CATEGORY HEADER (Existing on /styles/[category])
   ───────────────────────────────────────────────────────────── */
export interface CategoryHeaderProps {
  id?: string;
  categoryName?: string;
  tagline?: string;
  description?: string;
  badgeText?: string;
  showBadge?: boolean;
}

export function LiveCategoryHeader({
  categoryName = 'Cricket',
  tagline = 'Matchday Whites, Colored T20 Kits & Training Gear',
  description = 'Professional grade cricket uniforms engineered with moisture-wicking AeroVent™ pinhole mesh, UV 50+ sun protection, and reinforced stretch panels for high-intensity bowling and batting.',
  badgeText = 'Coming Soon',
  showBadge = true,
}: CategoryHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-zinc-200">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          {showBadge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-mono font-black uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{badgeText}</span>
            </span>
          )}
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500">
            • {tagline}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-tight flex flex-wrap items-center gap-3">
          <span>{categoryName}</span>
          {showBadge && (
            <span className="font-black text-xs sm:text-sm uppercase tracking-widest px-3 py-1 bg-black text-white rounded-md inline-block">
              {badgeText}
            </span>
          )}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   21. STYLE CATEGORY PRODUCT GRID (Existing on /styles/[category])
   ───────────────────────────────────────────────────────────── */
export interface CategoryProductGridProps {
  id?: string;
  columns?: 2 | 3;
  showMaterials?: boolean;
  moqNotice?: string;
  quoteButtonText?: string;
}

export function LiveCategoryProductGrid({
  columns = 3,
  showMaterials = true,
  moqNotice = '15–30 pieces minimum • Physical pre-production sample approval before batch cutting',
  quoteButtonText = 'Request Priority Quote',
}: CategoryProductGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-200">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
          Category Products &amp; Fabric Specs
        </span>
        <span className="text-xs font-mono text-zinc-500">{moqNotice}</span>
      </div>

      <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-3">
            <div className="w-full aspect-4/3 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 font-mono text-xs">
              Product Sample {item}
            </div>
            <h4 className="font-bold text-sm text-ink">Custom Performance Kit #{item}</h4>
            <p className="text-xs text-zinc-500">Molecular dye-sublimation match kit with ergonomic collar and pro athletic cut.</p>
            {showMaterials && (
              <div className="p-2.5 rounded-lg bg-zinc-50 text-[11px] font-mono text-zinc-600 space-y-1">
                <div className="font-bold text-zinc-900">AeroVent™ Pinhole Mesh (160 GSM)</div>
                <div>100% Recycled Technical Poly • UPF 50+ UV Defense</div>
              </div>
            )}
            <div className="pt-2">
              <span className="block w-full text-center py-2 rounded-xl bg-black text-white text-xs font-bold">
                {quoteButtonText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


