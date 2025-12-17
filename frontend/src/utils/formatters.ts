/** Formatting utilities. */

/**
 * Formats markdown-style text to HTML.
 * Converts **bold** to <strong> and newlines to <br />.
 */
export function formatMarkdownToHtml(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
}

/**
 * Formats citation for display.
 */
export function formatCitation(citation: {
  file: string;
  chunk_id?: string;
  page?: number;
}): string {
  const parts = [citation.file];
  if (citation.chunk_id) {
    parts.push(`(chunk ${citation.chunk_id})`);
  }
  if (citation.page) {
    parts.push(`- page ${citation.page}`);
  }
  return parts.join(' ');
}
