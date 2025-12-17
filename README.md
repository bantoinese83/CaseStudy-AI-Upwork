# CaseStudy AI

CaseStudy AI enables sales teams to query hundreds of case study documents via natural language, receiving proposal-ready bullet points with citations. Built on Google Gemini File Search for zero-maintenance RAG (chunking, embeddings, semantic search handled automatically).

## Features

- **Natural Language Queries**: Ask questions like "fintech SaaS with Stripe" and get relevant case studies
- **Proposal-Ready Format**: Answers structured as "Relevant Projects / What We Did / Features / Outcomes"
- **Inline Citations**: See exactly which document each bullet came from (filename + chunk/page)
- **Copy to Clipboard**: One-click copy for pasting into proposals or slide decks
- **Private & Secure**: Uses your Gemini API key, data stays private
- **Zero-Maintenance RAG**: No vector DB setup, chunking, or embedding management needed

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Case Studies  │───▶│ Gemini File      │───▶│ FastAPI Backend  │
│   (PDF/DOCX)    │    │ Search Store     │    │  (Docker)        │
└─────────┬───────┘    │ (Managed RAG)    │    └────────┬─────────┘
          │            └──────────────────┘            │
          │  ./ingest.sh                                 │
          └─────────────────────────────────────────────┘
                                                         │
                                          ┌──────────────▼──────────────┐
                                          │  React SPA (Vite)           │
                                          │  Production: nginx (Docker)  │
                                          │  Dev: Vite (localhost:5173) │
                                          └──────────────────────────────┘
```

**Deployment:**
- **Backend**: FastAPI + Uvicorn (Docker container)
- **Frontend**: Production build served by nginx (Docker container)
- **Development**: Frontend can run locally with Vite for hot reload

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Gemini API key ([Get one here](https://ai.google.dev/))

### Setup (5 minutes)

**Option 1: Using the startup script (Recommended)**
```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 2. Start everything (validates prerequisites, builds, and starts services)
./start.sh
```

**Option 2: Using Make commands**
```bash
# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start services
make start
```

**Option 3: Using Docker Compose directly**
```bash
# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start services
docker compose up -d
```

### Ingest Case Studies

After starting services, ingest your case studies:

```bash
# Place your PDF/DOCX files in the case-studies/ folder first
./ingest.sh

# Or using Make
make ingest

# Or manually
docker compose run backend python /app/ingestion.py --folder /app/case-studies
```

### Access the Application

Once started, access:
- **Frontend (Production)**: http://localhost:3000 (nginx-served production build)
- **Frontend (Development)**: http://localhost:5173 (if running locally with `npm run dev`)
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### Check Status

```bash
# Check service health
./check.sh

# Or using Make
make check

# View logs
make logs          # All services
make logs-backend  # Backend only
make logs-frontend # Frontend only
```

## Usage

### For Sales Reps

1. Open http://localhost:3000
2. Type your question (e.g., "ecommerce platform with Shopify integration")
3. Get structured answer with citations
4. Click "Copy to Clipboard" to paste into proposals

### For Sales Ops

**Adding new case studies:**
```bash
# 1. Drop new PDFs/DOCX into case-studies/ folder
# 2. Re-run ingestion
./ingest.sh
# Or: make ingest
```

**Health check:**
```bash
./check.sh
# Or: make check
# Or: curl http://localhost:8000/health
```

## Available Commands

### Root-Level Scripts

- `./start.sh` - Start all services (with validation and health checks)
- `./stop.sh` - Stop all services
- `./dev.sh` - Start in development mode with live logs
- `./check.sh` - Check service status and health
- `./ingest.sh` - Ingest case studies from case-studies/ folder

### Make Commands

Run `make help` to see all available commands:

- `make start` - Start all services
- `make stop` - Stop all services
- `make restart` - Restart all services
- `make dev` - Start in development mode
- `make check` - Check service status
- `make logs` - View all service logs
- `make logs-backend` - View backend logs only
- `make logs-frontend` - View frontend logs only
- `make ingest` - Ingest case studies
- `make build` - Build Docker images
- `make clean` - Clean up containers and volumes

## Project Structure

```
case-study-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + /api/query
│   │   ├── ingestion.py         # CLI: python ingestion.py --folder docs/
│   │   ├── gemini_client.py     # Client + store management
│   │   ├── prompts.py           # Sales-optimized system prompt
│   │   ├── citations.py         # Parse grounding_metadata
│   │   └── models.py            # Pydantic schemas
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/Chat.tsx
│   │   ├── components/Answer.tsx
│   │   └── api.ts
│   ├── package.json
│   └── Dockerfile
├── case-studies/                # Place your PDF/DOCX files here
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

### `POST /api/query`

Query case studies with natural language.

**Request:**
```json
{
  "question": "fintech SaaS with Stripe integration"
}
```

**Response:**
```json
{
  "answer": "**Relevant Projects**\n- Client: Fintech startup...",
  "citations": [
    {"file": "project-alpha.pdf", "chunk_id": "123", "page": 5}
  ]
}
```

### `GET /health`

Health check with store information.

