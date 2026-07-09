# ---- Stage 1: Install deps using Bun ----
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/config/package.json ./packages/config/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
RUN bun install --frozen-lockfile

# ---- Stage 2: Build backend ----
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN bun --filter @ghost/database run db:generate
RUN bun x turbo build --filter=@ghost/backend

# ---- Stage 3: Build frontend ----
FROM oven/bun:1-alpine AS frontend-builder
WORKDIR /app
COPY --from=deps /app /app
COPY . .
RUN bun x turbo build --filter=frontend

# ---- Stage 4: Runtime ----
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=frontend-builder /app/apps/frontend/dist /app/frontend/dist
RUN echo '{"name":"runtime","private":true,"type":"module"}' > package.json && npm install tsx
ENV FRONTEND_DIR=/app/frontend/dist
ENV NODE_ENV=production
EXPOSE 8000
CMD ["node", "--import", "tsx/esm", "dist/main.js"]
