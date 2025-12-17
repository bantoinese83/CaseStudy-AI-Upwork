.PHONY: format lint type-check check install-dev

install-dev:
	pip install -r requirements-dev.txt

format:
	black app/
	ruff check --fix app/

lint:
	ruff check app/
	black --check app/

type-check:
	mypy app/

check: lint type-check
	@echo "✅ All checks passed!"

