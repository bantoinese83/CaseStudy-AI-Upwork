#!/bin/bash
# Development mode script - runs services with live reload and logs

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}Starting CaseStudy AI in development mode...${NC}"
echo ""

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Starting in Docker mode instead...${NC}"
    ./start.sh
    exit 0
fi

# Start services in foreground with logs
echo -e "${GREEN}Starting services with live logs...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

docker compose up --build

