/** Error alert component. */

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
}

export function ErrorAlert({ message, onDismiss, title = 'Error' }: ErrorAlertProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
      <div className="flex justify-between items-start">
        <div>
          <strong>{title}:</strong> {message}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-700 hover:text-red-900"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
