#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# TDMP Staging Server Setup Script
# ==============================================================================
# Prerequisites: Docker and Bun must already be installed.
#
# This script sets up:
#   1. Playwright system dependencies (for CI tests)
#   2. GitHub Actions self-hosted runner (as a systemd service)
#   3. GitHub Container Registry (ghcr.io) login
#   4. Docker context for production server (remote Swarm access)
#
# Usage: bash scripts/setup-staging.sh
# ==============================================================================

RUNNER_DIR="$HOME/actions-runner"
DOCKER_CERTS_DIR="$HOME/.docker/production"
ORG_NAME="RTB-Rwanda-TVET-Board"

# --- Helpers ---

info()  { echo -e "\n\033[1;34m[INFO]\033[0m $*"; }
ok()    { echo -e "\033[1;32m[OK]\033[0m $*"; }
warn()  { echo -e "\033[1;33m[WARN]\033[0m $*"; }
err()   { echo -e "\033[1;31m[ERROR]\033[0m $*"; }

prompt() {
  local var_name="$1" prompt_text="$2" default="${3:-}"
  if [[ -n "$default" ]]; then
    read -rp "$prompt_text [$default]: " value
    eval "$var_name=\"${value:-$default}\""
  else
    read -rp "$prompt_text: " value
    eval "$var_name=\"$value\""
  fi
}

prompt_secret() {
  local var_name="$1" prompt_text="$2"
  read -rsp "$prompt_text: " value
  echo
  eval "$var_name=\"$value\""
}

confirm() {
  read -rp "$1 (y/N): " answer
  [[ "$answer" =~ ^[Yy]$ ]]
}

# --- Pre-flight checks ---

info "Running pre-flight checks..."

if ! command -v docker &>/dev/null; then
  err "Docker is not installed. Please install Docker first."
  exit 1
fi
ok "Docker found: $(docker --version)"

if ! command -v bun &>/dev/null; then
  err "Bun is not installed. Please install Bun first."
  exit 1
fi
ok "Bun found: $(bun --version)"

if ! docker info &>/dev/null 2>&1; then
  err "Docker daemon is not running or current user lacks permission."
  echo "    Try: sudo usermod -aG docker $USER && newgrp docker"
  exit 1
fi
ok "Docker daemon is accessible"

# ==============================================================================
# Step 1: Playwright system dependencies
# ==============================================================================

info "Step 1/4: Playwright system dependencies"

if dpkg -l | grep -q "libglib2.0-0\|libglib2.0-0t64"; then
  ok "Playwright system dependencies appear to be installed (libglib2.0 found)"
  if confirm "Re-install Playwright deps anyway?"; then
    sudo "$(which bun)" x playwright install-deps chromium
    ok "Playwright dependencies installed"
  fi
else
  info "Installing Playwright system dependencies for Chromium..."
  sudo "$(which bun)" x playwright install-deps chromium
  ok "Playwright dependencies installed"
fi

# ==============================================================================
# Step 2: GitHub Actions self-hosted runner
# ==============================================================================

info "Step 2/4: GitHub Actions self-hosted runner"

if [[ -d "$RUNNER_DIR" ]] && [[ -f "$RUNNER_DIR/.runner" ]]; then
  ok "Runner already configured at $RUNNER_DIR"
  if confirm "Reconfigure the runner?"; then
    cd "$RUNNER_DIR"
    sudo ./svc.sh stop 2>/dev/null || true
    sudo ./svc.sh uninstall 2>/dev/null || true
    ./config.sh remove --token dummy 2>/dev/null || true
  else
    # Check if service is running
    if sudo "$RUNNER_DIR/svc.sh" status 2>/dev/null | grep -q "active (running)"; then
      ok "Runner service is active"
    else
      warn "Runner service is not running. Starting..."
      sudo "$RUNNER_DIR/svc.sh" start
    fi
    # Skip to next step
    SKIP_RUNNER=true
  fi
fi

