# CaseStudy AI

**An internal AI assistant for your sales team to quickly find and extract relevant case studies from your document library.**

Upload your case study documents (PDFs, Word docs, etc.) and instantly search them with natural language. Get proposal-ready answers with citations showing exactly which documents the information came from.

---

## What It Does

- **Upload Documents**: Import your case studies (PDF, DOCX, TXT, MD) into a searchable knowledge base
- **Natural Language Search**: Ask questions like "fintech SaaS with Stripe integration" and get relevant examples
- **Proposal-Ready Answers**: Responses formatted as "Relevant Projects / What We Did / Features / Outcomes"
- **Citations Included**: See exactly which document each piece of information came from
- **One-Click Copy**: Copy answers directly to paste into proposals and presentations
- **Private & Secure**: All data stays private using your own API key

---

## Quick Start (5 Minutes)

### Step 1: Prerequisites

You need:
- **Docker Desktop** installed and running ([Download here](https://www.docker.com/products/docker-desktop))
- A **Google Gemini API key** ([Get one here](https://ai.google.dev/))

### Step 2: Setup

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API key:**
   - Open `.env` in a text editor
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Start the application:**
   ```bash
   ./start.sh
   ```
   
   This will:
   - Check that Docker is running
   - Build and start all services
   - Wait for everything to be ready
   - Show you the access URLs

### Step 3: Add Your Case Studies

1. **Place your documents** in the `case-studies/` folder:
   - Supported formats: PDF, DOCX, TXT, MD
   - Maximum file size: 100MB per file

2. **Run the ingestion:**
   ```bash
   ./ingest.sh
   ```
   
   This will upload and index all your documents. You'll see progress as each file is processed.

### Step 4: Use It!

1. **Open the web interface:** http://localhost:3000
2. **Type your question** (e.g., "ecommerce platform with Shopify")
3. **Get your answer** with citations
4. **Click "Copy"** to paste into your proposal

---

## Common Commands

| Command | What It Does |
|---------|--------------|
| `./start.sh` | Start the application |
| `./stop.sh` | Stop the application |
| `./check.sh` | Check if everything is running |
| `./ingest.sh` | Upload/update your case studies |
| `./dev.sh` | Start with live logs (for troubleshooting) |

---

## Adding New Case Studies

When you have new documents to add:

1. **Drop the files** into the `case-studies/` folder
2. **Run ingestion again:**
   ```bash
   ./ingest.sh
   ```

The system will automatically add the new documents to your knowledge base.

---

## Troubleshooting

### "Services won't start"

**Check Docker is running:**
```bash
docker info
```

If this fails, make sure Docker Desktop is open and running.

**View logs to see what's wrong:**
```bash
docker compose logs
```

### "API key not configured" error

1. Make sure `.env` file exists in the project root
2. Check your API key is correct:
   ```bash
   grep GEMINI_API_KEY .env
   ```
3. Restart the services:
   ```bash
   ./stop.sh
   ./start.sh
   ```

### "No results from queries"

1. **Check if documents were ingested:**
   ```bash
   curl http://localhost:8000/health
   ```
   Look for `"file_count"` - it should show how many documents are indexed.

2. **If file_count is 0**, run ingestion:
   ```bash
   ./ingest.sh
   ```

3. **Check ingestion logs** for errors:
   ```bash
   docker compose logs backend | grep -i error
   ```

### Frontend won't load

1. **Check if backend is running:**
   ```bash
   ./check.sh
   ```

2. **Check backend health:**
   ```bash
   curl http://localhost:8000/health
   ```

3. **Restart everything:**
   ```bash
   ./stop.sh
   ./start.sh
   ```

### Ingestion fails

**Common issues:**
- **File too large**: Maximum 100MB per file
- **Unsupported format**: Use PDF, DOCX, TXT, or MD
- **API key invalid**: Check your `.env` file

**Check what went wrong:**
```bash
docker compose logs backend
```

---

## Access Points

Once running, you can access:

- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## How It Works

1. **Documents** are uploaded to Google Gemini File Search (a managed RAG service)
2. **Documents are automatically** chunked, indexed, and made searchable
3. **When you ask a question**, the system:
   - Searches your document library
   - Finds relevant sections
   - Formats the answer for sales use
   - Shows citations for each piece of information

**No vector databases or complex setup needed** - Gemini File Search handles everything automatically.

---

## File Formats Supported

- **PDF** (`.pdf`)
- **Word Documents** (`.docx`)
- **Text Files** (`.txt`)
- **Markdown** (`.md`)

**File size limit:** 100MB per file

---

## Privacy & Security

- ✅ All data stays private using your Gemini API key
- ✅ Your documents are only accessible through your API key
- ✅ No data is used for public training
- ✅ Can be run entirely on your own server or computer

---

## Technology Stack

**Built with:**
- **Backend**: Python (FastAPI) - handles queries and document processing
- **Frontend**: React + TypeScript - modern web interface
- **AI**: Google Gemini File Search - managed RAG (no vector DB needed)
- **Deployment**: Docker - easy to run anywhere

---

## Project Structure

```
case-study-ai/
├── backend/              # Python API server
├── frontend/             # React web interface
├── case-studies/         # Put your documents here
├── docker-compose.yml    # Docker configuration
├── .env                  # Your API key (create this)
└── README.md            # This file
```

---

## Support

**Check service status:**
```bash
./check.sh
```

**View logs:**
```bash
docker compose logs          # All services
docker compose logs backend  # Backend only
docker compose logs frontend # Frontend only
```

**Restart services:**
```bash
./stop.sh
./start.sh
```

---

## Advanced Usage

### Using Make Commands

If you prefer Make commands:

```bash
make start    # Start services
make stop     # Stop services
make check    # Check status
make ingest   # Ingest documents
make logs     # View logs
make help     # See all commands
```

### Development Mode

For development with live logs:

```bash
./dev.sh
```

### Manual Docker Commands

If you prefer using Docker directly:

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f

# Rebuild
docker compose up -d --build
```

---

## Cost Information

- **Free storage/query embeddings** - Gemini File Search handles this
- **Pay only for**: Initial document indexing ($0.15 per 1M tokens) + normal Gemini API usage
- **No vector database costs** - everything is managed by Gemini
- **Model used**: `gemini-2.5-flash` - fast and cost-effective

---

## What's Included

✅ **Working MVP** - Fully functional application  
✅ **Ingestion script** - Upload and index your documents  
✅ **Web interface** - Search, view answers, copy to clipboard  
✅ **Citations** - See source documents for every answer  
✅ **Docker setup** - Easy to run locally or on a server  
✅ **Full source code** - Everything is included  
✅ **Setup instructions** - This README  

---

## Next Steps

After getting started, you can:

1. **Add more documents** - Just drop them in `case-studies/` and run `./ingest.sh`
2. **Customize the prompts** - Edit `backend/app/prompts.py` to change answer format
3. **Deploy to a server** - Use the same Docker setup on any server
4. **Expand features** - The codebase is well-structured for adding features

---

**Built by [Monarch Labs Inc.](https://monarch-labs.com)**
