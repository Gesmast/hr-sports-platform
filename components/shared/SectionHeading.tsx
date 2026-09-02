import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  inverted?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  inverted = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12',
        align === 'center' ? 'mx-auto text-center' : '',
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-3 flex items-center gap-2',
            align === 'center' ? 'justify-center' : 'justify-start',
            inverted ? 'text-surface' : 'text-muted'
          )}
        >
          <span className={cn('inline-block w-2 h-2 rounded-full', inverted ? 'bg-surface' : 'bg-ink')} />
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-balance',
          inverted ? 'text-white' : 'text-ink'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-base sm:text-lg leading-relaxed text-pretty',
            inverted ? 'text-zinc-400' : 'text-muted'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
