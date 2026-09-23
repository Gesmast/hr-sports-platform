import React from 'react';
import { cn } from '@/lib/utils';

interface BorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'surface' | 'dark' | 'outline';
  hoverEffect?: boolean;
  className?: string;
}

export const BorderCard: React.FC<BorderCardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-border text-ink',
    surface: 'bg-surface border-border text-white',
    dark: 'bg-ink border-zinc-700 text-white',
    outline: 'bg-transparent border-border text-ink',
  };

  return (
    <div
      className={cn(
        'border-hairline rounded-base p-6 sm:p-8 transition-all duration-200',
        variantStyles[variant],
        hoverEffect && 'hover:border-ink hover:translate-y-[-2px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BorderCard;
