# Quick Start Guide

## 🚀 One-Command Start

```bash
./start.sh
```

That's it! The script will:
- ✅ Check all prerequisites
- ✅ Validate environment configuration
- ✅ Build and start all services
- ✅ Wait for services to be healthy
- ✅ Provide access URLs

## 📋 Prerequisites Check

The startup script automatically checks:
- Docker installation
- Docker Compose availability
- Docker daemon running
- Environment file (.env)

## 🔧 First Time Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Gemini API key:**
   ```bash
   # Edit .env and set:
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Start services:**
   ```bash
   ./start.sh
   ```

4. **Ingest case studies:**
   ```bash
   # Place PDF/DOCX files in case-studies/ folder
   ./ingest.sh
   ```

## 🎯 Common Commands

| Command | Description |
|---------|-------------|
| `./start.sh` | Start all services |
| `./stop.sh` | Stop all services |
| `./dev.sh` | Development mode with logs |
| `./check.sh` | Check service health |
| `./ingest.sh` | Ingest case studies |
| `make help` | Show all Make commands |

## 🔍 Troubleshooting

### Services won't start
```bash
# Check Docker
docker info

# Check logs
make logs

# Rebuild from scratch
make rebuild
make start
```

### Backend not responding
```bash
# Check backend logs
make logs-backend

# Check health
curl http://localhost:8000/health

# Restart backend
docker compose restart backend
```

### Frontend can't connect to backend
```bash
# Verify backend is running
./check.sh

# Check CORS settings in .env
# Ensure VITE_API_URL matches backend URL
```

### Ingestion fails
```bash
# Check API key is set
grep GEMINI_API_KEY .env

# Check file formats (PDF, DOCX, TXT, MD)
ls -la case-studies/

# Check file sizes (max 100MB per file)
```

## 📊 Service Status

Check service health anytime:
```bash
./check.sh
```

Or manually:
```bash
# Backend health
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000
```

## 🛠️ Development Mode

For development with live logs:
```bash
./dev.sh
```

This runs services in foreground with all logs visible.

## 📝 Logs

View logs:
```bash
make logs              # All services
make logs-backend      # Backend only
make logs-frontend     # Frontend only
```

## 🧹 Cleanup

Stop and remove everything:
```bash
make clean
```

This stops services and removes containers/volumes.

## ✅ Verification Checklist

After starting, verify:

- [ ] Backend responds: `curl http://localhost:8000/health`
- [ ] Frontend loads: Open http://localhost:3000
- [ ] API docs work: Open http://localhost:8000/docs
- [ ] Can submit queries in UI
- [ ] Citations appear in responses

## 🆘 Need Help?

1. Check logs: `make logs`
2. Check status: `./check.sh`
3. Review README.md for detailed documentation
4. Check ARCHITECTURE.md for frontend architecture

