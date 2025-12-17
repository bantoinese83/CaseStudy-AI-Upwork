/** Reusable Input component. */

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = '', ...props }, ref) => {
    const baseClasses =
      'w-full px-4 py-3 bg-void-surface border border-zinc-800 rounded-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-ice/50 focus:ring-1 focus:ring-ice/30 transition-all duration-200 font-mono text-sm';
    const errorClasses = error
      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input ref={ref} className={`${baseClasses} ${errorClasses} ${className}`} {...props} />
        {error && (
          <p className="mt-1.5 text-xs font-mono text-red-400" role="alert">
            {'>'} {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
