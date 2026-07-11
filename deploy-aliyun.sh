#!/usr/bin/env bash
# =============================================================================
# deploy-aliyun.sh — Ghost Relay: Skrip Deployment ke Alibaba Cloud ECS
# =============================================================================
# Prasyarat: Ubuntu 22.04 / Debian 11 fresh install di ECS
# Jalankan sebagai root atau user dengan sudo
# =============================================================================
set -euo pipefail

REPO_URL="${REPO_URL:-}"
APP_DIR="/opt/ghost-relay"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERR]${NC}  $*"; exit 1; }

# ─── Banner ─────────────────────────────────────────────────────────────────
echo -e "
${BLUE}
  ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗    ██████╗ ███████╗██╗      █████╗ ██╗   ██╗
 ██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝    ██╔══██╗██╔════╝██║     ██╔══██╗╚██╗ ██╔╝
 ██║  ███╗███████║██║   ██║███████╗   ██║       ██████╔╝█████╗  ██║     ███████║ ╚████╔╝
 ██║   ██║██╔══██║██║   ██║╚════██║   ██║       ██╔══██╗██╔══╝  ██║     ██╔══██║  ╚██╔╝
 ╚██████╔╝██║  ██║╚██████╔╝███████║   ██║       ██║  ██║███████╗███████╗██║  ██║   ██║
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝       ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝
${NC}
  Alibaba Cloud ECS Auto-Deployment Script
  ─────────────────────────────────────────────────────
"

# ─── Cek root ───────────────────────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
  error "Jalankan script ini sebagai root: sudo bash deploy-aliyun.sh"
fi

# ─── Setup Swap (Anti Out-of-Memory) ────────────────────────────────────────
if ! swapon --show | grep -q "swap"; then
  info "Mengonfigurasi Swap 2GB (mencegah Out of Memory saat build)..."
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  success "Swap 2GB berhasil diaktifkan"
else
  success "Swap sudah aktif"
fi


# ─── Update sistem ──────────────────────────────────────────────────────────
info "Menghentikan updater latar belakang otomatis jika ada..."
systemctl stop unattended-upgrades 2>/dev/null || true

info "Menunggu kunci package manager (apt/dpkg) dilepaskan..."
while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || fuser /var/lib/dpkg/lock >/dev/null 2>&1; do
  sleep 2
done

info "Update package list..."
apt-get update -qq
apt-get install -y -qq curl git ca-certificates gnupg lsb-release ufw
success "Sistem terupdate"


# ─── Install Docker ─────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  info "Menginstall Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  success "Docker terinstall: $(docker --version)"
else
  success "Docker sudah ada: $(docker --version)"
fi

# ─── Install Docker Compose plugin ─────────────────────────────────────────
if ! docker compose version &>/dev/null; then
  info "Menginstall Docker Compose plugin..."
  apt-get install -y -qq docker-compose-plugin
fi
success "Docker Compose: $(docker compose version)"

# ─── Clone / Update repository ──────────────────────────────────────────────
if [ -z "$REPO_URL" ]; then
  echo -e "\n${YELLOW}Masukkan URL repositori GitHub Anda:${NC}"
  read -r REPO_URL
fi

if [ -d "$APP_DIR/.git" ]; then
  info "Repository sudah ada, melakukan git pull..."
  git -C "$APP_DIR" pull --rebase
else
  info "Meng-clone repository ke $APP_DIR..."
  git clone "$REPO_URL" "$APP_DIR"
fi
success "Repository siap di $APP_DIR"

