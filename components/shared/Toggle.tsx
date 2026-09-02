'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToggleOption {
  id: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({
  options,
  activeId,
  onChange,
  className,
  size = 'md',
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-surface border-hairline rounded-base gap-1 select-none',
        className
      )}
    >
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              'relative px-3 py-1.5 text-xs font-mono font-medium uppercase tracking-wider transition-colors rounded-sm z-10',
              size === 'sm' && 'px-2.5 py-1 text-[11px]',
              isActive ? 'text-white font-bold' : 'text-muted hover:text-ink'
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`toggle-pill-${options.map(o => o.id).join('-')}`}
                className="absolute inset-0 bg-ink rounded-sm -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default Toggle;
