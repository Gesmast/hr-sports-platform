'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface VideoSpec {
  src: string;
  focalX?: number;
  focalY?: number;
  zoom?: number;
}

interface ProcessStage {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  videos: string[];
  videoSpecs?: VideoSpec[];
}

const DEFAULT_STAGES: ProcessStage[] = [
  {
    id: 'design',
    stepNumber: '01',
    title: 'Design.',
    description: 'Our in-house designers create your custom designs and mockups according to your exact needs. Send us a sketch, a photo, or an idea—we build full 2D and 3D visual mockups and production-ready vector patterns.',
    videos: ['/process-videos/design-1.mp4']
  },
  {
    id: 'cutting',
    stepNumber: '02',
    title: 'Precision Hand Cutting.',
    description: 'Every panel is cut 100% by hand by master pattern cutters using high-precision shears. No laser burning and no melted edges, preserving the full natural stretch, softness, and grain alignment of performance fabrics.',
    videos: ['/process-videos/cutting-1.mp4']
  },
  {
    id: 'printing',
    stepNumber: '03',
    title: 'Sublimation Printing.',
    description: 'Custom artwork, sponsor logos, and vibrant colors are molecularly infused directly into technical fibers using high-heat thermal presses. Zero cracking, zero peeling, and permanent wash-fast durability.',
    videos: [
      '/process-videos/printing-1.mp4',
      '/process-videos/printing-2.mp4'
    ]
  },
  {
    id: 'stitching',
    stepNumber: '04',
    title: 'Stitching & Assembly.',
    description: 'Cut panels are assembled using 4-needle flatlock and heavy-duty athletic overlock machines. Seams lie completely flush against the skin to eliminate friction and withstand high-stress game movement.',
    videos: ['/process-videos/stitching-1.mp4']
  },
  {
    id: 'packing',
    stepNumber: '05',
    title: 'Quality Check & Global Shipping.',
    description: 'Every piece is hand-inspected for measurements and stitch integrity, steam-pressed, custom tagged with your woven brand labels and polybags, and dispatched worldwide via tracked express air freight.',
    videos: [
      '/process-videos/packing-1.mp4',
      '/process-videos/packing-2.mp4'
    ]
  }
];

