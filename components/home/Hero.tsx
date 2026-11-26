'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { createClient } from '@/lib/supabase/client';

interface FactoryVideo {
  id: string;
  src: string;
  focalX?: number;
  focalY?: number;
  zoom?: number;
}

const DEFAULT_FACTORY_VIDEOS: FactoryVideo[] = [
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
  }
];

export interface HeroProps {
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

export const Hero: React.FC<HeroProps> = ({
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
}) => {
  const [videos, setVideos] = useState<FactoryVideo[]>(DEFAULT_FACTORY_VIDEOS);
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
          src: heroVideo1 || DEFAULT_FACTORY_VIDEOS[0].src,
          focalX: 50,
          focalY: 50,
          zoom: Number(videoZoom) || 1.0,
        },
        {
          id: 'custom-2',
          src: heroVideo2 || heroVideo1 || DEFAULT_FACTORY_VIDEOS[1].src,
          focalX: 50,
          focalY: 50,
          zoom: Number(videoZoom) || 1.0,
        },
        {
          id: 'custom-3',
          src: heroVideo3 || heroVideo1 || DEFAULT_FACTORY_VIDEOS[2].src,
          focalX: 50,
          focalY: 50,
          zoom: Number(videoZoom) || 1.0,
        },
      ]);
      return;
    }

    // Otherwise fetch live video slots from Supabase
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

  const activeVideo = videos[activeVideoIndex] || videos[0] || DEFAULT_FACTORY_VIDEOS[0];

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

  // Handle play / pause toggle
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

  // Switch video when clicking a loader bar
  const handleSelectVideo = (index: number) => {
    setActiveVideoIndex(index);
    setProgress(0);
  };

  // Track progress of current video
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  // Auto-advance to next video when current video finishes
  const handleVideoEnded = () => {
    setProgress(0);
    setActiveVideoIndex((prev) => (prev + 1) % (videos.length || DEFAULT_FACTORY_VIDEOS.length));
  };

  // When active video changes, reload and play
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
        {/* items-start ensures text and video start at the exact same top alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* ================================================================= */}
          {/* Left Column: Bold Typography & Action Button                      */}
          {/* Aligned with the top of the video container                       */}
          {/* ================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6 pt-0.5">
            
            {/* Giant Stacked Brutalist Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={headlineColor ? { color: headlineColor } : undefined}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[70px] xl:text-[80px] font-black uppercase tracking-[-0.035em] text-black leading-[0.92] select-none"
            >
              <div>{headline1}</div>
              <div>{headline2}</div>
              <div className="text-zinc-400">{headline3}</div>
            </motion.h1>

            {/* Sub-heading & Description */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 max-w-xl text-pretty"
            >
              <p
                style={subheadingColor ? { color: subheadingColor } : undefined}
                className="text-base sm:text-lg font-semibold text-black tracking-tight"
              >
                {subheading}
              </p>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                {description}
              </p>
            </motion.div>

            {/* Request a Quote Button */}
            <motion.div
              id="hero-quote-button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pt-1 sm:pt-2"
            >
              <Link href={buttonLink || '/request-a-quote'}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    backgroundColor: buttonBgColor || undefined,
                    color: buttonTextColor || undefined,
                  }}
                  className="w-full sm:w-auto gap-2.5 px-9 py-4 bg-black text-white hover:bg-zinc-800 rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-sm tracking-wide"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Button>
              </Link>
            </motion.div>

          </div>

          {/* ================================================================= */}
          {/* Right Column: Video Card with Natural 9:16 Aspect Ratio           */}
          {/* Top aligned with text, gray border around the video               */}
          {/* ================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-start justify-center lg:justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`relative ${aspectClass} h-[calc(100vh-140px)] ${heightClass} ${radiusClass} overflow-hidden bg-black border-2 border-zinc-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] group`}
            >
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

              {/* ---------------- Top Bar Loaders (Progress Between Videos) ---------------- */}
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

              {/* ---------------- Bottom Left: Little Black Play/Pause Button ---------------- */}
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 z-20">
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/90 hover:bg-black text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/20 cursor-pointer focus:outline-none"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  title={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  )}
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
