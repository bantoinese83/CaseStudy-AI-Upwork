/** Footer component with discreet attribution. */

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 px-4 bg-transparent pointer-events-none z-10">
      <div className="max-w-4xl mx-auto flex justify-end">
        <div className="pointer-events-auto">
          <a
            href="https://monarch-labs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-zinc-600 hover:text-ice transition-colors duration-200 flex items-center gap-1.5 group"
          >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">
              {'['} BUILT BY
            </span>
            <span className="text-zinc-500 group-hover:text-ice">MONARCH LABS INC.</span>
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">{']'}</span>
            <svg
              className="w-3 h-3 opacity-50 group-hover:opacity-75 group-hover:text-ice transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
