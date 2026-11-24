'use client';

import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/home/Hero';
import { TrustedByStrip } from '@/components/home/TrustedByStrip';
import { HowWeWork } from '@/components/home/HowWeWork';
import { ShipWorldwideGrid } from '@/components/home/ShipWorldwideGrid';
import { ClientReviews } from '@/components/home/ClientReviews';
import { SocialFollowSection } from '@/components/home/SocialFollowSection';
import { HomeCTA } from '@/components/home/HomeCTA';
import { ChooseYourStyle } from '@/components/home/ChooseYourStyle';
import { WhyChooseHRSports } from '@/components/home/WhyChooseHRSports';
import { CapabilityGrid } from '@/components/home/CapabilityGrid';
import { HomeFAQSection } from '@/components/home/HomeFAQSection';
import { CoreValues } from '@/components/about/CoreValues';
import { VisionMission } from '@/components/about/VisionMission';
import { TheHRSportsBanner } from '@/components/shared/TheHRSportsBanner';
import { MessageCircle } from 'lucide-react';

interface ThemeSectionItem {
  type: string;
  props: Record<string, any>;
}

export function DynamicHomeRenderer() {
  const [sections, setSections] = useState<ThemeSectionItem[] | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const hasReceivedLivePreview = React.useRef(false);

  // Initial fetch for normal visitors (skipped in preview if live data received)
  useEffect(() => {
    async function fetchPublishedTheme() {
      const isPrev = typeof window !== 'undefined' && window.location.search.includes('preview=true');
      if (isPrev && hasReceivedLivePreview.current) return;

      try {
        const res = await fetch('/api/theme');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data.content)) {
            if (!hasReceivedLivePreview.current) {
              setSections(json.data.content);
            }
          }
        }
      } catch (err) {
        // Fallback silently to static default
      }
    }
    fetchPublishedTheme();
  }, []);

  // Live preview postMessage listener for Puck Editor (Option A)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isPrev = window.location.search.includes('preview=true');
      setIsPreview(isPrev);

      if (isPrev) {
        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'PUCK_PREVIEW_UPDATE') {
            hasReceivedLivePreview.current = true;
            const content = event.data.data?.content;
            if (Array.isArray(content)) {
              setSections(content);
            }
          } else if (event.data?.type === 'PUCK_BLOCK_HIGHLIGHT' || event.data?.type === 'PUCK_BLOCK_SCROLL') {
            const idx = typeof event.data.index === 'number' ? event.data.index : null;
            setSelectedBlockIndex(idx);
            if (idx !== null) {
              const el = document.querySelector(`[data-puck-index="${idx}"]`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }
        };

        window.addEventListener('message', handleMessage);

        // Freeze all link and button actions in preview mode: select-to-edit only (Shopify Style)
        const handleGlobalPreviewClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          const link = target.closest('a');
          const button = target.closest('button');

          // Prevent accidental navigation and form submits while editing
          if (link || button) {
            e.preventDefault();
            e.stopPropagation();
          }

          // Select the parent section block in Puck
          const sectionEl = target.closest('[data-puck-index]');
          if (sectionEl) {
            const idxAttr = sectionEl.getAttribute('data-puck-index');
            if (idxAttr !== null) {
              const idx = parseInt(idxAttr, 10);
              setSelectedBlockIndex(idx);
              window.parent.postMessage({ type: 'PUCK_BLOCK_SELECTED', index: idx }, '*');
            }
          }
        };
        document.addEventListener('click', handleGlobalPreviewClick, true);

        // Ping parent Puck editor that storefront is mounted and ready for real-time state
        window.parent.postMessage({ type: 'STOREFRONT_PREVIEW_READY' }, '*');

        return () => {
          window.removeEventListener('message', handleMessage);
          document.removeEventListener('click', handleGlobalPreviewClick, true);
        };
      }
    }
  }, []);

  // 1. Default fallback: Exactly mirrors the live website layout
  if (!sections || sections.length === 0) {
    return (
      <>
        <Hero />
        <TrustedByStrip />
        <HowWeWork />
        <ShipWorldwideGrid />
        <ClientReviews />
        <SocialFollowSection />
        <HomeCTA />
      </>
    );
  }

  // 2. Dynamic published rendering: Renders sections & app blocks in the exact user-ordered sequence
  return (
    <>
      {sections.map((sec, idx) => {
        const key = sec.props?.id || `${sec.type}-${idx}`;
        const p = sec.props || {};
        const isSelected = selectedBlockIndex === idx;

        // Render inner section
        let innerContent: React.ReactNode = null;

        switch (sec.type) {
          case 'HeroSection':
          case 'Hero':
            innerContent = (
              <Hero
                key={key}
                headline1={p.headline1}
                headline2={p.headline2}
                headline3={p.headline3}
                subheading={p.subheading}
                description={p.description}
                buttonText={p.buttonText}
                buttonLink={p.buttonLink}
                headlineColor={p.headlineColor}
                subheadingColor={p.subheadingColor}
                buttonBgColor={p.buttonBgColor}
                buttonTextColor={p.buttonTextColor}
                heroVideo1={p.heroVideo1}
                heroVideo2={p.heroVideo2}
                heroVideo3={p.heroVideo3}
                mobileHeroVideo={p.mobileHeroVideo}
                posterImage={p.posterImage}
                aspectRatio={p.aspectRatio}
                videoHeight={p.videoHeight}
                videoFit={p.videoFit}
                videoZoom={p.videoZoom}
                borderRadius={p.borderRadius}
                overlayDarkness={p.overlayDarkness}
              />
            );
            break;

          case 'TrustedByStrip':
            innerContent = <TrustedByStrip key={key} heading={p.heading} />;
            break;

          case 'TheHRSportsBanner':
            innerContent = <TheHRSportsBanner key={key} />;
            break;

          case 'VideoSection': {
            const isHero = p.sizingMode === 'hero';
            const isIframe = p.sourceType === 'youtube' || p.sourceType === 'vimeo';

            let embedUrl = '';
            if (isIframe && p.videoUrl) {
              const ytMatch = p.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?#/]+)/);
              if (ytMatch && ytMatch[1]) {
                const videoId = ytMatch[1];
                const params = new URLSearchParams({
                  autoplay: p.autoplay !== false ? '1' : '0',
                  mute: p.muted !== false ? '1' : '0',
                  loop: p.loop !== false ? '1' : '0',
                  playlist: p.loop !== false ? videoId : '',
                  controls: p.controls ? '1' : '0',
                  rel: '0',
                  modestbranding: '1',
                  playsinline: '1',
                });
                embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
              } else {
                const vimeoMatch = p.videoUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
                if (vimeoMatch && vimeoMatch[1]) {
                  const videoId = vimeoMatch[1];
                  const params = new URLSearchParams({
                    autoplay: p.autoplay !== false ? '1' : '0',
                    muted: p.muted !== false ? '1' : '0',
                    loop: p.loop !== false ? '1' : '0',
                    controls: p.controls ? '1' : '0',
                  });
                  embedUrl = `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
                } else {
                  embedUrl = p.videoUrl;
                }
              }
            }

            const containerStyle: React.CSSProperties = {
              borderRadius: p.borderRadius || '12px',
              aspectRatio: !isHero && p.aspectRatio ? p.aspectRatio.replace('/', ' / ') : undefined,
              ['--desktop-h' as any]: p.desktopHeight || '600px',
              ['--mobile-h' as any]: p.mobileHeight || '500px',
            };

            innerContent = (
              <section
                key={key}
                className={`py-6 sm:py-8 ${
                  p.containerWidth === 'page' ? 'max-w-7xl mx-auto px-4 sm:px-6' : 'w-full px-0'
                }`}
              >
                <div
                  style={containerStyle}
                  className={`relative w-full overflow-hidden bg-black shadow-xl border border-zinc-800 ${
                    isHero ? 'h-[var(--mobile-h)] md:h-[var(--desktop-h)]' : 'w-full'
                  }`}
                >
                  {!isIframe && (
                    <video
                      autoPlay={p.autoplay !== false}
                      loop={p.loop !== false}
                      muted={p.muted !== false}
                      playsInline
                      controls={Boolean(p.controls)}
                      poster={p.posterUrl || undefined}
                      className={`w-full h-full ${isHero ? 'object-cover' : 'object-contain bg-black'}`}
                    >
                      {p.mobileVideoUrl && (
                        <source media="(max-width: 768px)" src={p.mobileVideoUrl} type="video/mp4" />
                      )}
                      <source src={p.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
                    </video>
                  )}

                  {isIframe && (
                    <iframe
                      src={embedUrl}
                      title={p.heading || 'HR Sports Video'}
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}

                  {Number(p.overlayOpacity || 0) > 0 && (
                    <div
                      className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                      style={{ opacity: Number(p.overlayOpacity) }}
                    />
                  )}

                  {(p.heading || p.subheading || p.buttonText) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white z-10 pointer-events-none">
                      <div className="max-w-2xl space-y-3 pointer-events-auto">
                        {p.heading && (
                          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
                            {p.heading}
                          </h2>
                        )}
                        {p.subheading && (
                          <p className="text-xs sm:text-base md:text-lg text-zinc-200 leading-relaxed drop-shadow font-medium max-w-xl mx-auto">
                            {p.subheading}
                          </p>
                        )}
                        {p.buttonText && (
                          <div className="pt-2">
                            <a
                              href={p.buttonLink || '/request-a-quote'}
                              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:bg-zinc-200 transition shadow-lg hover:scale-105 active:scale-95"
                            >
                              <span>{p.buttonText}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
            break;
          }

          case 'ChooseYourStyle':
            innerContent = <ChooseYourStyle key={key} />;
            break;

          case 'HowWeWork':
            innerContent = <HowWeWork key={key} {...p} />;
            break;

          case 'WhyChooseHRSports':
            innerContent = <WhyChooseHRSports key={key} />;
            break;

          case 'CapabilityGrid':
            innerContent = <CapabilityGrid key={key} />;
            break;

          case 'ShipWorldwideGrid':
            innerContent = (
              <ShipWorldwideGrid
                key={key}
                heading={p.heading}
                subheading={p.subheading}
              />
            );
            break;

          case 'ClientReviews':
            innerContent = <ClientReviews key={key} {...p} />;
            break;

          case 'HomeFAQSection':
            innerContent = <HomeFAQSection key={key} />;
            break;

          case 'CoreValues':
            innerContent = <CoreValues key={key} />;
            break;

          case 'VisionMission':
            innerContent = <VisionMission key={key} />;
            break;

          case 'SocialFollowApp':
          case 'SocialFollowSection':
            if (p.enabled === false) return null;
            innerContent = (
              <SocialFollowSection
                key={key}
                facebookUrl={p.facebookUrl}
                embedId={p.embedId}
                eyebrow={p.eyebrow}
                heading={p.heading}
                accent={p.accent}
                followerText={p.followerText}
              />
            );
            break;

          case 'HomeCta':
          case 'HomeCTA':
          case 'CtaBanner':
            innerContent = (
              <HomeCTA
                key={key}
                headlineTop={p.headlineTop}
                headlineBottom={p.headlineBottom}
                speechBubble={p.speechBubble}
                subtitle={p.subtitle || p.subheading}
                primaryButtonText={p.primaryButtonText || p.buttonText}
                primaryButtonLink={p.primaryButtonLink || p.buttonLink}
                secondaryButtonText={p.secondaryButtonText}
                secondaryButtonLink={p.secondaryButtonLink}
              />
            );
            break;

          case 'WhatsAppConciergeApp':
            if (!p.enabled) return null;
            const phone = (p.phoneNumber || '+923000000000').replace(/[^0-9]/g, '');
            const msg = encodeURIComponent(
              p.greetingMessage || 'Hi HR Sports! I want to inquire about custom sportswear manufacturing.'
            );
            innerContent = (
              <div key={key} className="fixed bottom-6 right-6 z-[9999] select-none">
                <a
                  href={`https://wa.me/${phone}?text=${msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition hover:scale-105 active:scale-95 font-bold text-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{p.buttonText || 'Chat on WhatsApp'}</span>
                </a>
              </div>
            );
            break;

          case 'RichTextSection':
            const bgClass =
              p.background === 'dark'
                ? 'bg-[#0A0A0A] text-white border-zinc-800'
                : p.background === 'gray'
                ? 'bg-zinc-50 text-zinc-900 border-zinc-200'
                : 'bg-white text-zinc-900 border-zinc-200';
            const alignClass =
              p.align === 'left' ? 'text-left' : p.align === 'right' ? 'text-right' : 'text-center';
            innerContent = (
              <section key={key} className={`py-12 sm:py-16 px-4 border-b ${bgClass}`}>
                <div className={`max-w-4xl mx-auto space-y-3 ${alignClass}`}>
                  {p.heading && (
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{p.heading}</h2>
                  )}
                  <p className="text-xs sm:text-sm leading-relaxed opacity-80 whitespace-pre-line">
                    {p.body}
                  </p>
                </div>
              </section>
            );
            break;

          case 'AnnouncementBar':
            return null;

          default:
            return null;
        }

        if (!innerContent) return null;

        // If in preview mode, wrap with click-to-select and block highlight
        if (isPreview) {
          return (
            <div
              key={key}
              id={`preview-block-${idx}`}
              data-puck-index={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlockIndex(idx);
                window.parent.postMessage(
                  { type: 'PUCK_BLOCK_SELECTED', index: idx, blockType: sec.type },
                  '*'
                );
              }}
              className={`relative group transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-sky-500 ring-offset-2 z-20'
                  : 'hover:ring-2 hover:ring-sky-400/50 hover:ring-offset-1'
              }`}
            >
              <div
                className={`absolute top-3 left-3 z-30 transition-opacity duration-150 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shadow-md pointer-events-none ${
                  isSelected
                    ? 'opacity-100 bg-sky-600 text-white'
                    : 'opacity-0 group-hover:opacity-100 bg-black/85 text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
                <span>{sec.type}</span>
                <span className="opacity-60">#{idx + 1}</span>
              </div>
              {innerContent}
            </div>
          );
        }

        return <React.Fragment key={key}>{innerContent}</React.Fragment>;
      })}
    </>
  );
}
