/** Query form component - handles user input and submission. */

import { FormEvent, useState } from 'react';
import { Input, Button } from './ui';
import { QUERY_EXAMPLES } from '../constants';

interface QueryFormProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

export function QueryForm({ onSubmit, isLoading = false }: QueryFormProps) {
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError('Please enter a question');
      return;
    }

    if (trimmedQuestion.length > 1000) {
      setError('Question is too long (max 1000 characters)');
      return;
    }

    onSubmit(trimmedQuestion);
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setError(null);
            }}
            placeholder="e.g., 'fintech SaaS with Stripe integration' or 'multi-tenant healthcare platform'"
            disabled={isLoading}
            error={error ?? undefined}
            aria-label="Question input"
          />
          <Button type="submit" isLoading={isLoading} disabled={!question.trim()}>
            Search
          </Button>
        </div>
      </form>

      {!isLoading && (
        <div className="text-xs text-zinc-500 font-mono">
          <p className="mb-2 text-zinc-600">[ EXAMPLES ]</p>
          <div className="flex flex-wrap gap-2">
            {QUERY_EXAMPLES.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1.5 text-xs bg-void-surface border border-zinc-800 text-zinc-400 hover:border-ice/30 hover:text-ice rounded-sm transition-all duration-200 font-mono"
              >
                {String(index + 1).padStart(2, '0')} {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
