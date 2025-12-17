/** Empty state component. */

interface EmptyStateProps {
  title: string;
  description?: string;
  examples?: readonly string[];
}

export function EmptyState({ title, description, examples }: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm mt-2">{description}</p>}
      {examples && examples.length > 0 && (
        <>
          <p className="text-sm mt-4 font-medium">Examples:</p>
          <ul className="text-sm mt-2 space-y-1">
            {examples.map((example, index) => (
              <li key={index}>• &quot;{example}&quot;</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
