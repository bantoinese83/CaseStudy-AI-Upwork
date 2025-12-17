/** Application constants. */

// Vite environment variables are typed via vite/client
export const API_BASE_URL =
  (import.meta.env?.VITE_API_URL as string | undefined) || 'http://localhost:8000';

export const API_ENDPOINTS = {
  QUERY: '/api/query',
  HEALTH: '/health',
} as const;

export const QUERY_EXAMPLES = [
  'ecommerce platform with Shopify integration',
  'HIPAA compliant healthcare SaaS',
  'Stripe payment processing implementation',
] as const;

export const COPY_FEEDBACK_DURATION = 2000; // milliseconds

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;
