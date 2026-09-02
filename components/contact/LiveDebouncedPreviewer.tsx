'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Sparkles,
  RefreshCw,
  Eye,
  Download,
  Box,
  CheckCircle2,
  Clock,
  Maximize2,
  X,
  Camera,
} from 'lucide-react';
import { generateDualMockupUrls } from '@/lib/ai/garment-generator';
import { formatBytes } from '@/lib/utils';
import { DesignFile } from '@/types';
import { GarmentViewer3D } from './GarmentViewer3D';

interface LiveDebouncedPreviewerProps {
  garmentType: string;
  materialVariant?: string;
  primaryColor?: string;
  accentColor?: string;
  designNotes?: string;
  logoPlacement?: string;
  designFiles?: DesignFile[];
  uploaded3DFile?: DesignFile | null;
  onPreviewsGenerated?: (frontUrl: string, backUrl: string) => void;
}

export const LiveDebouncedPreviewer: React.FC<LiveDebouncedPreviewerProps> = ({
  garmentType,
  materialVariant,
  primaryColor = '#111111',
  accentColor = '#F5F5F0',
  designNotes = '',
  logoPlacement = 'Chest Center',
  designFiles = [],
  uploaded3DFile,
  onPreviewsGenerated,
}) => {
  const [frontUrl, setFrontUrl] = useState<string>('');
  const [backUrl, setBackUrl] = useState<string>('');
  const [frontLoaded, setFrontLoaded] = useState<boolean>(false);
  const [backLoaded, setBackLoaded] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'typing' | 'generating' | 'ready'>('idle');
  const [countdown, setCountdown] = useState<number>(5);
  const [selectedZoomImage, setSelectedZoomImage] = useState<{ url: string; title: string } | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Check if user uploaded a logo image (.png, .jpg, .svg)
  const uploadedLogo = designFiles.find((f) =>
    ['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(f.extension.toLowerCase())
  );
  const logoPreviewUrl = uploadedLogo?.previewUrl || (uploadedLogo?.storageUrl?.startsWith('blob:') ? uploadedLogo.storageUrl : undefined);

  // Core generation function
  const triggerGeneration = (customSeed?: number) => {
    setStatus('generating');
    setFrontLoaded(false);
    setBackLoaded(false);

    const newSeed = customSeed || Math.floor(Math.random() * 999999);

    const result = generateDualMockupUrls(
      {
        garmentType,
        materialVariant,
        primaryColor,
        accentColor,
        designNotes,
        logoPlacement,
        hasUploadedLogo: Boolean(uploadedLogo),
      },
      newSeed
    );

    setFrontUrl(result.frontUrl);
    setBackUrl(result.backUrl);
    setStatus('ready');

    if (onPreviewsGenerated) {
      onPreviewsGenerated(result.frontUrl, result.backUrl);
    }
  };

  // Initial load generation
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      triggerGeneration(88412);
    }
  }, []);

  // 5-Second Inactivity Debounce Watcher
  useEffect(() => {
    if (isInitialMount.current) return;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setStatus('typing');
    setCountdown(5);

    let currentSeconds = 5;
    countdownIntervalRef.current = setInterval(() => {
      currentSeconds -= 1;
      setCountdown(Math.max(0, currentSeconds));
    }, 1000);

    debounceTimerRef.current = setTimeout(() => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      triggerGeneration();
    }, 5000);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [
    designNotes,
    garmentType,
    materialVariant,
    primaryColor,
    accentColor,
    logoPlacement,
    designFiles.length,
  ]);

  return (
    <div className="space-y-4">
      {/* SECTION HEADER & REAL-TIME STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-zinc-950 text-white rounded-base border-hairline border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-zinc-800 border-hairline border-zinc-700 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <span>Dual Design Synthesizer & Showroom Viewport</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Live updates on pause (5s debounce) • Front & Rear Studio Elevations + 360° Mannequin
            </div>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-2">
          {status === 'typing' && (
            <div className="px-2.5 py-1 rounded-sm bg-amber-950/80 border-hairline border-amber-600/50 text-amber-300 font-mono text-[11px] flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Generating in {countdown}s...</span>
            </div>
          )}

          {status === 'generating' && (
            <div className="px-2.5 py-1 rounded-sm bg-blue-950/80 border-hairline border-blue-600/50 text-blue-300 font-mono text-[11px] flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Rendering AI Design...</span>
            </div>
          )}

          {status === 'ready' && (
            <div className="px-2.5 py-1 rounded-sm bg-emerald-950/80 border-hairline border-emerald-600/50 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Live Synced</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => triggerGeneration()}
            title="Force immediate refresh without waiting 5s"
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-sm border-hairline border-zinc-700 transition-colors text-xs flex items-center gap-1 font-mono"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Render Now</span>
          </button>
        </div>
      </div>

      {/* TOP SECTION: SIDE-BY-SIDE FRONT & BACK AI CONCEPT RENDERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CARD 1: FRONT VIEW */}
        <div className="bg-white border-hairline border-border rounded-base overflow-hidden shadow-xs group flex flex-col">
          <div className="px-3.5 py-2 bg-surface border-b border-border-light flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <span className="w-2 h-2 rounded-full bg-ink inline-block" />
              01 / Front Elevation (AI Studio Concept)
            </span>
            <button
              type="button"
              onClick={() => setSelectedZoomImage({ url: frontUrl, title: `${garmentType} — Front Elevation` })}
              className="p-1 text-muted hover:text-ink hover:bg-zinc-200 rounded-sm transition-colors"
              title="Inspect Full Resolution"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative aspect-3/4 bg-zinc-950 flex items-center justify-center overflow-hidden">
            {!frontLoaded && (
              <div className="absolute inset-0 bg-zinc-900 animate-pulse flex flex-col items-center justify-center text-xs font-mono text-zinc-400 gap-2">
                <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
                <span>Loading Front Elevation...</span>
              </div>
            )}

            {frontUrl && (
              <img
                src={frontUrl}
                alt={`${garmentType} Front View Concept`}
                onLoad={() => setFrontLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-500 ${frontLoaded ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-95'}`}
              />
            )}

            <div className="absolute bottom-2.5 left-2.5 bg-ink/90 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-sm border-hairline border-zinc-700">
              Front Studio Spec
            </div>
          </div>
        </div>

        {/* CARD 2: BACK VIEW */}
        <div className="bg-white border-hairline border-border rounded-base overflow-hidden shadow-xs group flex flex-col">
          <div className="px-3.5 py-2 bg-surface border-b border-border-light flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-ink flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <span className="w-2 h-2 rounded-full bg-ink inline-block" />
              02 / Rear Elevation (AI Studio Concept)
            </span>
            <button
              type="button"
              onClick={() => setSelectedZoomImage({ url: backUrl, title: `${garmentType} — Rear Elevation` })}
              className="p-1 text-muted hover:text-ink hover:bg-zinc-200 rounded-sm transition-colors"
              title="Inspect Full Resolution"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative aspect-3/4 bg-zinc-950 flex items-center justify-center overflow-hidden">
            {!backLoaded && (
              <div className="absolute inset-0 bg-zinc-900 animate-pulse flex flex-col items-center justify-center text-xs font-mono text-zinc-400 gap-2">
                <div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
                <span>Loading Rear Elevation...</span>
              </div>
            )}

            {backUrl && (
              <img
                src={backUrl}
                alt={`${garmentType} Rear View Concept`}
                onLoad={() => setBackLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-500 ${backLoaded ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-95'}`}
              />
            )}

            <div className="absolute bottom-2.5 left-2.5 bg-ink/90 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-sm border-hairline border-zinc-700">
              Rear Studio Spec
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: EXPANDED 3D ANATOMICAL SHOWROOM MANNEQUIN VIEWPORT */}
      <div className="w-full">
        <GarmentViewer3D
          garmentType={garmentType}
          primaryColor={primaryColor}
          accentColor={accentColor}
          logoUrl={logoPreviewUrl}
          logoPlacement={logoPlacement}
          modelUrl={uploaded3DFile?.storageUrl}
          fileName={uploaded3DFile?.fileName}
          fileSize={uploaded3DFile ? formatBytes(uploaded3DFile.sizeBytes) : undefined}
          heightClass="h-[420px] sm:h-[480px]"
        />
      </div>

      {/* FULL-SCREEN IMAGE ZOOM MODAL */}
      {selectedZoomImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150">
          <div className="w-full max-w-4xl flex items-center justify-between text-white font-mono text-xs pb-3 border-b border-zinc-800">
            <span className="font-bold">{selectedZoomImage.title}</span>
            <button
              type="button"
              onClick={() => setSelectedZoomImage(null)}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-base"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative max-w-4xl max-h-[80vh] mt-4 flex items-center justify-center">
            <img
              src={selectedZoomImage.url}
              alt={selectedZoomImage.title}
              className="max-h-[80vh] w-auto object-contain rounded-base border-hairline border-zinc-700 shadow-2xl"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <a
              href={selectedZoomImage.url}
              target="_blank"
              rel="noopener noreferrer"
              download={`${garmentType}-concept.jpg`}
              className="px-4 py-2 bg-white text-ink font-mono text-xs font-bold rounded-base hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download High-Res Render
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDebouncedPreviewer;
