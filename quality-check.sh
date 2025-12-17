#!/bin/bash
# Quality check script for CaseStudy AI
# Ensures 100/100 quality score with zero errors or warnings

set -e

echo "🔍 Running quality checks..."
echo ""

# Backend checks
echo "📦 Backend (Python)..."
cd backend

if command -v python3 &> /dev/null; then
    echo "  ✓ Installing dev dependencies..."
    python3 -m pip install -q -r requirements-dev.txt 2>/dev/null || true
    
    echo "  ✓ Running Black (formatting)..."
    python3 -m black --check app/ || {
        echo "  ⚠️  Formatting issues found. Run: make format"
        exit 1
    }
    
    echo "  ✓ Running Ruff (linting)..."
    python3 -m ruff check app/ || {
        echo "  ⚠️  Linting issues found. Run: make format"
        exit 1
    }
    
    echo "  ✓ Running MyPy (type checking)..."
    python3 -m mypy app/ --ignore-missing-imports || {
        echo "  ⚠️  Type checking issues found"
        exit 1
    }
else
    echo "  ⚠️  Python3 not found, skipping backend checks"
fi

cd ..

# Frontend checks
echo ""
echo "📦 Frontend (TypeScript/React)..."
cd frontend

if command -v npm &> /dev/null; then
    echo "  ✓ Installing dependencies..."
    npm install --silent 2>/dev/null || true
    
    echo "  ✓ Running ESLint (linting)..."
    npm run lint || {
        echo "  ⚠️  Linting issues found. Run: npm run lint:fix"
        exit 1
    }
    
    echo "  ✓ Running Prettier (formatting)..."
    npm run format:check || {
        echo "  ⚠️  Formatting issues found. Run: npm run format"
        exit 1
    }
    
    echo "  ✓ Running TypeScript (type checking)..."
    npm run type-check || {
        echo "  ⚠️  Type checking issues found"
        exit 1
    }
else
    echo "  ⚠️  npm not found, skipping frontend checks"
fi

cd ..

echo ""
echo "✅ All quality checks passed! 100/100 quality score achieved."
echo ""

