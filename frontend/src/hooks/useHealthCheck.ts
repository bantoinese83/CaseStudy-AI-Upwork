/** Custom hook for health check monitoring. */

import { useCallback, useEffect, useState } from 'react';
import { checkHealth } from '../services/api.service';
import { getErrorMessage } from '../utils/errors';
import type { HealthResponse } from '../types';

interface UseHealthCheckReturn {
  health: HealthResponse | null;
  isHealthy: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for checking API health status.
 */
export function useHealthCheck(autoCheck = false): UseHealthCheckReturn {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await checkHealth();
      setHealth(result);
    } catch (err) {
      setError(getErrorMessage(err));
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoCheck) {
      void refetch();
    }
  }, [autoCheck, refetch]);

  const isHealthy = health?.status === 'healthy';

  return {
    health,
    isHealthy,
    loading,
    error,
    refetch,
  };
}
