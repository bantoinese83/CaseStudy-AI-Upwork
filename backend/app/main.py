"""FastAPI application for CaseStudy AI."""
import logging
import os
import sys
import tempfile
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .citations import extract_citations
from .gemini_client import DEFAULT_STORE_NAME, GeminiClient
from .models import HealthResponse, QueryRequest, QueryResponse, UploadResponse
from .prompts import SALES_SYSTEM_PROMPT

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CaseStudy AI API",
    version="1.0.0",
    description="API for querying case studies using Gemini File Search",
)

# CORS middleware - configure based on environment
cors_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if os.getenv("ENV") != "development" else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"],
)

# Initialize Gemini client
gemini_client: GeminiClient | None = None
try:
    gemini_client = GeminiClient()
    logger.info("Gemini client initialized successfully")
except ValueError as e:
    logger.warning(f"Gemini client initialization failed: {e}")
    logger.warning("Some endpoints may not work without GEMINI_API_KEY")
except Exception as e:
    logger.error(f"Unexpected error initializing Gemini client: {e}")
    logger.warning("Continuing without Gemini client - health check will fail")


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with store information."""
    if gemini_client is None:
        return HealthResponse(
            status="degraded",
            store_name=None,
            file_count=None,
        )

    try:
        store_display_name = os.getenv("FILE_SEARCH_STORE_NAME", DEFAULT_STORE_NAME)
        store_info = gemini_client.get_store_info(store_display_name)

        logger.info(
            f"Health check: store={store_info.get('store_name')}, "
            f"files={store_info.get('file_count')}"
        )

        return HealthResponse(
            status="healthy",
            store_name=store_info.get("store_name"),
            file_count=store_info.get("file_count"),
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return HealthResponse(
            status=f"error: {str(e)}",
            store_name=None,
            file_count=None,
        )


@app.post("/api/query", response_model=QueryResponse)
async def query_case_studies(req: QueryRequest):
    """
    Query case studies using natural language.

    Args:
        req: Query request with question

    Returns:
        Query response with answer and citations
    """
    if gemini_client is None:
        raise HTTPException(
            status_code=503,
            detail="Service unavailable: Gemini API key not configured",
        )

    # Validate question
    if not req.question or not req.question.strip():
        logger.warning("Empty question received")
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if len(req.question) > 1000:
        logger.warning(f"Question too long: {len(req.question)} characters")
        raise HTTPException(
            status_code=400, detail="Question is too long (max 1000 characters)"
        )

    try:
        logger.info(f"Processing query: {req.question[:50]}...")
        store_display_name = os.getenv("FILE_SEARCH_STORE_NAME", DEFAULT_STORE_NAME)

        # Query Gemini with File Search
        answer_text, grounding_metadata = gemini_client.query(
            question=req.question,
            system_prompt=SALES_SYSTEM_PROMPT,
            store_display_name=store_display_name,
        )

        # Extract citations
        citations = extract_citations(grounding_metadata)

        logger.info(f"Query successful: {len(citations)} citations found")
        return QueryResponse(answer=answer_text, citations=citations)

    except ValueError as e:
        logger.error(f"Configuration error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Configuration error: {str(e)}"
        ) from e
    except RuntimeError as e:
        logger.error(f"Query failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}") from e
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Unexpected error: {str(e)}"
        ) from e


@app.post("/api/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a case study document to the knowledge base.

    Args:
        file: The file to upload (PDF, DOCX, TXT, MD)

    Returns:
        Upload response with success status and message
    """
    if gemini_client is None:
        raise HTTPException(
            status_code=503,
            detail="Service unavailable: Gemini API key not configured",
        )

    # Validate file type
    SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}
    file_ext = Path(file.filename).suffix.lower() if file.filename else ""
    if file_ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file_ext}. Supported: {', '.join(SUPPORTED_EXTENSIONS)}",
        )

    # Check file size (100MB limit)
    MAX_FILE_SIZE_MB = 100
    MB_TO_BYTES = 1024 * 1024
    content = await file.read()
    file_size_mb = len(content) / MB_TO_BYTES

    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit ({file_size_mb:.1f}MB)",
        )

    # Save to temporary file and case-studies folder
    case_studies_dir = Path("/app/case-studies")
    case_studies_dir.mkdir(parents=True, exist_ok=True)
    
    # Save to case-studies folder (local backup)
    original_filename = file.filename or f"upload{file_ext}"
    case_study_path = case_studies_dir / original_filename
    
    # Handle filename conflicts by adding a number suffix
    counter = 1
    while case_study_path.exists():
        name_part = case_study_path.stem
        case_study_path = case_studies_dir / f"{name_part}_{counter}{file_ext}"
        counter += 1
    
    try:
        # Save to case-studies folder
        case_study_path.write_bytes(content)
        logger.info(f"Saved file to case-studies folder: {case_study_path.name}")
        
        # Also save to temporary file for Gemini upload
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=file_ext, prefix="upload_"
        ) as tmp_file:
            tmp_file.write(content)
            tmp_path = tmp_file.name

        try:
            store_display_name = os.getenv("FILE_SEARCH_STORE_NAME", DEFAULT_STORE_NAME)
            success, message = gemini_client.upload_file(tmp_path, store_display_name)

            if success:
                logger.info(f"File uploaded successfully: {file.filename}")
                return UploadResponse(
                    success=True,
                    filename=case_study_path.name,
                    message=message,
                    file_size_mb=round(file_size_mb, 2),
                )
            else:
                logger.error(f"File upload failed: {message}")
                # Remove the saved file if upload failed
                case_study_path.unlink(missing_ok=True)
                raise HTTPException(status_code=500, detail=message)

        finally:
            # Clean up temporary file
            Path(tmp_path).unlink(missing_ok=True)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}") from e


@app.get("/")
async def root() -> dict[str, str | dict[str, str] | bool]:
    """Root endpoint with API information."""
    return {
        "message": "CaseStudy AI API",
        "version": "1.0.0",
        "status": "running",
        "gemini_configured": gemini_client is not None,
        "endpoints": {
            "health": "/health",
            "query": "/api/query",
            "upload": "/api/upload",
            "docs": "/docs",
        },
    }


@app.on_event("startup")
async def startup_event():
    """Log startup information."""
    logger.info("CaseStudy AI API starting up...")
    logger.info(f"Gemini client configured: {gemini_client is not None}")
    logger.info("API is ready to accept requests")


@app.on_event("shutdown")
async def shutdown_event():
    """Log shutdown information."""
    logger.info("CaseStudy AI API shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

