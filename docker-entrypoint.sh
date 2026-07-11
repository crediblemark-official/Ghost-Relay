#!/bin/sh
set -e

echo "Ghost Relay — Starting..."

# Push database schema (idempotent — safe to run on every start)
echo "Ensuring database schema is up to date..."
cd /app
bun run db:push 2>&1 || echo "WARNING: db:push failed (database may not be ready yet)"

# Start the application
echo "Starting server..."
exec bun run apps/backend/dist/main.js
