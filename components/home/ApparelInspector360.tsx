'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ChevronLeft, ChevronRight, Eye, ShieldCheck, Sparkles, Check, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/shared/Badge';

interface FrameView {
  id: string;
  label: string;
  angleName: string;
  imageUrl: string;
  hotspots: {
    x: number; // percentage
    y: number;
    title: string;
    description: string;
  }[];
}

const frames: FrameView[] = [
  {
    id: 'front',
    label: '01 / Front View (0°)',
    angleName: 'Front Chest & Collar',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      {
        x: 50,
        y: 22,
        title: 'Ergonomic Ribbed Collar',
        description: 'Reinforced 2-piece rib construction prevents neck deformation after 100+ wash cycles.',
      },
      {
        x: 35,
        y: 45,
        title: '1200 DPI Dye-Sublimation',
        description: 'Permanent molecular dye bonding into 145 GSM AeroVent™ filament with zero fading.',
      },
    ],
  },
  {
    id: 'three_quarter',
    label: '02 / Three-Quarter (45°)',
    angleName: 'Raglan Sleeve & Shoulder',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      {
        x: 68,
        y: 35,
        title: 'Articulated Raglan Gusset',
        description: 'Underarm contouring delivers full 180° arm extension without pulling the hem upward.',
      },
    ],
  },
  {
    id: 'side',
    label: '03 / Lateral Profile (90°)',
    angleName: 'Zoned Ventilation Pinhole',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      {
        x: 52,
        y: 58,
        title: 'Laser-Cut Vent Matrix',
        description: 'Micro-perforated lateral vents maximize convective heat dissipation during peak exertion.',
      },
    ],
  },
  {
    id: 'back',
    label: '04 / Rear View (180°)',
    angleName: 'Dorsal Ventilation & Hem',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      {
        x: 50,
        y: 30,
        title: 'High-Contrast Name & Number',
        description: 'Thermo-welded athletic vinyl or direct dye infusion matching UEFA/FIFA regulations.',
      },
      {
        x: 50,
        y: 82,
        title: 'Drop-Tail Ergonomic Hem',
        description: 'Extended rear coverage stays tucked during dynamic athletic sprints.',
      },
    ],
  },
];

