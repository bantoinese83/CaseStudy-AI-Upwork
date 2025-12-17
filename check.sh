#!/bin/bash
# Health check and status script

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}CaseStudy AI - Status Check${NC}"
echo ""

# Check backend
echo -e "${BLUE}Checking backend...${NC}"
if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://localhost:8000/health)
    echo -e "${GREEN}✓ Backend is healthy${NC}"
    echo "  Status: $(echo $HEALTH | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
    echo "  Files: $(echo $HEALTH | grep -o '"file_count":[0-9]*' | cut -d':' -f2 || echo 'N/A')"
else
    echo -e "${RED}✗ Backend is not responding${NC}"
fi

echo ""

# Check frontend
echo -e "${BLUE}Checking frontend...${NC}"
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${RED}✗ Frontend is not responding${NC}"
fi

echo ""

# Check Docker containers
echo -e "${BLUE}Checking Docker containers...${NC}"
if command -v docker &> /dev/null; then
    docker compose ps
else
    echo -e "${YELLOW}Docker not found${NC}"
fi

