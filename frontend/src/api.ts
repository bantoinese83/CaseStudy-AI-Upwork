/**
 * @deprecated This file is deprecated. Use services/api.service.ts instead.
 * This file is kept for backward compatibility but will be removed in a future version.
 */

// Re-export types for backward compatibility
export type { Citation, QueryResponse, QueryRequest, HealthResponse } from './types';

// Re-export services for backward compatibility
export { queryCaseStudies, checkHealth } from './services/api.service';