# ─── Setup .env ─────────────────────────────────────────────────────────────
ENV_FILE="$APP_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
  info "Membuat file .env..."

  generate_secret() { openssl rand -hex 32; }

  echo -e "\n${YELLOW}Konfigurasi Environment Ghost Relay${NC}"
  echo "─────────────────────────────────────────────────────"

  read -rp "  Admin Email      [admin@ghost.local]: " ADMIN_EMAIL
  ADMIN_EMAIL="${ADMIN_EMAIL:-admin@ghost.local}"

  read -rsp "  Admin Password   [auto-generate]: " ADMIN_PASSWORD
  ADMIN_PASSWORD="${ADMIN_PASSWORD:-$(generate_secret | head -c 16)}"
  echo ""

  read -rp "  Qwen API Key     (DashScope API Key): " QWEN_API_KEY
  read -rp "  Telegram Bot Token (opsional, Enter=skip): " TELEGRAM_BOT_TOKEN

  JWT_SECRET=$(generate_secret)
  BETTER_AUTH_SECRET=$(generate_secret)
  ENC_KEY=$(generate_secret | head -c 32)
  CRYPTO_SALT=$(generate_secret)

  DB_PASS=$(generate_secret | head -c 24)

  # Dapatkan IP Publik ECS untuk BETTER_AUTH_URL
  PUBLIC_IP=$(curl -s --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || \
              curl -s --max-time 5 http://100.100.100.200/latest/meta-data/eipv4 2>/dev/null || \
              curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "localhost")

  cat > "$ENV_FILE" <<EOF
# ── Database ──────────────────────────────────────────────
DATABASE_URL=postgresql://ghost:${DB_PASS}@db:5432/ghost_relay

# ── Aplikasi ──────────────────────────────────────────────
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=["*"]

# ── Keamanan ──────────────────────────────────────────────
JWT_SECRET_KEY=${JWT_SECRET}
BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
BETTER_AUTH_URL=http://${PUBLIC_IP}:8000
ENCRYPTION_KEY=${ENC_KEY}
CRYPTO_SALT=${CRYPTO_SALT}

# ── Admin seeder ──────────────────────────────────────────
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# ── Qwen Cloud / Alibaba DashScope ────────────────────────
# API Key dari: https://dashscope.console.aliyun.com/
DASHSCOPE_API_KEY=${QWEN_API_KEY}
OPENAI_API_KEY=${QWEN_API_KEY}
OPENAI_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1

# ── Platform Integrations (opsional) ──────────────────────
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN:-}
SLACK_BOT_TOKEN=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=

# ── Storage ───────────────────────────────────────────────
STORAGE_DIR=/app/storage
EOF

  # Update DB password di docker-compose
  sed -i "s/changeme/$DB_PASS/g" "$COMPOSE_FILE" 2>/dev/null || true

  success ".env dibuat (simpan password ini di tempat aman!)"
  echo -e "  DB Password : ${YELLOW}${DB_PASS}${NC}"
  echo -e "  JWT Secret  : ${YELLOW}${JWT_SECRET}${NC}"
else
  warn ".env sudah ada, dilewati"
fi

# ─── Firewall (UFW) ─────────────────────────────────────────────────────────
info "Mengkonfigurasi firewall UFW..."
ufw --force reset &>/dev/null
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 8000/tcp
ufw --force enable
success "Firewall aktif (SSH, HTTP, HTTPS, 8000)"

# ─── Jalankan aplikasi ──────────────────────────────────────────────────────
cd "$APP_DIR"

info "Menarik (pull) image Docker dari GHCR..."
docker compose pull

info "Menjalankan services..."
docker compose up -d

info "Menunggu database siap..."
sleep 10

info "Pushing database schema..."
docker compose exec ghost-relay bun run db:push 2>/dev/null || \
  warn "Schema push mungkin sudah berjalan otomatis saat startup"

# ─── Status akhir ───────────────────────────────────────────────────────────
PUBLIC_IP=$(curl -s --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || \
            curl -s --max-time 5 http://100.100.100.200/latest/meta-data/eipv4 2>/dev/null || \
            curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "<IP_SERVER>")

echo ""
echo -e "${GREEN}=========================================="
echo -e "  ✅ Ghost Relay berhasil di-deploy!"
echo -e "==========================================${NC}"
echo -e "  🌐 URL Akses  : http://${PUBLIC_IP}:8000"
echo -e "  📊 Status     : docker compose ps"
echo -e "  📋 Logs       : docker compose logs -f"
echo ""
echo -e "${YELLOW}  Catatan Penting:${NC}"
echo -e "  - Pastikan Security Group ECS membuka port 8000, 80, 443"
echo -e "  - Untuk HTTPS, ikuti panduan di docs/deployment.md"
echo -e "  - Simpan password database dan JWT Secret dengan aman!"
echo ""
