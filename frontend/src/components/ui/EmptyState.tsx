/** Empty state component. */

interface EmptyStateProps {
  title: string;
  description?: string;
  examples?: readonly string[];
}

export function EmptyState({ title, description, examples }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-zinc-500">
      <p className="text-sm font-mono text-zinc-600 mb-2">[ {title} ]</p>
      {description && (
        <p className="text-xs font-mono text-zinc-500 mt-2">
          {'>'} {description}
        </p>
      )}
      {examples && examples.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-mono text-zinc-600 mb-3">[ EXAMPLES ]</p>
          <ul className="text-xs font-mono text-zinc-500 space-y-1.5">
            {examples.map((example, index) => (
              <li key={index} className="flex items-center justify-center gap-2">
                <span className="text-ice">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-zinc-500">
                  {'>'} {example}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
