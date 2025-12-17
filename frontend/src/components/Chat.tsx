/** Main chat component - orchestrates query form and answer display. */

import { useQuery } from '../hooks';
import { QueryForm } from './QueryForm';
import { Answer } from './Answer';
import { LoadingSpinner, ErrorAlert, EmptyState } from './ui';
import { QUERY_EXAMPLES } from '../constants';

export function Chat() {
  const { data, loading, error, execute, reset } = useQuery();

  const handleSubmit = async (question: string) => {
    await execute(question);
  };

  const handleErrorDismiss = () => {
    reset();
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
        <p className="text-zinc-400 font-mono text-sm">
          {'>'} Query case studies. Extract insights. Generate proposals.
        </p>
      </div>

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
