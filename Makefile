.PHONY: help install dev build clean serve check-deps stop-dev validate

# Default target
.DEFAULT_GOAL := help

# Variables
NPM := npm
NODE_MODULES := node_modules
DIST := dist

##@ General

help: ## Display this help message
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install dependencies
	@echo "Installing dependencies..."
	$(NPM) install

ci-install: ## Install dependencies for CI (uses npm ci)
	@echo "Installing dependencies for CI..."
	$(NPM) ci

dev: check-deps ## Start development server
	@echo "Starting development server..."
	$(NPM) run dev

serve: dev ## Alias for dev command

stop-dev: ## Stop development server (if running)
	@echo "Stopping development server..."
	@-pkill -f "vite" || echo "No dev server process found"
	@echo "Dev server stopped (if it was running)"

##@ Build

build: check-deps ## Build project for production
	@echo "Building project for production..."
	$(NPM) run build
	@echo "Build complete! Output: $(DIST)/"

preview: ## Preview production build
	@if [ ! -d "$(DIST)" ]; then \
		echo "No build found. Building first..."; \
		$(MAKE) build; \
	fi
	@echo "Starting preview server..."
	$(NPM) run preview


##@ Cleanup

clean: ## Remove build artifacts and node_modules
	@echo "Cleaning build artifacts..."
	@rm -rf $(DIST)
	@rm -rf $(NODE_MODULES)
	@echo "Clean complete!"

clean-build: ## Remove only build artifacts
	@echo "Cleaning build artifacts..."
	@rm -rf $(DIST)
	@echo "Build artifacts cleaned!"

clean-deps: ## Remove only node_modules
	@echo "Removing node_modules..."
	@rm -rf $(NODE_MODULES)
	@echo "Dependencies cleaned!"

##@ Maintenance

update: ## Update dependencies to latest versions
	@echo "Updating dependencies..."
	$(NPM) update
	@echo "Dependencies updated!"

outdated: ## Check for outdated dependencies
	@echo "Checking for outdated dependencies..."
	$(NPM) outdated || true

audit: ## Run security audit
	@echo "Running security audit..."
	$(NPM) audit

audit-fix: ## Fix security vulnerabilities
	@echo "Fixing security vulnerabilities..."
	$(NPM) audit fix

##@ Setup

setup: install ## Initial project setup (install dependencies)
	@echo "Project setup complete!"

reinstall: clean-deps install ## Clean and reinstall dependencies
	@echo "Dependencies reinstalled!"

##@ Validation & Checks

check-deps: ## Check if dependencies are installed
	@if [ ! -d "$(NODE_MODULES)" ]; then \
		echo "Dependencies not found. Installing..."; \
		$(MAKE) install; \
	fi

validate: check-deps ## Validate project setup
	@echo "Validating project setup..."
	@echo "✓ Checking Node.js version..."
	@node --version > /dev/null || (echo "✗ Node.js not found" && exit 1)
	@echo "✓ Checking npm..."
	@$(NPM) --version > /dev/null || (echo "✗ npm not found" && exit 1)
	@echo "✓ Checking dependencies..."
	@[ -d "$(NODE_MODULES)" ] || (echo "✗ Dependencies not installed" && exit 1)
	@echo "✓ Project setup is valid!"

##@ Info

version: ## Show Node.js and npm versions
	@echo "Node.js version:"
	@node --version
	@echo "npm version:"
	@$(NPM) --version

info: ## Show project information
	@echo "Project: Nut"
	@echo "Node.js: $$(node --version)"
	@echo "npm: $$(npm --version)"
	@echo "Dependencies installed: $$([ -d $(NODE_MODULES) ] && echo 'Yes' || echo 'No')"
	@echo "Build exists: $$([ -d $(DIST) ] && echo 'Yes' || echo 'No')"

##@ Quick Commands

all: clean install build ## Clean, install, and build (full cycle)

rebuild: clean-build build ## Clean build artifacts and rebuild

quick-dev: ## Quick dev start (skip install check)
	@$(NPM) run dev

quick-build: ## Quick build (skip clean)
	@$(NPM) run build
