/** Main chat component - orchestrates query form and answer display. */

import { useState } from 'react';
import { useQuery } from '../hooks';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { QueryForm } from './QueryForm';
import { Answer } from './Answer';
import { FileUpload } from './FileUpload';
import { Button, LoadingSpinner, ErrorAlert, EmptyState } from './ui';
import { QUERY_EXAMPLES } from '../constants';

export function Chat() {
  const { data, loading, error, execute, reset } = useQuery();
  const { health, refetch: refetchHealth } = useHealthCheck(true);
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = async (question: string) => {
    await execute(question);
  };

  const handleErrorDismiss = () => {
    reset();
  };

  const handleUploadSuccess = async () => {
    // Refresh health check to update file count
    await refetchHealth();
    // Optionally hide upload after success
    setTimeout(() => setShowUpload(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img
            src="/logo.svg"
            alt="CaseStudy AI Logo"
            className="w-16 h-16 drop-shadow-[0_0_8px_rgba(165,243,252,0.3)]"
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">
            CaseStudy <span className="text-ice">AI</span>
          </h1>
        </div>
        <p className="text-zinc-400 font-mono text-sm mb-3">
          {'>'} Query case studies. Extract insights. Generate proposals.
        </p>
        {health && (
          <p className="text-xs font-mono text-zinc-600">
            [ INDEXED: {health.file_count ?? 0} FILES ]
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-center mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowUpload(!showUpload)}
          disabled={loading}
        >
          {showUpload ? '[ HIDE UPLOAD ]' : '[ UPLOAD DOCUMENTS ]'}
        </Button>
      </div>

      {showUpload && (
        <div className="mb-6">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      <QueryForm onSubmit={handleSubmit} isLoading={loading} />

      {loading && <LoadingSpinner message="Querying case studies..." />}

      {error && <ErrorAlert message={error} onDismiss={handleErrorDismiss} />}

      {data && <Answer answer={data.answer} citations={data.citations} />}

      {!loading && !data && !error && (
        <EmptyState
          title="Enter a question above to search case studies"
          examples={QUERY_EXAMPLES}
        />
      )}
    </div>
  );
}
