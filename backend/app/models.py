"""Pydantic models for API requests and responses."""
from pydantic import BaseModel
from typing import List, Optional


class QueryRequest(BaseModel):
    """Request model for querying case studies."""
    question: str


class Citation(BaseModel):
    """Citation model for source references."""
    file: str
    chunk_id: Optional[str] = None
    page: Optional[int] = None


class QueryResponse(BaseModel):
    """Response model for query results."""
    answer: str
    citations: List[Citation]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    store_name: Optional[str] = None
    file_count: Optional[int] = None


class UploadResponse(BaseModel):
    """File upload response."""
    success: bool
    filename: str
    message: str
    file_size_mb: Optional[float] = None


class UploadProgressResponse(BaseModel):
    """Upload progress response."""
    filename: str
    status: str  # "uploading", "processing", "complete", "error"
    progress: Optional[float] = None
    message: Optional[str] = None

