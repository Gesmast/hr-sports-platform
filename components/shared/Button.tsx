import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-burgundy text-white border-burgundy hover:bg-burgundy-hover hover:border-burgundy-hover active:bg-burgundy-active active:translate-y-[1px]',
      secondary: 'bg-surface text-white border-border hover:bg-zinc-900 active:translate-y-[1px]',
      outline: 'bg-transparent text-ink border-border hover:bg-zinc-100 active:translate-y-[1px]',
      ghost: 'bg-transparent text-ink border-transparent hover:bg-zinc-100 active:translate-y-[1px]',
      inverted: 'bg-surface text-white border-surface hover:bg-zinc-900 active:translate-y-[1px]',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 font-medium tracking-wide uppercase',
      md: 'text-xs sm:text-sm px-5 py-2.5 font-semibold tracking-wider uppercase',
      lg: 'text-sm sm:text-base px-7 py-3.5 font-bold tracking-wider uppercase',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap shrink-0 border-hairline rounded-full transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2.5 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
