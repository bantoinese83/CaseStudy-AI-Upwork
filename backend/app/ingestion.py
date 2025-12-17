#!/usr/bin/env python3
"""CLI script for ingesting case study documents into Gemini File Search."""
import argparse
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai

# Constants
MB_TO_BYTES = 1024 * 1024
MAX_FILE_SIZE_MB = 100
POLL_INTERVAL_SECONDS = 5
SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}
DEFAULT_STORE_NAME = "case-study-store"
CHUNK_SIZE_TOKENS = 300
CHUNK_OVERLAP_TOKENS = 30

# Load environment variables
load_dotenv()


def get_or_create_store(
    client: genai.Client, display_name: str = DEFAULT_STORE_NAME
) -> str:
    """
    Find existing store or create new one by display_name.

    Args:
        client: Gemini client instance
        display_name: Display name for the store

    Returns:
        Store name (full resource name)
    """
    try:
        stores = list(client.file_search_stores.list())
        # Use next() with generator for finding first match (Pythonic)
        matching_store = next(
            (store for store in stores if store.display_name == display_name), None
        )
        if matching_store:
            print(f"✓ Using existing store: {matching_store.name}")
            return matching_store.name
    except Exception as e:
        print(f"Note: Could not list existing stores: {e}")

    # Create new store if not found
    try:
        store = client.file_search_stores.create(config={"display_name": display_name})
        print(f"✓ Created new store: {store.name}")
        return store.name
    except Exception as e:
        raise RuntimeError(f"Failed to create store: {e}") from e


def ingest_file(client: genai.Client, store_name: str, file_path: Path) -> bool:
    """
    Upload single file with sales-optimized chunking.

    Args:
        client: Gemini client instance
        store_name: Name of the File Search store
        file_path: Path to the file to upload

    Returns:
        True if successful, False otherwise
    """
    # Check file size (100MB limit per Gemini File Search)
    file_size_mb = file_path.stat().st_size / MB_TO_BYTES
    if file_size_mb > MAX_FILE_SIZE_MB:
        print(
            f"✗ Skipped: {file_path.name} "
            f"(exceeds {MAX_FILE_SIZE_MB}MB limit: {file_size_mb:.1f}MB)"
        )
        return False

    try:
        print(
            f"Uploading: {file_path.name} ({file_size_mb:.1f}MB)...",
            end=" ",
            flush=True,
        )

        # Upload file - API auto-detects MIME type from file extension
        op = client.file_search_stores.upload_to_file_search_store(
            file_search_store_name=store_name,
            file=str(file_path),
            config={
                "display_name": file_path.name,
                "chunking_config": {
                    "white_space_config": {
                        "max_tokens_per_chunk": CHUNK_SIZE_TOKENS,
                        "max_overlap_tokens": CHUNK_OVERLAP_TOKENS,
                    }
                },
            },
        )

        # Poll for completion (aligned with official docs: 5 second intervals)
        while not op.done:
            time.sleep(POLL_INTERVAL_SECONDS)
            op = client.operations.get(op)

        if hasattr(op, "error") and op.error:
            print(f"✗ Error: {op.error}")
            return False

        print("✓ Complete")
        return True

    except Exception as e:
        print(f"✗ Failed: {e}")
        return False


def main(folder_path: str, store_display_name: str = DEFAULT_STORE_NAME) -> None:
    """
    Main ingestion function.

    Args:
        folder_path: Path to folder containing case study documents
        store_display_name: Display name for the File Search store
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable must be set")

    client = genai.Client(api_key=api_key)
    store_name = get_or_create_store(client, store_display_name)
    folder = Path(folder_path)

    if not folder.exists():
        raise ValueError(f"Folder does not exist: {folder_path}")

    print(f"\nScanning folder: {folder_path}")
    print(f"Supported formats: {', '.join(sorted(SUPPORTED_EXTENSIONS))}")
    print("Note: File Search supports many more formats (see Gemini API docs)")
    print(f"File size limit: {MAX_FILE_SIZE_MB}MB per file\n")

    # Use list comprehension to filter files (Pythonic)
    all_files = list(folder.rglob("*"))
    supported_files = [
        f
        for f in all_files
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]
    skipped = sum(1 for f in all_files if f.is_file() and f not in supported_files)

    # Process files (use loop for side effects, but track results efficiently)
    count = 0
    errors = 0
    for file_path in supported_files:
        if ingest_file(client, store_name, file_path):
            count += 1
        else:
            errors += 1

    # Summary output
    separator = "=" * 50
    print(f"\n{separator}")
    print("🎉 Ingestion complete!")
    print(f"   ✓ Ingested: {count} files")
    if skipped > 0:
        print(f"   ⊘ Skipped: {skipped} unsupported files")
    if errors > 0:
        print(f"   ✗ Errors: {errors} files failed")
    print(f"   Store: {store_name}")
    print("   Ready for queries. Run: docker compose up")
    print(f"{separator}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Ingest case study documents into Gemini File Search"
    )
    parser.add_argument(
        "--folder",
        required=True,
        help="Path to folder containing case study documents"
    )
    parser.add_argument(
        "--store-name",
        default=DEFAULT_STORE_NAME,
        help=f"Display name for the File Search store (default: {DEFAULT_STORE_NAME})",
    )
    args = parser.parse_args()
    
    main(args.folder, args.store_name)

