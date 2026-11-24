'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Edit3,
  Loader2,
  Calendar,
  Layers,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { convertInquiryToOrder } from '@/app/actions/portal';

interface PriceTier {
  id: string;
  min_quantity: number;
  max_quantity: number | null;
  unit_price: number;
}

export interface QuoteData {
  id: string;
  inquiry_id: string;
  quote_number: string;
  version: number;
  unit_price: number;
  moq: number;
  lead_time: string;
  valid_until: string;
  status: 'active' | 'expired' | 'superseded' | 'accepted';
  terms_notes?: string;
  created_at: string;
  price_tiers?: PriceTier[];
}

interface QuoteCardProps {
  quote: QuoteData;
  inquiryQuantity: number;
  onEditInquiry: () => void;
  isLatest?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  inquiryQuantity,
  onEditInquiry,
  isLatest = true,
}) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  const [isOrdering, startOrderTransition] = useTransition();
  const [orderError, setOrderError] = useState<string | null>(null);

  // Live Countdown Timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(quote.valid_until).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [quote.valid_until]);

  const isActuallyExpired = timeLeft.isExpired || quote.status === 'expired';
  const isActive = quote.status === 'active' && !isActuallyExpired;
  const isAccepted = quote.status === 'accepted';
  const isSuperseded = quote.status === 'superseded';

  // Calculate applicable price for the current inquiry quantity
  let currentUnitPrice = Number(quote.unit_price);
  if (quote.price_tiers && quote.price_tiers.length > 0) {
    const tier = quote.price_tiers.find(
      (t) =>
        inquiryQuantity >= t.min_quantity &&
        (!t.max_quantity || inquiryQuantity <= t.max_quantity)
    );
    if (tier) currentUnitPrice = Number(tier.unit_price);
  }
  const estimatedTotal = currentUnitPrice * inquiryQuantity;

  const handleOrder = () => {
    if (!isActive) return;
    setOrderError(null);
    startOrderTransition(async () => {
      const res = await convertInquiryToOrder(quote.inquiry_id, quote.id, 'client');
      if (!res.success && res.error) {
        setOrderError(res.error);
      } else if (res.data?.orderId) {
        router.push(`/portal/orders/${res.data.orderId}`);
      }
    });
  };

  return (
    <div
      className={`border rounded-base overflow-hidden transition-all shadow-sm ${
        isAccepted
          ? 'bg-white border-emerald-300'
          : isSuperseded
          ? 'bg-white border-gray-200 opacity-80'
          : isActuallyExpired
          ? 'bg-white border-red-200'
          : 'bg-white border-2 border-gray-300 shadow-sm'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-200 bg-gray-100/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-mono font-bold flex items-center justify-center text-xs">
            Q{quote.version}
          </div>
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-2">
              <span>Formal Factory Quote #{quote.quote_number}</span>
              <span className="text-[10px] text-muted font-normal">
                v{quote.version} • {new Date(quote.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge & Countdown Pill */}
        <div className="flex items-center gap-2">
          {isAccepted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Order Converted
            </span>
          ) : isSuperseded ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-muted bg-gray-100 border border-gray-200">
              Superseded by Revision
            </span>
          ) : isActuallyExpired ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Quote Expired
            </span>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-800 border border-gray-300">
              <Clock className="w-3.5 h-3.5 animate-pulse text-gray-700" />
              <span>
                Valid for {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Quote Specification Grid */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
              Unit Price (Base)
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-ink">
              ${Number(quote.unit_price).toFixed(2)}
            </span>
            <span className="block text-[10px] text-muted font-mono mt-0.5">per garment</span>
          </div>

          <div className="p-3 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
              Batch MOQ
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-ink">
              {quote.moq}
            </span>
            <span className="block text-[10px] text-muted font-mono mt-0.5">units minimum</span>
          </div>

          <div className="p-3 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
              Estimated Lead Time
            </span>
            <span className="text-sm sm:text-base font-bold text-ink flex items-center gap-1.5 mt-1">
              <Calendar className="w-4 h-4 text-gray-700 shrink-0" />
              {quote.lead_time}
            </span>
          </div>

          <div className="p-3 bg-gray-50/70 rounded-base border border-gray-200">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
              Your Batch Estimate
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="block text-[10px] text-muted font-mono mt-0.5">
              for {inquiryQuantity} units (${currentUnitPrice.toFixed(2)}/u)
            </span>
          </div>
        </div>

        {/* Quantity Tier Price Breaks Table (if present) */}
        {quote.price_tiers && quote.price_tiers.length > 0 && (
          <div className="border border-gray-200 rounded-base p-4 bg-white">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-ink mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-gray-700" />
              Volume Tier Price Breaks
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quote.price_tiers.map((tier) => {
                const isSelectedTier =
                  inquiryQuantity >= tier.min_quantity &&
                  (!tier.max_quantity || inquiryQuantity <= tier.max_quantity);

                return (
                  <div
                    key={tier.id}
                    className={`p-2.5 rounded text-center border text-xs transition ${
                      isSelectedTier
                        ? 'border-gray-400 bg-gray-100 font-bold text-gray-900 ring-1 ring-gray-400'
                        : 'border-gray-200 bg-white text-ink hover:border-gray-400'
                    }`}
                  >
                    <span className="block font-mono text-[11px] text-muted">
                      {tier.min_quantity}
                      {tier.max_quantity ? ` - ${tier.max_quantity}` : '+'} units
                    </span>
                    <span className="block text-sm font-extrabold text-ink mt-0.5">
                      ${Number(tier.unit_price).toFixed(2)}
                    </span>
                    {isSelectedTier && (
                      <span className="inline-block mt-1 text-[9px] font-mono uppercase tracking-widest text-gray-800">
                        ★ Current Tier
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Commercial Terms & Notes */}
        {quote.terms_notes && (
          <div className="text-xs text-muted bg-gray-50/70 p-3.5 rounded-base border border-gray-200 leading-relaxed">
            <strong className="text-ink font-semibold">Terms & Commercial Notes:</strong>{' '}
            {quote.terms_notes}
          </div>
        )}

        {/* Error notification */}
        {orderError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{orderError}</span>
          </div>
        )}

        {/* Action Controls */}
        {isLatest && !isAccepted && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
            <div className="text-xs text-muted font-mono">
              {isActive ? (
                <span>Lock in production batch before expiry countdown finishes.</span>
              ) : isActuallyExpired ? (
                <span className="text-red-700 font-semibold">
                  Quote expired. Click "Edit Inquiry" to request an updated commercial quote.
                </span>
              ) : (
                <span>Previous superseded version.</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onEditInquiry}
                disabled={isOrdering}
                className="gap-2 w-full sm:w-auto text-xs hover:border-gray-400 hover:text-gray-900 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Inquiry & Re-Quote
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleOrder}
                disabled={!isActive || isOrdering}
                className={`gap-2 w-full sm:w-auto text-xs font-bold cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                    : 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                }`}
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Converting Order...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Order This (${currentUnitPrice.toFixed(2)}/u)
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
