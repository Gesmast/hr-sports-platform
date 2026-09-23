import React from 'react';
import { Globe } from 'lucide-react';

export const UsFlagSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <svg
    viewBox="0 0 640 480"
    className={`inline-block shrink-0 rounded-[2px] shadow-2xs ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#bd3d44" d="M0 0h640v480H0z" />
    <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640" />
    <path fill="#192f5d" d="M0 0h260v258.5H0z" />
    <g fill="#fff">
      <circle cx="26" cy="20" r="7" /><circle cx="78" cy="20" r="7" /><circle cx="130" cy="20" r="7" /><circle cx="182" cy="20" r="7" /><circle cx="234" cy="20" r="7" />
      <circle cx="52" cy="40" r="7" /><circle cx="104" cy="40" r="7" /><circle cx="156" cy="40" r="7" /><circle cx="208" cy="40" r="7" />
      <circle cx="26" cy="60" r="7" /><circle cx="78" cy="60" r="7" /><circle cx="130" cy="60" r="7" /><circle cx="182" cy="60" r="7" /><circle cx="234" cy="60" r="7" />
      <circle cx="52" cy="80" r="7" /><circle cx="104" cy="80" r="7" /><circle cx="156" cy="80" r="7" /><circle cx="208" cy="80" r="7" />
      <circle cx="26" cy="100" r="7" /><circle cx="78" cy="100" r="7" /><circle cx="130" cy="100" r="7" /><circle cx="182" cy="100" r="7" /><circle cx="234" cy="100" r="7" />
      <circle cx="52" cy="120" r="7" /><circle cx="104" cy="120" r="7" /><circle cx="156" cy="120" r="7" /><circle cx="208" cy="120" r="7" />
      <circle cx="26" cy="140" r="7" /><circle cx="78" cy="140" r="7" /><circle cx="130" cy="140" r="7" /><circle cx="182" cy="140" r="7" /><circle cx="234" cy="140" r="7" />
      <circle cx="52" cy="160" r="7" /><circle cx="104" cy="160" r="7" /><circle cx="156" cy="160" r="7" /><circle cx="208" cy="160" r="7" />
      <circle cx="26" cy="180" r="7" /><circle cx="78" cy="180" r="7" /><circle cx="130" cy="180" r="7" /><circle cx="182" cy="180" r="7" /><circle cx="234" cy="180" r="7" />
      <circle cx="52" cy="200" r="7" /><circle cx="104" cy="200" r="7" /><circle cx="156" cy="200" r="7" /><circle cx="208" cy="200" r="7" />
      <circle cx="26" cy="220" r="7" /><circle cx="78" cy="220" r="7" /><circle cx="130" cy="220" r="7" /><circle cx="182" cy="220" r="7" /><circle cx="234" cy="220" r="7" />
      <circle cx="52" cy="240" r="7" /><circle cx="104" cy="240" r="7" /><circle cx="156" cy="240" r="7" /><circle cx="208" cy="240" r="7" />
    </g>
  </svg>
);

export const UkFlagSvg: React.FC<{ className?: string }> = ({ className = 'w-4 h-3' }) => (
  <svg
    viewBox="0 0 60 30"
    className={`inline-block shrink-0 rounded-[2px] shadow-2xs ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <clipPath id="uk-flag-clip-custom">
      <path d="M0 0v30h60V0z" />
    </clipPath>
    <path d="M0 0v30h60V0z" fill="#012169" />
    <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
    <path d="M0 0l60 30m0-30L0 30" clipPath="url(#uk-flag-clip-custom)" stroke="#C8102E" strokeWidth="4" />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

export const AsianFlagSvg: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <Globe className={`inline-block shrink-0 text-amber-400 ${className}`} />
);

export const RegionFlagIcon: React.FC<{ region: string; className?: string }> = ({ region, className }) => {
  if (region === 'us') return <UsFlagSvg className={className || 'w-4 h-3'} />;
  if (region === 'uk') return <UkFlagSvg className={className || 'w-4 h-3'} />;
  return <AsianFlagSvg className={className || 'w-3.5 h-3.5'} />;
};
