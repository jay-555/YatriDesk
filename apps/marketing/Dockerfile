# Marketing site (apps/marketing). Built from the MONOREPO ROOT context:
#   docker build -f apps/marketing/Dockerfile .
# On yatridesk.cloud it is not published directly: the product app (web)
# forwards "/" and the other marketing paths to it (see apps/web/next.config.ts
# and docker-compose.marketing.yml).

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# --- deps ---
# Every workspace manifest is copied so the frozen lockfile matches, but only
# this app's dependencies are installed (no native toolchain needed, unlike
# the backend's USB printing addon).
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/marketing/package.json apps/marketing/package.json
COPY packages/types/package.json packages/types/package.json
RUN pnpm install --frozen-lockfile --filter "marketing..."

# --- builder ---
# NEXT_PUBLIC_* values are inlined at build time, so they are build ARGs.
FROM deps AS builder
ARG NEXT_PUBLIC_SITE_URL=https://yatridesk.cloud
ARG NEXT_PUBLIC_APP_URL=
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_TELEMETRY_DISABLED=1
COPY apps/marketing apps/marketing
RUN pnpm --filter marketing build

# --- runtime ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# The standalone server resolves .next/static relative to its own traced
# monorepo path (apps/marketing/...), same layout as apps/web/Dockerfile.
COPY --from=builder /repo/apps/marketing/.next/standalone ./
COPY --from=builder /repo/apps/marketing/.next/static ./apps/marketing/.next/static
USER node
EXPOSE 3000
CMD ["node", "apps/marketing/server.js"]
