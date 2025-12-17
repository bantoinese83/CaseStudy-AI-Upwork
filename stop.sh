#!/bin/bash
# Stop script for CaseStudy AI

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Stopping CaseStudy AI services...${NC}"

cd "$(dirname "${BASH_SOURCE[0]}")"

docker compose down

echo -e "${GREEN}Services stopped successfully${NC}"

