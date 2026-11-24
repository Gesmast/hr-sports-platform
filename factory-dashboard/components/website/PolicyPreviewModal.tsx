'use client';

import React from 'react';
import { X, ExternalLink, Shield, ArrowLeft } from 'lucide-react';

interface PolicyPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  content: string;
  contentUpdatedAt?: string;
}

export function PolicyPreviewModal({
  isOpen,
  onClose,
  title,
  slug,
  content,
  contentUpdatedAt,
}: PolicyPreviewModalProps) {
  if (!isOpen) return null;

  const formattedDate = contentUpdatedAt
    ? new Date(contentUpdatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'February 26, 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white text-[#1D1D1F] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-black/20">
        {/* Top Preview Bar */}
        <div className="px-5 py-3 border-b border-black/10 bg-[#FAFAFA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-black/10 text-black border border-black/20">
              Live Website Preview Mode
            </span>
            <span className="text-xs font-mono text-black/60 truncate max-w-xs">
              {process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'http://localhost:3000'}/{slug}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`${process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'http://localhost:3000'}/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded text-xs font-mono text-black/70 hover:text-black hover:bg-black/5 flex items-center gap-1 transition"
            >
              <span>Open on Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="p-1 rounded text-black/60 hover:text-black hover:bg-black/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Public Website Shell (Identical to public site layout) */}
        <div className="overflow-y-auto flex-1 bg-white p-6 sm:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Breadcrumb Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10 text-xs font-mono text-black/60">
              <span className="flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </span>
              <span className="flex items-center gap-1 text-black/80">
                <Shield className="w-3.5 h-3.5" />
                <span>Legal Documentation</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter border-b-4 border-[#1D1D1F] pb-6 text-[#1D1D1F]">
              {title}
            </h1>

            {/* Last Updated Badge */}
            <div>
              <div className="text-xs text-[#86868B] uppercase tracking-widest font-mono border-l-2 border-black pl-4">
                Last Updated: {formattedDate}
              </div>
            </div>

            {/* Policy Content (Rendered with exact typography) */}
            <div
              className="space-y-6 text-[#1D1D1F]/90 leading-relaxed text-base md:text-lg policy-prose [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:tracking-tight [&_h2]:text-[#1D1D1F] [&_h2]:border-l-4 [&_h2]:border-black [&_h2]:pl-4 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1D1D1F] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-black [&_a]:font-semibold [&_a]:underline [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 [&_img]:max-w-full [&_hr]:border-black/10 [&_hr]:my-8"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