if [[ "${SKIP_RUNNER:-}" != "true" ]]; then
  # Determine runner version
  info "Fetching latest runner version..."
  RUNNER_VERSION=$(curl -s https://api.github.com/repos/actions/runner/releases/latest | grep '"tag_name"' | sed -E 's/.*"v([^"]+)".*/\1/')
  if [[ -z "$RUNNER_VERSION" ]]; then
    warn "Could not fetch latest version. Using fallback."
    RUNNER_VERSION="2.322.0"
  fi
  ok "Runner version: $RUNNER_VERSION"

  # Download and extract
  mkdir -p "$RUNNER_DIR"
  cd "$RUNNER_DIR"

  RUNNER_TAR="actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  if [[ ! -f "$RUNNER_TAR" ]]; then
    info "Downloading runner v${RUNNER_VERSION}..."
    curl -o "$RUNNER_TAR" -L "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/${RUNNER_TAR}"
  fi

  info "Extracting runner..."
  tar xzf "$RUNNER_TAR"

  # Configure
  echo ""
  echo "============================================"
  echo "  GitHub Actions Runner Configuration"
  echo "============================================"
  echo ""
  echo "You need a runner registration token from GitHub."
  echo ""
  echo "For an ORGANIZATION runner (recommended — serves all repos):"
  echo "  Go to: https://github.com/organizations/${ORG_NAME}/settings/actions/runners/new"
  echo ""
  echo "For a SINGLE REPO runner:"
  echo "  Go to: https://github.com/${ORG_NAME}/<repo>/settings/actions/runners/new"
  echo ""
  echo "Copy the token shown on that page."
  echo ""

  prompt RUNNER_SCOPE "Register as org runner or repo runner? (org/repo)" "org"
  prompt_secret RUNNER_TOKEN "Paste the runner registration token"

  if [[ "$RUNNER_SCOPE" == "org" ]]; then
    RUNNER_URL="https://github.com/${ORG_NAME}"
  else
    prompt REPO_NAME "Repository name (e.g. tdmp-web)"
    RUNNER_URL="https://github.com/${ORG_NAME}/${REPO_NAME}"
  fi

  prompt RUNNER_NAME "Runner name" "tdmp-staging"
  prompt RUNNER_LABELS "Runner labels (comma-separated)" "self-hosted,linux,x64,staging"

  ./config.sh \
    --url "$RUNNER_URL" \
    --token "$RUNNER_TOKEN" \
    --name "$RUNNER_NAME" \
    --labels "$RUNNER_LABELS" \
    --unattended \
    --replace

  # Install and start as service
  info "Installing runner as systemd service..."
  sudo ./svc.sh install "$(whoami)"
  sudo ./svc.sh start

  ok "Runner installed and started"
  sudo ./svc.sh status
fi

cd "$HOME"

# ==============================================================================
# Step 3: GitHub Container Registry login
# ==============================================================================

info "Step 3/4: GitHub Container Registry (ghcr.io) login"

if docker pull ghcr.io/library/hello-world 2>/dev/null; then
  ok "Already logged in to a registry"
fi

if confirm "Login to ghcr.io? (needed to push/pull Docker images)"; then
  echo ""
  echo "You need a Personal Access Token (classic) with these scopes:"
  echo "  - read:packages"
  echo "  - write:packages"
  echo ""
  echo "Create one at: https://github.com/settings/tokens/new"
  echo ""

  prompt GH_USERNAME "GitHub username"
  prompt_secret GH_TOKEN "GitHub Personal Access Token"

  echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USERNAME" --password-stdin

  ok "Logged in to ghcr.io as $GH_USERNAME"
else
  warn "Skipping ghcr.io login"
fi

# ==============================================================================
# Step 4: Docker context for production server
# ==============================================================================

info "Step 4/4: Docker context for production server"

if docker context inspect production &>/dev/null 2>&1; then
  ok "Docker context 'production' already exists"
  docker context inspect production --format '{{.Endpoints.docker.Host}}'
  if ! confirm "Recreate the production context?"; then
    SKIP_CONTEXT=true
  else
    docker context rm production -f
  fi
fi

if [[ "${SKIP_CONTEXT:-}" != "true" ]]; then
  echo ""
  echo "============================================"
  echo "  Production Server Docker Context"
  echo "============================================"
  echo ""
  echo "This connects to the Docker daemon on the production server"
  echo "so you can deploy to Swarm remotely."
  echo ""
  echo "The production server must have:"
  echo "  1. Docker installed with Swarm initialized (docker swarm init)"
  echo "  2. Docker daemon listening on TCP with TLS"
  echo ""
  echo "If the production server is NOT yet set up, you can skip this"
  echo "step and run it later."
  echo ""

  if confirm "Set up Docker context for production now?"; then
    prompt PROD_HOST "Production server IP or hostname"
    prompt PROD_PORT "Docker TCP port on production" "2376"

    echo ""
    echo "TLS certificates are required for secure remote Docker access."
    echo "You need 3 files from the production server:"
    echo "  - ca.pem         (CA certificate)"
    echo "  - client-cert.pem (client certificate)"
    echo "  - client-key.pem  (client private key)"
    echo ""

    mkdir -p "$DOCKER_CERTS_DIR"

    prompt CERT_CA "Path to ca.pem" "$DOCKER_CERTS_DIR/ca.pem"
    prompt CERT_CERT "Path to client-cert.pem" "$DOCKER_CERTS_DIR/client-cert.pem"
    prompt CERT_KEY "Path to client-key.pem" "$DOCKER_CERTS_DIR/client-key.pem"

    # Verify cert files exist
    for f in "$CERT_CA" "$CERT_CERT" "$CERT_KEY"; do
      if [[ ! -f "$f" ]]; then
        err "File not found: $f"
        echo "    Copy the TLS certs from the production server first:"
        echo "    scp root@${PROD_HOST}:/etc/docker/certs/{ca.pem,client-cert.pem,client-key.pem} $DOCKER_CERTS_DIR/"
        exit 1
      fi
    done

    docker context create production \
      --docker "host=tcp://${PROD_HOST}:${PROD_PORT},ca=${CERT_CA},cert=${CERT_CERT},key=${CERT_KEY}"

    ok "Docker context 'production' created"

    info "Testing connection to production..."
    if docker --context production info &>/dev/null 2>&1; then
      ok "Successfully connected to production Docker daemon"
      docker --context production node ls 2>/dev/null && ok "Swarm is active" || warn "Swarm not initialized on production (run 'docker swarm init' on production server)"
    else
      warn "Could not connect to production. Verify the production server setup and TLS certs."
    fi
  else
    warn "Skipping Docker context setup. Run this script again when production is ready."
  fi
fi

# ==============================================================================
# Summary
# ==============================================================================

echo ""
echo "============================================"
echo "  Setup Complete"
echo "============================================"
echo ""
echo "Installed components:"

# Playwright
if dpkg -l 2>/dev/null | grep -q "libglib2.0"; then
  ok "Playwright system dependencies"
else
  warn "Playwright system dependencies (not verified)"
fi

# Runner
if [[ -f "$RUNNER_DIR/.runner" ]]; then
  ok "GitHub Actions runner ($(cat "$RUNNER_DIR/.runner" 2>/dev/null | grep -o '"runnerName":"[^"]*"' | cut -d'"' -f4))"
else
  warn "GitHub Actions runner (not configured)"
fi

# ghcr.io
if grep -q "ghcr.io" "$HOME/.docker/config.json" 2>/dev/null; then
  ok "ghcr.io login"
else
  warn "ghcr.io login (not configured)"
fi

# Docker context
if docker context inspect production &>/dev/null 2>&1; then
  ok "Docker context 'production'"
else
  warn "Docker context 'production' (not configured)"
fi

echo ""
echo "Next steps:"
echo "  1. Configure GitHub repo secrets (STAGING_API_URL, PRODUCTION_API_URL, etc.)"
echo "  2. Set up the production server (Docker Swarm + TLS)"
echo "  3. Push to 'develop' branch to trigger the first staging deployment"
echo ""
