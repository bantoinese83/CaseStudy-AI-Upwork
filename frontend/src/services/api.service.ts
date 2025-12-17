/** API service layer - handles all HTTP communication. */

import { ApiError, getErrorMessage } from '../utils/errors';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';
import type { HealthResponse, QueryRequest, QueryResponse, UploadResponse } from '../types';

/**
 * Base fetch wrapper with error handling and timeout.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout - the server took too long to respond', undefined, error);
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error - please check your connection and ensure the backend is running',
        undefined,
        error
      );
    }
    throw new ApiError(getErrorMessage(error), undefined, error);
  }
}

/**
 * Parses JSON response with error handling.
 */
async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('Invalid JSON response', response.status);
  }
}

/**
 * Handles HTTP errors and throws ApiError.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (typeof errorData === 'object' && errorData !== null && 'detail' in errorData) {
        errorMessage = String(errorData.detail);
      }
    } catch {
      // Use default error message if JSON parsing fails
    }
    throw new ApiError(errorMessage, response.status);
  }
  return parseJsonResponse<T>(response);
}

/**
 * Query case studies with a natural language question.
 */
export async function queryCaseStudies(question: string): Promise<QueryResponse> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.QUERY}`;

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question } satisfies QueryRequest),
  });

  return handleResponse<QueryResponse>(response);
}

/**
 * Check API health status.
 */
export async function checkHealth(): Promise<HealthResponse> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.HEALTH}`;

  const response = await fetchWithTimeout(url, {
    method: 'GET',
  });

  return handleResponse<HealthResponse>(response);
}

/**
 * Upload a file to the knowledge base.
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.UPLOAD}`;

  const formData = new FormData();
  formData.append('file', file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes for large files

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    clearTimeout(timeoutId);
    return handleResponse<UploadResponse>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'Upload timeout - file may be too large or connection is slow',
        undefined,
        error
      );
    }
    throw new ApiError(getErrorMessage(error), undefined, error);
  }
}
