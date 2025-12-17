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
    <div className="space-y-4 p-6 border border-zinc-800 rounded-sm bg-void-surface">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-zinc-600">[ OUTPUT ]</span>
          <h2 className="text-lg font-semibold text-white tracking-tight">Sales Pitch</h2>
        </div>
        {isSupported && (
          <Button ref={buttonRef} onClick={handleCopy} variant="primary" size="sm">
            COPY
          </Button>
        )}
      </div>

      <div
        className="prose prose-invert max-w-none text-zinc-300 prose-headings:text-white prose-headings:font-sans prose-p:text-zinc-300 prose-strong:text-ice prose-a:text-ice prose-ul:text-zinc-300 prose-li:text-zinc-300"
        dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(answer) }}
      />

      {citations.length > 0 && (
        <details className="text-xs text-zinc-500 border-t border-zinc-800 pt-4 mt-4 font-mono">
          <summary className="cursor-pointer font-medium hover:text-ice transition-colors">
            [ SOURCES: {String(citations.length).padStart(2, '0')} ]
          </summary>
          <ul className="mt-3 space-y-2 list-none">
            {citations.map((citation, index) => (
              <li key={index} className="text-zinc-400 flex items-start gap-2">
                <span className="text-ice font-mono text-xs mt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-zinc-400">{formatCitation(citation)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
