/** Shared types and interfaces for the application. */

export interface Citation {
  file: string;
  chunk_id?: string;
  page?: number;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
}

export interface QueryRequest {
  question: string;
}

export interface HealthResponse {
  status: string;
  store_name?: string;
  file_count?: number;
}

export interface QueryState {
  data: QueryResponse | null;
  loading: boolean;
  error: string | null;
}

export interface UseQueryReturn extends QueryState {
  execute: (question: string) => Promise<void>;
  reset: () => void;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  message: string;
  file_size_mb?: number | null;
}
