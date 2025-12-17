"""Citation extraction from Gemini grounding metadata."""
from typing import Any, List

from .models import Citation


def extract_citations(grounding_metadata: Any) -> List[Citation]:
    """
    Extract citations from Gemini's grounding_metadata.

    Args:
        grounding_metadata: The grounding_metadata object from Gemini response

    Returns:
        List of Citation objects
    """
    if not grounding_metadata:
        return []

    # Check for grounding_chunks using getattr (Pythonic)
    grounding_chunks = getattr(grounding_metadata, "grounding_chunks", None)
    if not grounding_chunks:
        return []

    # Use list comprehension for cleaner code
    citations = []
    for chunk in grounding_chunks:
        # Extract file name using getattr with fallback chain (Pythonic)
        file_name = getattr(chunk, "source_file_name", None)
        if not file_name:
            chunk_file = getattr(chunk, "file", None)
            if chunk_file:
                file_name = getattr(chunk_file, "display_name", None) or (
                    chunk_file.name.split("/")[-1] if hasattr(chunk_file, "name") else None
                )
        file_name = file_name or "unknown"

        # Extract chunk ID using getattr
        chunk_id = getattr(chunk, "id", None) or getattr(chunk, "chunk_id", None)
        chunk_id = str(chunk_id) if chunk_id else None

        # Extract page number
        page = getattr(chunk, "page", None)

        citations.append(Citation(file=file_name, chunk_id=chunk_id, page=page))

    return citations

