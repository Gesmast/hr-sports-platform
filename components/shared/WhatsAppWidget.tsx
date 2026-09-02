'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
  delayMs?: number;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = SITE_CONFIG.whatsappNumber,
  defaultMessage = SITE_CONFIG.whatsappDefaultMessage,
  delayMs = 5000, // 5 seconds
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!isVisible) return null;

  // Clean phone number to digits only for wa.me format (e.g. 923138484511)
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out"
    >
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 bg-white text-ink border-hairline border-border-light shadow-lg rounded-2xl py-2.5 px-3.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="font-medium">
            <span className="font-bold text-ink">Need an urgent reply?</span>{' '}
            <span className="text-muted block text-[11px]">Chat directly on WhatsApp</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            aria-label="Close tooltip"
            className="p-1 text-muted hover:text-ink hover:bg-zinc-100 rounded-full transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with HR Sports on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Pulse effect ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping opacity-75 pointer-events-none group-hover:opacity-100 duration-1000" />

        {/* WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 fill-current transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
      </a>
    </aside>
  );
};

export default WhatsAppWidget;
