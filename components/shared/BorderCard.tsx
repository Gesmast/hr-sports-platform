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
    default: 'bg-white border-gray-200 text-ink',
    surface: 'bg-white border-gray-200 text-ink',
    dark: 'bg-white border-gray-200 text-ink',
    outline: 'bg-transparent border-gray-200 text-ink',
  };

  return (
    <div
      className={cn(
        'border rounded-base p-6 sm:p-8 transition-all duration-200',
        variantStyles[variant],
        hoverEffect && 'hover:border-black hover:translate-y-[-2px] hover:shadow-xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BorderCard;
