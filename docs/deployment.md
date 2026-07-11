# Alibaba Cloud ECS Deployment Guide 🚀

This document outlines the comprehensive steps to deploy the **Ghost Relay** application to an Alibaba Cloud ECS (Elastic Compute Service) instance.

---

## 🏗️ 1. ECS Instance Provisioning (Alibaba Cloud)

1. **Operating System Selection**: 
   - Use **Ubuntu 22.04 LTS** or **Debian 11/12** (x86_64 Architecture).
2. **Recommended Hardware Specifications**:
   - Minimum: 2 vCPUs, 2 GB RAM (Free Trial instance types or general purpose ecs.g6 / compute ecs.c6).
3. **Security Group (Firewall) Inbound Rules**:
   - Add the following inbound rules to your ECS Security Group:
     | Port | Protocol | Source | Description |
     |------|----------|--------|-------------|
     | `22` | TCP | `0.0.0.0/0` | SSH Access |
     | `80` | TCP | `0.0.0.0/0` | HTTP (Certbot & Nginx) |
     | `443` | TCP | `0.0.0.0/0` | HTTPS (Nginx SSL) |
     | `8000` | TCP | `0.0.0.0/0` | Direct Application Access (Optional) |

---

## 🔑 2. Obtain AI Provider API Keys

Ghost Relay supports multiple AI providers. Configure at least one of the following:

| Provider | Console | Env Variable |
|----------|---------|--------------|
| OpenAI | [platform.openai.com](https://platform.openai.com) | `OPENAI_API_KEY` |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | `GEMINI_API_KEY` |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) | `ANTHROPIC_API_KEY` |
| Alibaba Qwen | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) | `DASHSCOPE_API_KEY` |

Save the selected API key in your `.env` configuration.

---

## ⚡ 3. Execute the Automated Deployment Script

An automated script `deploy-aliyun.sh` is provided in the repository to handle dependencies installation (Docker, Node, etc.), code cloning, env file setup, and app startup.

1. Connect to your ECS instance via SSH:
   ```bash
   ssh root@<ECS_PUBLIC_IP>
   ```
2. Download and run the automated script:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/crediblemark-official/Ghost-Relay/master/deploy-aliyun.sh -o deploy-aliyun.sh
   # Or if you have cloned the repository manually:
   # sudo bash /opt/ghost-relay/deploy-aliyun.sh
   
   sudo bash deploy-aliyun.sh
   ```
3. The script will interactively request your **GitHub Repository URL**, **Admin Email**, and **Qwen API Key (DashScope)**.

---

## 🔒 4. Domain & HTTPS Setup (Critical for Webhooks)

To support platform integrations (Telegram webhooks, WhatsApp connections, Slack events), your server **must** be served over HTTPS with a valid SSL certificate.

### Step A: Configure DNS A-Record
Point your domain or subdomain (e.g., `ghost.yourdomain.com`) to your ECS Instance Public IP using your DNS Manager (Alibaba Cloud DNS or Cloudflare).

### Step B: Install Nginx and Certbot
1. Install Nginx and Certbot on your host machine:
   ```bash
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```
2. Create Nginx site block `/etc/nginx/sites-available/ghost-relay`:
   ```nginx
   server {
       listen 80;
       server_name ghost.yourdomain.com; # Replace with your domain

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
3. Enable configuration block and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ghost-relay /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step C: Obtain Let's Encrypt SSL Certificate
Run Certbot to request and configure SSL automatically on Nginx:
```bash
sudo certbot --nginx -d ghost.yourdomain.com
```
Follow the interactive prompts. Certbot will update Nginx config to automatically redirect all HTTP traffic to HTTPS.

---

## 🛠️ 5. Server Management & Maintenance

Run the following commands inside `/opt/ghost-relay` directory:

- **Check container statuses**:
  ```bash
  docker compose ps
  ```
- **Stream server logs**:
  ```bash
  docker compose logs -f
  ```
- **Stop application**:
  ```bash
  docker compose down
  ```
- **Perform updates (Pull code & Rebuild)**:
  ```bash
  git pull
  docker compose build --no-cache
  docker compose up -d
  ```

---

## 💡 Troubleshooting

### Containers fail to start due to Database not ready
- The default `docker-compose.yml` config includes database healthchecks. If the application service times out waiting for Postgres, manually restart it:
  ```bash
  docker compose restart ghost-relay
  ```

### AI API Key Error
- Check that the API keys in `.env` are valid. Search backend logs for AI provider errors:
  ```bash
  docker compose logs ghost-relay | grep ai
  ```
