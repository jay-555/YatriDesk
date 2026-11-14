#!/bin/sh
# Deploy yatridesk.cloud by building images on this VPS from the git checkout.
# Used by .github/workflows/deploy-vps.yml after CI succeeds on master.
#
# Layout:
#   $HOME/src/YatriDesk   (this repo)
#
# One-time: clone the repo, create .env (see .env.example), and optionally
# docker-compose.override.yml to bind web to 127.0.0.1:1995 behind nginx.
#
# Optional env:
#   APP_DIR     default $HOME/src/YatriDesk
#   GIT_REF     default master
#   SKIP_PULL   set to 1 to build the current working tree only
set -eu

APP_DIR="${APP_DIR:-$HOME/src/YatriDesk}"
GIT_REF="${GIT_REF:-master}"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "Expected a git checkout at $APP_DIR" >&2
  exit 1
fi

cd "$APP_DIR"

if [ "${SKIP_PULL:-0}" != "1" ]; then
  echo "Pulling $GIT_REF..."
  git fetch origin
  git checkout "$GIT_REF"
  git pull --ff-only origin "$GIT_REF"
fi

if [ ! -f .env ]; then
  echo "Missing $APP_DIR/.env — create it from .env.example before deploying." >&2
  exit 1
fi

HOST_PORT="$(grep -m1 '^HOST_PORT=' .env 2>/dev/null | cut -d= -f2- || true)"
HOST_PORT="${HOST_PORT:-1995}"

echo "Building and starting the stack (including marketing)..."
docker compose \
  -f docker-compose.yml \
  -f docker-compose.marketing.yml \
  up -d --build

echo "Waiting for http://127.0.0.1:${HOST_PORT}/api/health ..."
ready=0
i=1
while [ "$i" -le 90 ]; do
  if curl -fsS "http://127.0.0.1:${HOST_PORT}/api/health" >/dev/null 2>&1; then
    echo
    ready=1
    break
  fi
  echo "Health check attempt $i did not answer yet"
  i=$((i + 1))
  sleep 2
done

if [ "$ready" -ne 1 ]; then
  echo "App did not become healthy in time." >&2
  docker compose \
    -f docker-compose.yml \
    -f docker-compose.marketing.yml \
    logs --tail 80
  exit 1
fi

echo "VPS deploy from git finished."
echo "  commit: $(git rev-parse --short HEAD)"
echo "  health: http://127.0.0.1:${HOST_PORT}/api/health"
