import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, type = 'text', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (() => {
          const isRequired = props.required || label.trim().endsWith('*');
          const cleanLabel = label.replace(/\s*\*+$/, '');
          return (
            <label
              htmlFor={inputId}
              className="block text-xs font-mono font-semibold text-ink mb-1.5"
            >
              {cleanLabel}
              {isRequired && <span className="text-red-600 font-bold ml-1">*</span>}
            </label>
          );
        })()}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'w-full bg-white text-ink border-hairline rounded-full px-4 py-2.5 text-sm transition-colors placeholder:text-zinc-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink disabled:bg-zinc-100 disabled:cursor-not-allowed',
            error && 'border-red-600 focus:border-red-600 focus:ring-red-600',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
