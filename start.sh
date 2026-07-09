#!/bin/bash
set -e

ENV=${1:-development}

if [ "$ENV" = "development" ]; then
  echo "Starting in development mode..."
  echo "  Backend: http://localhost:8000"
  echo "  Frontend: http://localhost:5173"
  echo ""

  # Start backend
  bun --filter @ghost/backend run dev &
  BACKEND_PID=$!

  # Start frontend
  bun --filter frontend run dev &
  FRONTEND_PID=$!

  # Trap Ctrl+C and clean up
  trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

  wait
else
  echo "Starting in production mode..."
  bun --filter @ghost/backend run start
fi
