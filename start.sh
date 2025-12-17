#!/bin/bash
# Unified startup script for CaseStudy AI
# Handles environment validation, dependency checks, and service startup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     CaseStudy AI - Startup Script    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_status "Docker is installed"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_status "Docker Compose is available"

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running. Please start Docker first."
    exit 1
fi
print_status "Docker daemon is running"

# Check .env file
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please edit .env and add your GEMINI_API_KEY"
        print_info "You can edit .env now, or continue and add it later."
        read -p "Press Enter to continue or Ctrl+C to exit and edit .env..."
    else
        print_error ".env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Validate GEMINI_API_KEY
if ! grep -q "GEMINI_API_KEY=.*[^=]$" .env 2>/dev/null || grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env 2>/dev/null; then
    print_warning "GEMINI_API_KEY not set or using placeholder in .env"
    print_info "Some features may not work without a valid API key"
    print_info "You can add it to .env and restart the services"
fi

# Check case-studies directory
if [ ! -d "case-studies" ]; then
    print_warning "case-studies directory not found. Creating..."
    mkdir -p case-studies
    print_info "Place your PDF/DOCX files in the case-studies/ folder"
fi

echo ""
echo -e "${BLUE}Starting services...${NC}"

# Stop any existing containers
print_info "Stopping any existing containers..."
docker compose down 2>/dev/null || true

# Build and start services
print_info "Building and starting services (this may take a few minutes)..."
docker compose up -d --build

# Wait for services to be healthy
echo ""
echo -e "${BLUE}Waiting for services to be ready...${NC}"

MAX_WAIT=60
WAIT_COUNT=0
BACKEND_READY=false
FRONTEND_READY=false

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    # Check backend
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        if [ "$BACKEND_READY" = false ]; then
            print_status "Backend is ready (http://localhost:8000)"
            BACKEND_READY=true
        fi
    fi

    # Check frontend (simple HTTP check)
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        if [ "$FRONTEND_READY" = false ]; then
            print_status "Frontend is ready (http://localhost:3000)"
            FRONTEND_READY=true
        fi
    fi

    if [ "$BACKEND_READY" = true ] && [ "$FRONTEND_READY" = true ]; then
        break
    fi

    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))
    echo -n "."
done

echo ""

if [ "$BACKEND_READY" = true ] && [ "$FRONTEND_READY" = true ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   CaseStudy AI is ready! 🎉            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}Backend API:${NC} http://localhost:8000"
    echo -e "${GREEN}Health Check:${NC} http://localhost:8000/health"
    echo ""
    print_info "To ingest case studies, run: ./ingest.sh"
    print_info "To view logs, run: docker compose logs -f"
    print_info "To stop services, run: docker compose down"
    echo ""
else
    print_warning "Services are starting but may not be fully ready yet"
    print_info "Check status with: docker compose ps"
    print_info "View logs with: docker compose logs"
fi