export interface HowWeWorkProps {
  title?: string;
  subtitle?: string;
  // Station 1: Design
  stage1Title?: string;
  stage1Description?: string;
  stage1Video?: string;
  // Station 2: Precision Cutting
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

export const HowWeWork: React.FC<HowWeWorkProps> = ({
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
  stage3Video2,
  stage4Title,
  stage4Description,
  stage4Video,
  stage5Title,
  stage5Description,
  stage5Video,
  stage5Video2,
}) => {
  const [stages, setStages] = useState<ProcessStage[]>(DEFAULT_STAGES);

  // Sync custom props from Theme Editor or API
  useEffect(() => {
    setStages([
      {
        id: 'design',
        stepNumber: '01',
        title: stage1Title || DEFAULT_STAGES[0].title,
        description: stage1Description || DEFAULT_STAGES[0].description,
        videos: stage1Video ? [stage1Video] : DEFAULT_STAGES[0].videos,
      },
      {
        id: 'cutting',
        stepNumber: '02',
        title: stage2Title || DEFAULT_STAGES[1].title,
        description: stage2Description || DEFAULT_STAGES[1].description,
        videos: stage2Video ? [stage2Video] : DEFAULT_STAGES[1].videos,
      },
      {
        id: 'printing',
        stepNumber: '03',
        title: stage3Title || DEFAULT_STAGES[2].title,
        description: stage3Description || DEFAULT_STAGES[2].description,
        videos: stage3Video
          ? [stage3Video, ...(stage3Video2 ? [stage3Video2] : [])]
          : DEFAULT_STAGES[2].videos,
      },
      {
        id: 'stitching',
        stepNumber: '04',
        title: stage4Title || DEFAULT_STAGES[3].title,
        description: stage4Description || DEFAULT_STAGES[3].description,
        videos: stage4Video ? [stage4Video] : DEFAULT_STAGES[3].videos,
      },
      {
        id: 'packing',
        stepNumber: '05',
        title: stage5Title || DEFAULT_STAGES[4].title,
        description: stage5Description || DEFAULT_STAGES[4].description,
        videos: stage5Video
          ? [stage5Video, ...(stage5Video2 ? [stage5Video2] : [])]
          : DEFAULT_STAGES[4].videos,
      },
    ]);
  }, [
    stage1Title, stage1Description, stage1Video,
    stage2Title, stage2Description, stage2Video,
    stage3Title, stage3Description, stage3Video, stage3Video2,
    stage4Title, stage4Description, stage4Video,
    stage5Title, stage5Description, stage5Video, stage5Video2,
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [subVideoIndices, setSubVideoIndices] = useState<number[]>([0, 0, 0, 0, 0]);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  // 2D matrix of video refs: videoRefs.current[stageIndex][subVideoIndex]
  const videoRefs = useRef<(HTMLVideoElement | null)[][]>([[], [], [], [], []]);

  // Fetch dynamic process video slots from Supabase
  useEffect(() => {
    const fetchProcessSlots = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('website_video_slots')
          .select('slot_key, current_video_url, focal_point_x, focal_point_y, zoom_level')
          .like('slot_key', 'process_step_%');

        if (data && data.length > 0) {
          const slotMap = new Map<string, { url: string; fx: number; fy: number; zoom: number }>();
          data.forEach((item) => {
            if (item.current_video_url) {
              slotMap.set(item.slot_key, {
                url: item.current_video_url,
                fx: Number(item.focal_point_x) || 50,
                fy: Number(item.focal_point_y) || 50,
                zoom: Number(item.zoom_level) || 1.0,
              });
            }
          });

          setStages((prev) =>
            prev.map((stage) => {
              const updated = { ...stage };
              if (stage.id === 'design' && slotMap.has('process_step_1_design')) {
                const s = slotMap.get('process_step_1_design')!;
                updated.videos = [s.url];
                updated.videoSpecs = [{ src: s.url, focalX: s.fx, focalY: s.fy, zoom: s.zoom }];
              } else if (stage.id === 'cutting' && slotMap.has('process_step_2_cutting')) {
                const s = slotMap.get('process_step_2_cutting')!;
                updated.videos = [s.url];
                updated.videoSpecs = [{ src: s.url, focalX: s.fx, focalY: s.fy, zoom: s.zoom }];
              } else if (stage.id === 'printing') {
                const s1 = slotMap.get('process_step_3_printing_1');
                const s2 = slotMap.get('process_step_3_printing_2');
                const v1 = s1?.url || stage.videos[0];
                const v2 = s2?.url || stage.videos[1];
                updated.videos = [v1, v2];
                updated.videoSpecs = [
                  { src: v1, focalX: s1?.fx ?? 50, focalY: s1?.fy ?? 50, zoom: s1?.zoom ?? 1.0 },
                  { src: v2, focalX: s2?.fx ?? 50, focalY: s2?.fy ?? 50, zoom: s2?.zoom ?? 1.0 },
                ];
              } else if (stage.id === 'stitching' && slotMap.has('process_step_4_stitching')) {
                const s = slotMap.get('process_step_4_stitching')!;
                updated.videos = [s.url];
                updated.videoSpecs = [{ src: s.url, focalX: s.fx, focalY: s.fy, zoom: s.zoom }];
              } else if (stage.id === 'packing') {
                const s1 = slotMap.get('process_step_5_packing_1');
                const s2 = slotMap.get('process_step_5_packing_2');
                const v1 = s1?.url || stage.videos[0];
                const v2 = s2?.url || stage.videos[1];
                updated.videos = [v1, v2];
                updated.videoSpecs = [
                  { src: v1, focalX: s1?.fx ?? 50, focalY: s1?.fy ?? 50, zoom: s1?.zoom ?? 1.0 },
                  { src: v2, focalX: s2?.fx ?? 50, focalY: s2?.fy ?? 50, zoom: s2?.zoom ?? 1.0 },
                ];
              }
              return updated;
            })
          );
        }
      } catch (err) {
        console.warn('Process video slots fetch error:', err);
      }
    };
    fetchProcessSlots();
  }, []);

  // Detect when the section enters / leaves the viewport
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

  // Smooth scroll ONLY the horizontal carousel track — never touches or jerks window.scrollY
  const scrollToCard = (index: number) => {
    setIsManuallyPaused(false);
    if (!carouselRef.current) return;
    const cards = carouselRef.current.querySelectorAll<HTMLElement>('[data-card]');
    const targetCard = cards[index];
    if (targetCard) {
      const container = carouselRef.current;
      const targetScrollLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    setIsManuallyPaused(false);
    if (activeIndex < stages.length - 1) {
      scrollToCard(activeIndex + 1);
    } else {
      scrollToCard(0);
    }
  };

  const handlePrev = () => {
    setIsManuallyPaused(false);
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    } else {
      scrollToCard(stages.length - 1);
    }
  };

  // Keyboard navigation with ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') {
        if (activeIndex < stages.length - 1) scrollToCard(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        if (activeIndex > 0) scrollToCard(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  // Detect card in view when user swipes or manually scrolls
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cards = container.querySelectorAll<HTMLElement>('[data-card]');
    const containerLeft = container.getBoundingClientRect().left;

    let closestIdx = activeIndex;
    let minDiff = Infinity;

    cards.forEach((card, idx) => {
      const cardLeft = card.getBoundingClientRect().left;
      const diff = Math.abs(cardLeft - containerLeft - 16);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  // Reset progress when active video / clip changes
  useEffect(() => {
    setCurrentProgress(0);
  }, [activeIndex, subVideoIndices]);

  // Synchronize playback: play ONLY active video when section is in view and not manually paused
  useEffect(() => {
    stages.forEach((stage, sIdx) => {
      stage.videos.forEach((_, vIdx) => {
        const v = videoRefs.current[sIdx]?.[vIdx];
        if (!v) return;
        const isCurrentActive = sIdx === activeIndex && vIdx === (subVideoIndices[sIdx] || 0);
        if (isCurrentActive && isInView && !isManuallyPaused) {
          v.play().catch(() => {});
          setIsPlaying(true);
        } else {
          v.pause();
          if (isCurrentActive && (!isInView || isManuallyPaused)) {
            setIsPlaying(false);
          }
        }
      });
    });
  }, [activeIndex, subVideoIndices, isInView, isManuallyPaused]);

  // When a video finishes: advance to next sub-video OR advance to next stage
  const handleSubVideoEnded = (stageIdx: number, subIdx: number) => {
    if (stageIdx !== activeIndex) return;

    const currentStage = stages[stageIdx];
    // If there is another video in this card (e.g., Part 1 -> Part 2)
    if (subIdx < currentStage.videos.length - 1) {
      setSubVideoIndices((prev) => {
        const next = [...prev];
        next[stageIdx] = subIdx + 1;
        return next;
      });
      setCurrentProgress(0);
    } else {
      // Current stage is fully done: automatically scroll to next stage card
      if (activeIndex < stages.length - 1) {
        scrollToCard(activeIndex + 1);
      } else {
        scrollToCard(0);
      }
    }
  };

  // Progress update for the top story bar
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>, stageIdx: number, subIdx: number) => {
    if (stageIdx !== activeIndex || subIdx !== (subVideoIndices[stageIdx] || 0)) return;
    const v = e.currentTarget;
    if (v.duration > 0) {
      setCurrentProgress((v.currentTime / v.duration) * 100);
    }
  };

  // Switch sub-video manually inside a card (e.g., click Part 1 or Part 2)
  const switchSubVideo = (stageIdx: number, targetSubIdx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsManuallyPaused(false);
    if (stageIdx !== activeIndex) {
      scrollToCard(stageIdx);
    }
    setSubVideoIndices((prev) => {
      const next = [...prev];
      next[stageIdx] = targetSubIdx;
      return next;
    });
    setCurrentProgress(0);
  };

  // Play / Pause toggle for current active video
  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeSubIdx = subVideoIndices[activeIndex] || 0;
    const currentVideo = videoRefs.current[activeIndex]?.[activeSubIdx];
    if (!currentVideo) return;
    if (currentVideo.paused) {
      currentVideo.play().catch(() => {});
      setIsPlaying(true);
      setIsManuallyPaused(false);
    } else {
      currentVideo.pause();
      setIsPlaying(false);
      setIsManuallyPaused(true);
    }
  };

  // Tap navigation inside active card
  const handleCardClick = (stageIdx: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (stageIdx !== activeIndex) {
      scrollToCard(stageIdx);
      return;
    }
    const currentStage = stages[stageIdx];
    if (currentStage.videos.length <= 1) {
      togglePlayPause(e);
      return;
    }

    // On cards with 2 videos: tap left 40% = previous clip, tap right 40% = next clip, center = play/pause
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;

    const currentSubIdx = subVideoIndices[stageIdx] || 0;
    if (ratio < 0.4) {
      // Go to previous clip (Part 1)
      if (currentSubIdx > 0) {
        switchSubVideo(stageIdx, currentSubIdx - 1);
      } else {
        const v = videoRefs.current[stageIdx]?.[0];
        if (v) v.currentTime = 0;
      }
    } else if (ratio > 0.6) {
      // Go to next clip (Part 2) or next stage
      if (currentSubIdx < currentStage.videos.length - 1) {
        switchSubVideo(stageIdx, currentSubIdx + 1);
      } else {
        handleNext();
      }
    } else {
      togglePlayPause(e);
    }
  };

  return (
    <section ref={sectionRef} id="process" className="py-10 sm:py-14 md:py-16 bg-white overflow-hidden border-b border-zinc-200">
      
      {/* =================================================================== */}
      {/* Section Header: Direct Title and Subtitle                           */}
      {/* =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black tracking-tight text-black leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop Arrow Navigation at Top-Right */}
          <div className="hidden sm:flex items-center gap-2 select-none">
            <button
              onClick={handlePrev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95 border border-zinc-200"
              aria-label="Previous garment production step"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <span className="text-[11px] font-mono font-bold text-zinc-500 px-1.5">
              0{activeIndex + 1} / 05
            </span>

            <button
              onClick={handleNext}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95 border border-zinc-200"
              aria-label="Next garment production step"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Horizontal Carousel Track: 20% Zoomed Out Cards with Peeking Next  */}
      {/* =================================================================== */}
      <div 
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex items-start gap-3 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none px-4 sm:px-6 lg:px-8 pb-3"
        style={{ scrollPaddingLeft: '1rem' }}
      >
        {stages.map((stage, stageIdx) => {
          const currentSubIdx = subVideoIndices[stageIdx] || 0;
          const hasMultipleVideos = stage.videos.length > 1;
          const isThisCardActive = stageIdx === activeIndex;

          return (
            <div
              key={stage.id}
              data-card
              data-index={stageIdx}
              className="w-[72vw] sm:w-[310px] md:w-[350px] lg:w-[380px] shrink-0 snap-start flex flex-col group select-none"
            >
              
              {/* Media Card Container */}
              <div 
                onClick={(e) => handleCardClick(stageIdx, e)}
                className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-950 shadow-md transition-transform duration-200 group-hover:scale-[1.01] border border-black/10 cursor-pointer"
              >
                
                {/* --------------------------------------------------------- */}
                {/* Story Progress Bar at Top (Present on ALL cards!)         */}
                {/* --------------------------------------------------------- */}
                <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-1 px-2.5 pt-2.5 pb-2 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                  {stage.videos.map((_, vIdx) => {
                    const isPassed = vIdx < currentSubIdx;
                    const isCurrent = vIdx === currentSubIdx && isThisCardActive;

                    return (
                      <div
                        key={vIdx}
                        onClick={(e) => switchSubVideo(stageIdx, vIdx, e)}
                        className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer hover:bg-white/60 transition-colors"
                        title={hasMultipleVideos ? `Part ${vIdx + 1}` : 'Progress'}
                      >
                        <div
                          className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                          style={{
                            width: isPassed ? '100%' : isCurrent ? `${currentProgress}%` : '0%'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* --------------------------------------------------------- */}
                {/* Card Header: Part 1 / Part 2 Switcher OR Stage Badge      */}
                {/* --------------------------------------------------------- */}
                <div className="absolute top-3.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
                  
                  {hasMultipleVideos ? (
                    /* Interactive Clip Switcher for 2-Video Cards */
                    <div className="flex items-center gap-1 pointer-events-auto bg-black/50 backdrop-blur-md p-0.5 rounded-lg border border-white/20">
                      {stage.videos.map((_, vIdx) => {
                        const isSelected = vIdx === currentSubIdx;
                        return (
                          <button
                            key={vIdx}
                            onClick={(e) => switchSubVideo(stageIdx, vIdx, e)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black shadow-sm'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                            aria-label={`View Part ${vIdx + 1}`}
                          >
                            Part {vIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Single Stage Badge */
                    <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/20">
                      STAGE {stage.stepNumber}
                    </span>
                  )}

                  {/* Right side indicator: Part counter or stage tag */}
                  <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md border border-white/20">
                    {hasMultipleVideos ? `CLIP ${currentSubIdx + 1}/2` : `STAGE ${stage.stepNumber}`}
                  </span>
                </div>

                {/* --------------------------------------------------------- */}
                {/* Videos: Treated as SEPARATE elements to eliminate freeze   */}
                {/* (Strictly MUTED with NO audio for all videos)              */}
                {/* --------------------------------------------------------- */}
                {stage.videos.map((videoSrc, subIdx) => {
                  const isVisible = currentSubIdx === subIdx;
                  const spec = stage.videoSpecs?.[subIdx];
                  const fx = spec?.focalX ?? 50;
                  const fy = spec?.focalY ?? 50;
                  const zoom = spec?.zoom ?? 1.0;
                  return (
                    <video
                      key={videoSrc}
                      ref={(el) => {
                        if (!videoRefs.current[stageIdx]) {
                          videoRefs.current[stageIdx] = [];
                        }
                        videoRefs.current[stageIdx][subIdx] = el;
                      }}
                      src={videoSrc}
                      playsInline
                      muted
                      preload="auto"
                      style={{
                        objectFit: 'cover',
                        objectPosition: `${fx}% ${fy}%`,
                        transform: `scale(${zoom})`,
                        transformOrigin: `${fx}% ${fy}%`,
                      }}
                      onTimeUpdate={(e) => handleTimeUpdate(e, stageIdx, subIdx)}
                      onEnded={() => handleSubVideoEnded(stageIdx, subIdx)}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
                        isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    />
                  );
                })}

                {/* --------------------------------------------------------- */}
                {/* Play / Pause Toggle Button                                */}
                {/* --------------------------------------------------------- */}
                {isThisCardActive && (
                  <div className="absolute bottom-2.5 left-2.5 z-30">
                    <button
                      onClick={togglePlayPause}
                      className="w-7 h-7 rounded-full bg-black/75 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center border border-white/20"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-2.5 h-2.5 fill-current stroke-none" />
                      ) : (
                        <Play className="w-2.5 h-2.5 fill-current stroke-none translate-x-0.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Tap left/right indicator hint for cards with 2 videos */}
                {hasMultipleVideos && isThisCardActive && (
                  <div className="absolute bottom-2.5 right-2.5 z-30 pointer-events-none">
                    <span className="bg-black/70 backdrop-blur-md text-white/90 text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest">
                      Tap sides to switch
                    </span>
                  </div>
                )}

              </div>

              {/* Clean Apple-Style Inline Caption Under Card */}
              <div className="mt-2.5 sm:mt-3 text-left">
                <p className="text-xs sm:text-[13px] md:text-sm leading-relaxed text-zinc-600">
                  <strong className="text-black font-extrabold mr-1 text-xs sm:text-[13px] md:text-sm">
                    {stage.title}
                  </strong>
                  {stage.description}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* Mobile Bottom Navigation Bar (Arrows & Counter at Bottom Right)    */}
      {/* =================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex sm:hidden items-center justify-between select-none">
        <span className="text-[11px] font-mono font-bold text-zinc-500">
          0{activeIndex + 1} / 05 — Swipe or tap
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95 border border-zinc-200"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center transition-colors cursor-pointer active:scale-95 border border-zinc-200"
            aria-label="Next step"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

    </section>
  );
};

export default HowWeWork;
