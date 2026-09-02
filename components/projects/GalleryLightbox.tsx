'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryLightboxProps {
  images: string[];
  title: string;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ images, title }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev ?? 0) - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % images.length);
  };

  return (
    <>
      {/* Thumbnails Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-4/3 rounded-base overflow-hidden border-hairline border-border cursor-pointer bg-zinc-950"
          >
            <img
              src={img}
              alt={`${title} photo ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-ink text-white p-2 rounded-base flex items-center gap-1.5 text-xs font-mono">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Full Resolution</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-zinc-300 p-2 border-hairline border-zinc-700 rounded-base z-50 bg-zinc-900/80"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white hover:text-zinc-300 p-3 border-hairline border-zinc-700 rounded-base z-50 bg-zinc-900/80"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center">
            <img
              src={images[lightboxIndex]}
              alt={`${title} high resolution preview`}
              className="max-w-full max-h-[85vh] object-contain rounded-base border-hairline border-zinc-800"
            />
            <div className="absolute bottom-4 left-4 bg-ink/90 text-white px-3 py-1 text-xs font-mono border-hairline border-zinc-700 rounded-sm">
              Image {lightboxIndex + 1} of {images.length}
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white hover:text-zinc-300 p-3 border-hairline border-zinc-700 rounded-base z-50 bg-zinc-900/80"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default GalleryLightbox;
