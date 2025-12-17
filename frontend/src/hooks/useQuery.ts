/** Custom hook for managing query state and execution. */

import { useCallback, useState } from 'react';
import { queryCaseStudies } from '../services/api.service';
import { getErrorMessage } from '../utils/errors';
import { validateQuestion } from '../utils/validation';
import type { QueryResponse, UseQueryReturn } from '../types';

/**
 * Hook for managing case study queries.
 * Handles loading, error, and data states.
 */
export function useQuery(): UseQueryReturn {
  const [data, setData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (question: string): Promise<void> => {
    // Validate question
    const validation = validateQuestion(question);
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid question');
      setData(null);
      return;
    }

    // Reset state
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await queryCaseStudies(question);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