export const ApparelInspector360: React.FC = () => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentFrame = frames[currentFrameIndex];

  // Preload images into browser memory
  useEffect(() => {
    frames.forEach((frame) => {
      const img = new Image();
      img.src = frame.imageUrl;
    });
  }, []);

  const nextFrame = useCallback(() => {
    setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    setActiveHotspot(null);
  }, []);

  const prevFrame = useCallback(() => {
    setCurrentFrameIndex((prev) => (prev - 1 + frames.length) % frames.length);
    setActiveHotspot(null);
  }, []);

  // Auto-spin interval
  useEffect(() => {
    if (!isAutoSpinning) return;
    const interval = setInterval(() => {
      nextFrame();
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoSpinning, nextFrame]);

  // Pointer drag events for interactive 360 scrubbing
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    setIsAutoSpinning(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        prevFrame();
      } else {
        nextFrame();
      }
      startX.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <section className="py-16 md:py-24 bg-surface border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ink" />
              Interactive Quality Inspection
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              360° Master Garment Inspector
            </h2>
            <p className="text-sm text-muted mt-1 max-w-xl">
              Rotate, drag, and inspect our pro matchday jersey construction down to micro-mesh ventilation zones and 6-needle flatlock seams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              className={cn(
                'px-3.5 py-2 text-xs font-mono uppercase tracking-wider font-semibold border-hairline rounded-base transition-colors flex items-center gap-2',
                isAutoSpinning
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink border-border hover:bg-zinc-100'
              )}
            >
              {isAutoSpinning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Auto-Rotate
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Auto 360° Spin
                </>
              )}
            </button>
            <Badge variant="surface" size="md">
              AQL 1.0 Factory Spec
            </Badge>
          </div>
        </div>

        {/* 360 Viewport Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Stage */}
          <div className="lg:col-span-8">
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="relative w-full aspect-4/3 sm:aspect-16/10 bg-white border-hairline border-border rounded-base overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-xs"
            >
              {/* Active Image with Framer Motion crossfade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFrame.id}
                  initial={{ opacity: 0.65 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.65 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentFrame.imageUrl}
                    alt={`HR Sports Jersey 360 view ${currentFrame.label}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>

              {/* View Angle HUD Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="bg-ink/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-base text-xs font-mono tracking-wider flex items-center gap-2 border-hairline border-zinc-700">
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{currentFrame.label}</span>
                </div>
              </div>

              {/* Hotspot Interactive Markers */}
              {currentFrame.hotspots.map((hotspot, idx) => {
                const isOpen = activeHotspot === idx;
                return (
                  <div
                    key={idx}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(isOpen ? null : idx);
                      }}
                      className={cn(
                        'relative w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg',
                        isOpen
                          ? 'bg-ink text-white ring-4 ring-white/80'
                          : 'bg-white text-ink ring-2 ring-ink'
                      )}
                      aria-label={hotspot.title}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    {/* Popover Callout */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-ink text-white p-3.5 rounded-base border-hairline border-zinc-700 shadow-2xl z-30 pointer-events-auto"
                        >
                          <div className="text-[10px] font-mono text-surface uppercase tracking-wider mb-1 font-bold">
                            Textile Spec Callout
                          </div>
                          <div className="text-xs font-bold leading-tight text-white mb-1">
                            {hotspot.title}
                          </div>
                          <p className="text-[11px] text-zinc-300 leading-snug">
                            {hotspot.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Drag Prompt Hint */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <span className="text-[11px] font-mono text-ink/80 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-sm border-hairline border-border">
                  ⇄ Drag or swipe horizontally to rotate view
                </span>
                <div className="flex items-center gap-1 pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevFrame();
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-ink border-hairline border-border rounded-base transition-colors"
                    aria-label="Previous angle"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextFrame();
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-ink border-hairline border-border rounded-base transition-colors"
                    aria-label="Next angle"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Angle Indicator Navigation Bar */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {frames.map((frame, idx) => {
                const isSelected = currentFrameIndex === idx;
                return (
                  <button
                    key={frame.id}
                    onClick={() => {
                      setCurrentFrameIndex(idx);
                      setActiveHotspot(null);
                    }}
                    className={cn(
                      'p-2.5 text-left border-hairline rounded-base transition-all text-xs font-mono',
                      isSelected
                        ? 'bg-ink text-white border-ink font-bold'
                        : 'bg-white text-muted border-border hover:border-ink hover:text-ink'
                    )}
                  >
                    <span className="block text-[10px] opacity-75">0{idx + 1}</span>
                    <span className="block truncate font-semibold">{frame.angleName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Spec Details */}
          <div className="lg:col-span-4 bg-white border-hairline border-border rounded-base p-6 space-y-6">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
                Factory Master Spec
              </div>
              <h3 className="text-xl font-extrabold text-ink tracking-tight">
                AeroVent™ Match Jersey Specs
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface border-hairline border-border-light rounded-base">
                <span className="text-muted block text-[11px] font-mono">Fabric Blend & Weight</span>
                <span className="font-bold text-ink text-sm">88% Recycled Poly, 12% Spandex (145 GSM)</span>
              </div>

              <div className="p-3 bg-surface border-hairline border-border-light rounded-base">
                <span className="text-muted block text-[11px] font-mono">Printing Technology</span>
                <span className="font-bold text-ink text-sm">Japanese Digital Dye-Sublimation (1200 DPI)</span>
              </div>

              <div className="p-3 bg-surface border-hairline border-border-light rounded-base">
                <span className="text-muted block text-[11px] font-mono">Seam Reinforcement</span>
                <span className="font-bold text-ink text-sm">Twin-Needle Flatlock with Bar-Tack Stress Points</span>
              </div>

              <div className="p-3 bg-surface border-hairline border-border-light rounded-base">
                <span className="text-muted block text-[11px] font-mono">Moisture Management</span>
                <span className="font-bold text-ink text-sm">Grade 4.9/5 QuickDry Capillary Action</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border-light space-y-2">
              <div className="text-xs font-semibold text-ink flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero Graphic Peeling Guarantee</span>
              </div>
              <div className="text-xs font-semibold text-ink flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Pre-Shrunk & Colorfast Wash Tested</span>
              </div>
              <div className="text-xs font-semibold text-ink flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Custom Pantone PMS Matching</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApparelInspector360;
