/** Answer display component with citations. */

import { useClipboardWithFeedback } from '../hooks';
import { formatMarkdownToHtml, formatCitation } from '../utils/formatters';
import { Button } from './ui';
import type { Citation } from '../types';

interface AnswerProps {
  answer: string;
  citations: Citation[];
}

export function Answer({ answer, citations }: AnswerProps) {
  const { copyWithFeedback, buttonRef, isSupported } = useClipboardWithFeedback();

  const handleCopy = async () => {
    if (!isSupported) {
      console.warn('Clipboard API not supported');
      return;
    }

    const success = await copyWithFeedback(answer);
    if (!success) {
      // Could show a toast notification here
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sales Pitch</h2>
        {isSupported && (
          <Button ref={buttonRef} onClick={handleCopy} variant="primary" size="md">
            Copy to Clipboard
          </Button>
        )}
      </div>

      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(answer) }}
      />

      {citations.length > 0 && (
        <details className="text-sm text-gray-500 border-t pt-4 mt-4">
          <summary className="cursor-pointer font-medium hover:text-gray-700">
            Sources ({citations.length})
          </summary>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            {citations.map((citation, index) => (
              <li key={index} className="text-gray-600">
                📄 {formatCitation(citation)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
