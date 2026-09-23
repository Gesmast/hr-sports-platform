'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, Maximize2, Minimize2, Ruler, Loader2 } from 'lucide-react';
import { SIZE_CHART_CONFIG, SizeChartRegion } from '@/lib/constants';
import { RegionFlagIcon } from './RegionFlags';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRegion?: SizeChartRegion;
  onRegionChange?: (region: SizeChartRegion) => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  initialRegion = 'asian',
  onRegionChange,
}) => {
  const [activeRegion, setActiveRegion] = useState<SizeChartRegion>(initialRegion);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync initialRegion when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveRegion(initialRegion);
      setIsZoomed(false);
      setIsImgLoading(true);
    }
  }, [isOpen, initialRegion]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeConfig = SIZE_CHART_CONFIG[activeRegion];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const downloadEndpoint = `/api/download-size-chart?region=${activeRegion}`;
      
      // Attempt 1: Fetch as blob from same-origin API route to trigger direct file download
      const res = await fetch(downloadEndpoint);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = activeConfig.downloadFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        return;
      }
      throw new Error('API download failed');
    } catch {
      // Fallback: direct window.location trigger.
      // Because /api/download-size-chart sends Content-Disposition: attachment,
      // it directly downloads on mobile (iOS/Android) and desktop without opening a new tab!
      window.location.assign(`/api/download-size-chart?region=${activeRegion}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/75 backdrop-blur-sm"
          />

          {/* Modal / Drawer Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border-2 border-red-100 overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red Accent Top Border */}
            <div className="h-1 bg-burgundy w-full shrink-0" />

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between gap-4 bg-zinc-50/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-burgundy text-white flex items-center justify-center shadow-xs">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-ink tracking-tight flex items-center gap-2">
                    Size Specification Guide
                  </h3>
                  <p className="text-xs font-mono text-burgundy font-semibold">
                    {activeConfig.name} · {activeConfig.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 whitespace-nowrap shrink-0 text-xs font-mono font-bold text-white bg-burgundy hover:bg-burgundyHover border border-burgundy rounded-base transition-colors shadow-xs cursor-pointer"
                  title="Download size chart image directly"
                >
                  {isDownloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  ) : (
                    <Download className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="whitespace-nowrap">{isDownloading ? 'Downloading...' : 'Download Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-zinc-400 hover:text-burgundy hover:bg-red-50 transition-colors"
                  aria-label="Close size guide"
                >
                  <X className="w-5 h-5 shrink-0" />
                </button>
              </div>
            </div>

            {/* Region Selector Tabs */}
            <div className="px-4 py-2.5 bg-red-50/40 border-b border-red-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-burgundy font-bold mr-1 whitespace-nowrap shrink-0">
                Standard:
              </span>
              {(Object.keys(SIZE_CHART_CONFIG) as SizeChartRegion[]).map((regionKey) => {
                const config = SIZE_CHART_CONFIG[regionKey];
                const isActive = activeRegion === regionKey;
                return (
                  <button
                    key={regionKey}
                    type="button"
                    onClick={() => {
                      if (activeRegion !== regionKey) {
                        setIsImgLoading(true);
                        setActiveRegion(regionKey);
                        onRegionChange?.(regionKey);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 whitespace-nowrap shrink-0 rounded-base text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-burgundy text-white shadow-xs border border-burgundy'
                        : 'bg-white text-zinc-700 hover:text-burgundy border border-zinc-200 hover:border-red-300'
                    }`}
                  >
                    <RegionFlagIcon region={regionKey} className="w-4 h-3 shrink-0" />
                    <span className="whitespace-nowrap">{config.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Image Note Bar (No redundant title, description, or download buttons) */}
            <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-600 font-mono flex items-center gap-1.5">
              <span className="font-bold text-ink">Note:</span>
              <span>{activeConfig.note}</span>
            </div>

            {/* Chart Image Display Canvas */}
            <div className="relative flex-1 overflow-auto p-3 sm:p-6 bg-zinc-900/5 flex items-center justify-center min-h-[280px]">
              {isImgLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs z-10 gap-2">
                  <div className="w-7 h-7 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono font-semibold text-burgundy">
                    Loading {activeConfig.name}...
                  </span>
                </div>
              )}

              <div
                className={`transition-all duration-200 cursor-pointer ${
                  isZoomed ? 'scale-125 origin-top' : 'scale-100'
                }`}
                onClick={() => setIsZoomed((prev) => !prev)}
                title={isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeConfig.url}
                  alt={`${activeConfig.name} Sports Apparel Size Chart`}
                  onLoad={() => setIsImgLoading(false)}
                  className="max-w-full max-h-[58vh] object-contain rounded-base shadow-md border border-zinc-200 bg-white select-none"
                />
              </div>
            </div>

            {/* Footer Bar */}
            <div className="p-3 sm:p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted text-xs">
                <button
                  type="button"
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-burgundy font-mono font-bold hover:underline"
                >
                  {isZoomed ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Zoom Out</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Zoom In</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-mono font-bold bg-burgundy hover:bg-burgundyHover text-white rounded-base transition-colors shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
