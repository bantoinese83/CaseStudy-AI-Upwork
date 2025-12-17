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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CaseStudy AI</h1>
        <p className="text-gray-600">
          Ask about past projects, features, or outcomes. Get proposal-ready answers with citations.
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
