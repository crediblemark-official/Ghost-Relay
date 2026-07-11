#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

echo "=========================================="
echo "  Ghost Relay - Instalasi (Bun)"
echo "=========================================="
echo ""

# ── Cek Prasyarat ────────────────────────────────────────
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js 22+ diperlukan — https://nodejs.org"; exit 1; }
command -v bun >/dev/null 2>&1 || { echo "ERROR: Bun 1.1+ diperlukan — https://bun.sh"; exit 1; }

NODE_VER=$(node -v)
BUN_VER=$(bun -v)
echo "  ✅ Node.js $NODE_VER"
echo "  ✅ Bun v$BUN_VER"
echo ""

# ── Install dependencies ─────────────────────────────────
echo ">>> Menginstall dependencies..."
bun install
echo "  ✅ Dependencies terinstall"
echo ""

# ── Generate Prisma client ──────────────────────────────
echo ">>> Generate Prisma client..."
bun run db:generate 2>/dev/null || echo "  ⚠ Prisma generate skipped (butuh database)"
echo ""

# ── Setup .env ──────────────────────────────────────────
if [ ! -f .env ]; then
    echo ">>> Membuat .env dengan default development..."
    JWT_SECRET=$(openssl rand -hex 32)
    ENC_KEY=$(openssl rand -hex 32)
    CRYPTO_SALT=$(openssl rand -hex 16)
    BA_SECRET=$(openssl rand -hex 32)
    cat > .env <<- EOF
DATABASE_URL=postgresql://ghost:changeme@localhost:5433/ghost_relay
REDIS_URL=
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000
JWT_SECRET_KEY=${JWT_SECRET}
ENCRYPTION_KEY=${ENC_KEY}
CRYPTO_SALT=${CRYPTO_SALT}
BETTER_AUTH_SECRET=${BA_SECRET}
BETTER_AUTH_URL=http://localhost:8000
ADMIN_EMAIL=admin@ghost.local
ADMIN_PASSWORD=admin123
CORS_ORIGINS=["*"]
STORAGE_DIR=/tmp/ghost-storage
EOF
    echo "  ✅ .env dibuat (ganti secret keys untuk production)"
else
    echo "  ⚠ .env sudah ada, dilewati"
fi
echo ""

# ── Selesai ──────────────────────────────────────────────
echo "=========================================="
echo "  ✅ Instalasi selesai!"
echo "=========================================="
echo ""
echo "  Sebelum menjalankan, pastikan PostgreSQL berjalan."
echo "  Untuk development dengan Docker:"
echo "    docker compose up -d db"
echo ""
echo "  Jalankan:"
echo "    bun dev               → Development (backend :8000 + frontend :5173)"
echo "    bun run build         → Build production"
echo "    bun --filter @ghost/backend run start  → Backend production"
echo ""
echo "  Login default:"
echo "    Email:    admin@ghost.local"
echo "    Password: admin123"
echo ""
