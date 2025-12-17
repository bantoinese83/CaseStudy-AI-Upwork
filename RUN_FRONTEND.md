# Running Frontend in Development Mode

## Quick Start

**Option 1: Using the script (Recommended)**
```bash
./frontend-dev.sh
```

**Option 2: Manual start**
```bash
cd frontend
npm install  # First time only
npm run dev
```

## Port Configuration

- **Docker Frontend**: http://localhost:3000 (production build)
- **Local Dev Server**: http://localhost:5173 (development with hot reload)

The local dev server uses port 5173 to avoid conflicts with the Docker container on port 3000.

## Development vs Docker

### Local Development (Recommended for coding)
- ✅ Hot module replacement (instant updates)
- ✅ Fast refresh
- ✅ Better error messages
- ✅ Source maps for debugging

### Docker (Production-like)
- ✅ Consistent environment
- ✅ Production build
- ✅ Isolated from host

## Stopping the Dev Server

Press `Ctrl+C` in the terminal where it's running, or:

```bash
pkill -f vite
```

## Troubleshooting

**Port already in use:**
```bash
# Kill any existing Vite processes
pkill -f vite

# Or use a different port
cd frontend
npm run dev -- --port 5174
```

**Dependencies missing:**
```bash
cd frontend
npm install
```

**Backend not connecting:**
- Ensure backend is running: `./check.sh`
- Check `VITE_API_URL` in `.env` or `frontend/.env.local`
- Default: `http://localhost:8000`