**Response:**
```json
{
  "status": "healthy",
  "store_name": "projects/.../fileSearchStores/...",
  "file_count": 42
}
```

## Development

### Backend (Local)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (Local Development)

For development with hot reload:

```bash
cd frontend
npm install
npm run dev
# Frontend will be available at http://localhost:5173
```

**Note:** The Docker frontend runs a production build with nginx. For development, run the frontend locally to get hot module replacement and faster iteration.

### Running Ingestion Locally

```bash
cd backend
source venv/bin/activate
export GEMINI_API_KEY=your_key_here
python app/ingestion.py --folder ../case-studies
```

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Gemini API key (required)
- `FILE_SEARCH_STORE_NAME`: Display name for the File Search store (default: "case-study-store")
- `VITE_API_URL`: Backend API URL for frontend (default: "http://localhost:8000")

### Supported File Formats

The ingestion script supports these common case study formats:
- PDF (`.pdf`)
- Word documents (`.docx`)
- Text files (`.txt`)
- Markdown (`.md`)

**Note:** Gemini File Search supports many more file types (see [official docs](https://ai.google.dev/gemini-api/docs/file-search#supported-file-types)). You can extend the `supported` set in `ingestion.py` to include additional formats.

**File size limit:** 100MB per file (Gemini File Search limit)

## Troubleshooting

### API Key Issues

**Error: "Service unavailable: Gemini API key not configured"**

- Ensure `.env` file exists in the project root
- Verify `GEMINI_API_KEY` is set correctly in `.env`
- Check that Docker Compose is reading the `.env` file:
  ```bash
  docker compose exec backend env | grep GEMINI_API_KEY
  ```
- Restart services after updating `.env`:
  ```bash
  docker compose restart backend
  ```

**Note:** The project uses `google-genai==1.56.0` which requires a valid API key with File Search access.

### Ingestion fails

- Check that `GEMINI_API_KEY` is set correctly
- Verify files are in supported formats
- Check file sizes (must be < 100MB)
- Ensure you're using the latest library version (1.56.0+)

### No results from queries

- Ensure ingestion completed successfully
- Check `/health` endpoint for file count
- Verify store name matches in `.env`
- Check backend logs: `docker compose logs backend`

### Frontend can't connect to backend

- Ensure backend is running: `docker compose ps`
- Check `VITE_API_URL` matches your backend URL (default: `http://localhost:8000`)
- Check browser console for CORS errors
- Verify backend health: `curl http://localhost:8000/health`

## Technology Stack

**Backend:**
- FastAPI 0.115.0
- Python 3.11
- Google GenAI SDK 1.56.0 (latest)
- Uvicorn (ASGI server)

**Frontend:**
- React 18.3.1
- TypeScript 5.5.4
- Vite 5.4.2
- Tailwind CSS 3.4.13
- Production: nginx (Docker)

**Infrastructure:**
- Docker & Docker Compose
- Multi-stage builds for optimized images
- Health checks and automatic restarts

## Cost Optimization

- **Free storage/query embeddings** - Pay only initial indexing ($0.15/1M tokens) + normal Gemini tokens
- **No vector DB costs** - File Search handles everything
- **Efficient chunking** - 300 tokens per chunk with 30 token overlap (optimized for case studies)
- **Model**: Uses `gemini-2.5-flash` for fast, cost-effective responses

## Security & Privacy

- All data stays private using your Gemini API key
- File Search stores are private to your API key
- No data used for public training
- Can be run entirely on-premises or private cloud

## Next Steps (Post-MVP)

- [ ] Metadata filtering by industry/client-type
- [ ] Multi-store support for different document sets
- [ ] Slack integration for team queries
- [ ] Advanced analytics and usage tracking
- [ ] Proposal template generation
- [ ] User authentication and access control

## License

Internal use only.

## Code Quality

This project maintains a **100/100 quality score** with zero errors or warnings.

**Backend Quality:**
- Linting: Ruff (Python)
- Formatting: Black
- Type Checking: MyPy
- All checks pass with zero errors

**Frontend Quality:**
- Linting: ESLint (TypeScript/React)
- Formatting: Prettier
- Type Checking: TypeScript (strict mode)
- All checks pass with zero errors

**Quick quality check:**
```bash
# Backend
cd backend
make check

# Frontend
cd frontend
npm run check
```

## Support

For issues or questions, check the logs:
```bash
# All services
docker compose logs

# Specific service
docker compose logs backend
docker compose logs frontend

# Follow logs in real-time
docker compose logs -f backend
```

**Quick Status Check:**
```bash
./check.sh
# Or: make check
# Or: curl http://localhost:8000/health
```

## Recent Updates

- ✅ Updated `google-genai` library to 1.56.0 (latest version with full File Search support)
- ✅ Frontend production build with nginx for optimal performance
- ✅ Multi-stage Docker builds for smaller image sizes
- ✅ Comprehensive error handling and logging
- ✅ Health checks and automatic service recovery
- ✅ Zero linting/formatting errors (100/100 quality score)
- ✅ TypeScript strict mode enabled
- ✅ Production-ready deployment configuration

