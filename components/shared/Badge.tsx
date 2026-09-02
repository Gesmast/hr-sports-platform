import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'surface' | 'dark' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'outline',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    outline: 'border-border text-ink bg-transparent',
    surface: 'border-border bg-surface text-ink',
    dark: 'border-zinc-700 bg-ink text-white',
    success: 'border-emerald-800 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-800 bg-amber-50 text-amber-900',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider',
    md: 'text-xs px-2.5 py-1 font-mono uppercase tracking-wider',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border-hairline rounded-sm',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
