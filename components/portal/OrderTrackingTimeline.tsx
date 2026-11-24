'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  Truck,
  Package,
  Layers,
  Scissors,
  Printer,
  ExternalLink,
  ImageIcon,
  X
} from 'lucide-react';

export interface TrackingStage {
  id: string;
  stage_index: number;
  stage_key: string;
  stage_name: string;
  status: 'pending' | 'in_progress' | 'complete';
  reached_at?: string;
  notes?: string;
  images?: string[];
  tracking_number?: string;
}

interface OrderTrackingTimelineProps {
  stages: TrackingStage[];
  carrier?: string;
  trackingNumber?: string;
  shippedAt?: string;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  stages,
  carrier,
  trackingNumber,
  shippedAt,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStageIcon = (key: string) => {
    switch (key) {
      case 'order_confirmed':
        return <Package className="w-4 h-4" />;
      case 'fabric_cutting':
        return <Scissors className="w-4 h-4" />;
      case 'printing_assembly':
        return <Printer className="w-4 h-4" />;
      case 'quality_packing':
        return <Layers className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getCarrierUrl = (carrierName?: string, trackingNo?: string) => {
    if (!trackingNo) return '#';
    const c = carrierName?.toLowerCase() || '';
    if (c.includes('dhl')) {
      return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNo}`;
    }
    if (c.includes('fedex')) {
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNo}`;
    }
    if (c.includes('ups')) {
      return `https://www.ups.com/track?tracknum=${trackingNo}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(`${carrierName || 'carrier'} tracking ${trackingNo}`)}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-base p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
            Direct Factory Workflow
          </div>
          <h3 className="text-xl font-extrabold text-ink tracking-tight">
            5-Stage Manufacturing Timeline
          </h3>
        </div>

        {/* Global Progress Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-muted">Progress:</span>
          <span className="font-extrabold text-ink">
            {stages.filter((s) => s.status === 'complete').length} / {stages.length} Stages Completed
          </span>
        </div>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
        {stages.map((stage, idx) => {
          const isComplete = stage.status === 'complete';
          const isInProgress = stage.status === 'in_progress';
          const isShippedStage = stage.stage_key === 'shipped';
          const activeTrackingNo = stage.tracking_number || trackingNumber;

          return (
            <div key={stage.id || idx} className="relative group">
              {/* Stepper Node Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition ${
                  isComplete
                    ? 'bg-zinc-800 border-white text-white shadow-2xs'
                    : isInProgress
                    ? 'bg-gray-800 border-white text-white ring-4 ring-gray-200 animate-pulse'
                    : 'bg-white border-gray-200 text-muted'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  getStageIcon(stage.stage_key)
                )}
              </div>

              {/* Stage Content Card */}
              <div
                className={`p-4 sm:p-5 rounded-base border transition ${
                  isInProgress
                    ? 'bg-gray-50 border-gray-300 shadow-2xs'
                    : isComplete
                    ? 'bg-white border-gray-200 shadow-2xs'
                    : 'bg-gray-50/40 border-gray-200/70 opacity-75'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-muted">
                      0{stage.stage_index}.
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-ink">
                      {stage.stage_name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full font-semibold border border-gray-300">
                        <CheckCircle2 className="w-3 h-3 text-gray-700" />
                        Completed {stage.reached_at ? `on ${new Date(stage.reached_at).toLocaleDateString()}` : ''}
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full font-bold border border-gray-300">
                        <Clock className="w-3 h-3 animate-spin text-gray-700" />
                        In Production
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-muted bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        Queued
                      </span>
                    )}
                  </div>
                </div>

                {stage.notes && (
                  <p className="text-xs text-muted leading-relaxed mb-3">
                    {stage.notes}
                  </p>
                )}

                {/* Proof Images Gallery uploaded from Factory */}
                {stage.images && stage.images.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-gray-700" />
                      <span>Factory Quality Proof Photos ({stage.images.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {stage.images.map((imgUrl, imgIdx) => (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => setSelectedImage(imgUrl)}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded border border-gray-200 overflow-hidden hover:opacity-90 hover:border-gray-400 hover:scale-105 transition shadow-2xs group cursor-pointer"
                        >
                          <img
                            src={imgUrl}
                            alt={`${stage.stage_name} proof ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Shipped Stage: Tracking Number Display */}
                {isShippedStage && activeTrackingNo && (
                  <div className="mt-4 p-4 rounded-base bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-emerald-700" />
                        Air Cargo Dispatch Confirmation
                      </div>
                      <div className="text-sm font-extrabold text-ink mt-0.5 font-mono">
                        {carrier || 'DHL Express'}: {activeTrackingNo}
                      </div>
                    </div>

                    <a
                      href={getCarrierUrl(carrier, activeTrackingNo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-base bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition shrink-0"
                    >
                      Track On Carrier
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-base p-2 border border-gray-200 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={selectedImage}
              alt="Factory proof inspection"
              className="max-h-[80vh] w-auto rounded object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
