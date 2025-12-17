#!/bin/bash
# Run frontend in development mode locally

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/frontend"

echo -e "${BLUE}Starting frontend in development mode...${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Check if port 3000 is in use (Docker)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}Port 3000 is in use by Docker container${NC}"
    echo -e "${YELLOW}Vite will use the next available port (likely 5173)${NC}"
    echo ""
fi

echo -e "${GREEN}Starting Vite dev server...${NC}"
echo -e "${BLUE}Frontend will be available at the URL shown below${NC}"
echo ""

npm run dev

