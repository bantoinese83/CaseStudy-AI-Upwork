/** Loading spinner component. */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div
          className={`inline-block animate-spin rounded-full border-ice/30 border-t-ice ${sizeClasses[size]}`}
          role="status"
          aria-label="Loading"
        />
        <div
          className={`absolute inset-0 inline-block animate-spin rounded-full border-ice/10 border-r-ice/50 ${sizeClasses[size]}`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {message && (
        <p className="mt-4 text-xs font-mono text-zinc-500" aria-live="polite">
          {'>'} {message}
        </p>
      )}
    </div>
  );
}
