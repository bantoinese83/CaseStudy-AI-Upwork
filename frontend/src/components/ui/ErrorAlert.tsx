/** Error alert component. */

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
}

export function ErrorAlert({ message, onDismiss, title = 'ERROR' }: ErrorAlertProps) {
  return (
    <div
      className="p-4 bg-void-surface border border-red-500/30 rounded-sm text-red-400 font-mono"
      role="alert"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-2">
          <span className="text-xs text-red-500/70 mt-0.5">[</span>
          <div>
            <div className="text-xs text-red-500/70 mb-1">{title}</div>
            <div className="text-sm text-red-400">
              {'>'} {message}
            </div>
          </div>
          <span className="text-xs text-red-500/70 mt-0.5">]</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 transition-colors text-lg leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
