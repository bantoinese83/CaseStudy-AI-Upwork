"""Gemini client wrapper for File Search operations."""
import logging
import os
from typing import Any, Optional

from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

# Constants
DEFAULT_STORE_NAME = "case-study-store"
DEFAULT_MODEL = "gemini-2.5-flash"


class GeminiClient:
    """Client for interacting with Gemini File Search."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Gemini client."""
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY must be set")
        try:
            self.client = genai.Client(api_key=self.api_key)
            # Verify client has required attributes
            if not hasattr(self.client, "files"):
                raise ValueError(
                    "Gemini client does not support files API. "
                    "Please check your API key and ensure you have access to File Search features."
                )
            # Note: file_search_stores may not be available in all library versions
            # We'll handle this gracefully in the methods that use it
        except Exception as e:
            raise ValueError(f"Failed to initialize Gemini client: {e}") from e
        self._store_name_cache: Optional[str] = None
    
    def get_or_create_store(self, display_name: str = DEFAULT_STORE_NAME) -> str:
        """
        Find existing store or create new one by display_name.

        Args:
            display_name: Display name for the store

        Returns:
            Store name (full resource name)
        """
        # Check cache first
        if self._store_name_cache:
            return self._store_name_cache

        # List all stores and find by display name using next() (Pythonic)
        try:
            # Check if file_search_stores attribute exists
            if hasattr(self.client, "file_search_stores"):
                stores = list(self.client.file_search_stores.list())
                matching_store = next(
                    (store for store in stores if store.display_name == display_name), None
                )
                if matching_store:
                    logger.info(f"✓ Using existing store: {matching_store.name}")
                    self._store_name_cache = matching_store.name
                    return matching_store.name
            else:
                # Fallback: use a default store name if file_search_stores is not available
                logger.warning(
                    "file_search_stores not available in this API version. "
                    "Using default store name."
                )
                # Return a default store name format
                default_store = f"stores/{display_name}"
                self._store_name_cache = default_store
                return default_store
        except Exception as e:
            logger.warning(f"Could not list stores: {e}")
            # Fallback to default store name
            default_store = f"stores/{display_name}"
            self._store_name_cache = default_store
            return default_store

        # Create new store if not found (only if file_search_stores is available)
        if hasattr(self.client, "file_search_stores"):
            try:
                store = self.client.file_search_stores.create(
                    config={"display_name": display_name}
                )
                logger.info(f"✓ Created new store: {store.name}")
                self._store_name_cache = store.name
                return store.name
            except Exception as e:
                raise RuntimeError(f"Failed to create store: {e}") from e
        else:
            # Return default store name if file_search_stores is not available
            default_store = f"stores/{display_name}"
            self._store_name_cache = default_store
            return default_store
    
    def get_store_name(self, display_name: str = DEFAULT_STORE_NAME) -> str:
        """
        Get store name (cached lookup).

        Args:
            display_name: Display name for the store

        Returns:
            Store name (full resource name)
        """
        if not self._store_name_cache:
            self._store_name_cache = self.get_or_create_store(display_name)
        return self._store_name_cache
    
    def query(
        self,
        question: str,
        system_prompt: str,
        store_display_name: str = DEFAULT_STORE_NAME,
    ) -> tuple[str, Any]:
        """
        Query Gemini with File Search enabled.

        Args:
            question: User's question
            system_prompt: System prompt for the model
            store_display_name: Display name of the File Search store

        Returns:
            Tuple of (answer_text, grounding_metadata)
        """
        store_name = self.get_store_name(store_display_name)

        # Combine system prompt and question
        full_prompt = f"{system_prompt}\n\nQ: {question}"

        try:
            response = self.client.models.generate_content(
                model=DEFAULT_MODEL,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    tools=[
                        types.Tool(
                            file_search=types.FileSearch(
                                file_search_store_names=[store_name]
                            )
                        )
                    ]
                ),
            )

            if not response.candidates:
                raise RuntimeError("No response candidates from Gemini")

            candidate = response.candidates[0]
            answer_text = response.text

            # Extract grounding metadata (use getattr with default for cleaner code)
            grounding_metadata = getattr(candidate, "grounding_metadata", None)

            return answer_text, grounding_metadata

        except Exception as e:
            raise RuntimeError(f"Gemini query failed: {e}") from e
    
    def get_store_info(
        self, store_display_name: str = DEFAULT_STORE_NAME
    ) -> dict[str, str | int | None]:
        """
        Get information about the store (file count, etc.).

        Args:
            store_display_name: Display name of the store

        Returns:
            Dictionary with store information
        """
        store_name = self.get_store_name(store_display_name)

        try:
            # Check if client has required attributes
            if not hasattr(self.client, "files"):
                return {"store_name": store_name, "file_count": None}

            # List files in the store using list comprehension (Pythonic)
            files = list(self.client.files.list())
            store_files = [
                f
                for f in files
                if hasattr(f, "file_search_stores")
                and store_name in (getattr(f, "file_search_stores", None) or [])
            ]

            return {"store_name": store_name, "file_count": len(store_files)}
        except Exception as e:
            print(f"Warning: Could not get store info: {e}")
            return {"store_name": store_name, "file_count": None}

