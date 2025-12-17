#!/bin/bash
# Helper script to run ingestion
# Usage: ./ingest.sh [folder_path]

FOLDER=${1:-./case-studies}

echo "Starting ingestion from: $FOLDER"
echo "Make sure GEMINI_API_KEY is set in .env file"
echo ""

docker compose run --rm backend python /app/ingestion.py --folder "$FOLDER"

