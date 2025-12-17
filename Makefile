.PHONY: help start stop restart dev check logs clean ingest

help: ## Show this help message
	@echo "CaseStudy AI - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

start: ## Start all services
	@./start.sh

stop: ## Stop all services
	@./stop.sh

restart: ## Restart all services
	@./stop.sh && ./start.sh

dev: ## Start in development mode with logs
	@./dev.sh

check: ## Check service status
	@./check.sh

logs: ## View service logs
	@docker compose logs -f

logs-backend: ## View backend logs only
	@docker compose logs -f backend

logs-frontend: ## View frontend logs only
	@docker compose logs -f frontend

clean: ## Stop services and remove containers
	@docker compose down -v
	@echo "Cleaned up containers and volumes"

ingest: ## Ingest case studies
	@./ingest.sh

build: ## Build Docker images
	@docker compose build

rebuild: ## Rebuild Docker images from scratch
	@docker compose build --no-cache

