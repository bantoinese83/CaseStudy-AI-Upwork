/** Reusable Button component. */

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantClasses = {
  primary:
    'bg-void-surface border border-ice/30 text-ice hover:border-ice hover:shadow-[0_0_12px_rgba(165,243,252,0.2)] font-mono',
  secondary:
    'bg-void-surface-light border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 font-mono',
  success:
    'bg-void-surface border border-ice/30 text-ice hover:border-ice hover:shadow-[0_0_12px_rgba(165,243,252,0.2)] font-mono',
  danger:
    'bg-void-surface border border-red-500/30 text-red-400 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)] font-mono',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'rounded-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-ice/50 uppercase tracking-wider';
    const variantClass = variantClasses[variant];
    const sizeClass = sizeClasses[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim()}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-pulse">[</span>
            <span className="font-mono">LOADING</span>
            <span className="animate-pulse">]</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
