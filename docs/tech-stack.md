# Tech Stack — Ghost Relay

## Architectural Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React SPA)                         │
│   TanStack Router · TanStack Query v5 · Zustand v5                  │
│   shadcn/ui · Tailwind CSS v4 · Socket.io-client                    │
│   Vite · TypeScript 6.x                                              │
└──────────────────────────────────────────────────────────────────────┘
                              │
                  REST + WebSocket (Socket.io)
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Modular Monolith)                        │
│   Fastify v5 · Socket.io · TypeScript 6.x · Bun / Node.js 22+        │
│                                                                      │
│   Modules:       │   Core:                    │   Plugins:           │
│   ─────────      │   ──────────               │   ─────────          │
│   auth           │   AI (Vercel AI SDK)       │   auth (JWT)         │
│   messages       │   Encryption (AES-256-GCM) │   socket (WS auth)   │
│   voice          │   EventBus                  │                      │
│   files          │   TaskQueue (BullMQ/Redis) │                      │
│   platforms      │   Vector Store (pgvector)  │                      │
│   memory         │   Chat SDK (@chat-adapter) │                      │
│   reports        │   Memory Store             │                      │
│   ai             │                             │                      │
│   webhook        │                             │                      │
│   settings       │                             │                      │
└──────────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐
│   PostgreSQL     │ │   Redis          │ │  External APIs           │
│   (Prisma ORM)   │ │   (BullMQ,       │ │                          │
│   + pgvector     │ │    Chat SDK)     │ │  · OpenAI-compatible LLM │
│                  │ │                  │ │  · WhatsApp (Baileys)    │
│                  │ │                  │ │  · Telegram Bot API      │
│                  │ │                  │ │  · Slack Events API      │
│                  │ │                  │ │  · models.dev catalog    │
└──────────────────┘ └──────────────────┘ └──────────────────────────┘
```

---

## Frontend Stack

| Component | Technology | Rationale |
|----------|---------|--------|
| **Framework** | React 19 + TypeScript 6.x | Largest ecosystem, modern features, React Compiler ready |
| **Build Tool** | Vite 8.x | Extremely fast build times, instant HMR |
| **Routing** | TanStack Router | Full type safety (routes, path params, search params) |
| **Server State** | TanStack Query v5 | Automated caching, background refetching, and loading states |
| **Client State** | Zustand v5 | Lightweight, simple state management, slice pattern support |
| **UI Library** | shadcn/ui + Tailwind CSS v4 | Highly customizable, modern, accessible design system |
| **Icons** | Lucide React | Clean, scalable vector icons library |
| **WebSocket** | Socket.io-client | Automatic connection retries, fallback to long-polling |
| **AI Components** | ai-elements (48 components) | Message components, Conversation lists, PromptInputs, CodeBlocks |
| **Markdown Rendering** | Streamdown (CJK, code, math, mermaid) | Extensible markdown parser for streaming output |
| **Syntax Highlighting** | Shiki | Theme-supported server-side/client-side code syntax highlighter |
| **Forms** | TanStack Form + Zod | Headless form manager, type-safe validation |

---

## Backend Stack

| Component | Technology | Rationale |
|----------|---------|--------|
| **HTTP Framework** | Fastify v5 | Async-first, high performance, structured plugin architecture |
| **Language** | TypeScript 6.x + Node.js 22+ | Full type-safety, ESM compatibility |
| **Runtime** | Bun (development & workspace manager) | High performance runtime, native monorepo workspace support |

### Database & Storage

| Component | Technology |
|----------|---------|
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma 6.x |
| **Vector Store** | PostgreSQL `pgvector` extension |

### AI / LLM Integration

| Component | Technology |
|----------|---------|
| **AI SDK** | Vercel AI SDK (`ai` v4) |
| **Models** | Alibaba DashScope Qwen, models.dev APIs |
| **Audio Processing** | Custom Qwen STT ASR flash APIs |
| **Catalog** | models.dev catalog integration for dynamic discovery |

### Task Queue & Messaging

| Component | Technology |
|----------|---------|
| **Background Queue** | BullMQ (Redis) |
| **Fallback Queue** | In-memory `setImmediate` local queue |
| **Redis Client** | ioredis |

### Real-Time Services

| Component | Technology |
|----------|---------|
| **WS Server** | Socket.io (Node.js) |
| **WS Client** | Socket.io-client |

### Chat Connection Adapters

| Platform | Library / Core |
|----------|---------|
| **Telegram** | Bot API bot integrations |
| **WhatsApp** | Baileys multi-device connection library |
| **Slack** | Slack Bolt Node SDK |

### Auth & Security

| Component | Technology |
|----------|---------|
| **Auth framework** | Better Auth + Prisma Adapter |
| **Data Encryption** | AES-256-GCM (Node.js native crypto) |
| **JSON Web Tokens** | jsonwebtoken |
| **Rate Limiter** | `@fastify/rate-limit` |
| **CORS** | `@fastify/cors` |

---

## Monorepo Project Structure (Bun Workspaces + Turborepo)

```
ghost-team/
├── apps/
│   ├── backend/         # @ghost/backend — Fastify API server
│   │   └── src/
│   │       ├── core/         # AI models, encryption, vector memory, task queue, etc.
│   │       ├── modules/      # Domain modules (auth, messages, voice, etc.)
│   │       └── plugins/      # Fastify plugins (auth, socket)
│   └── frontend/        # frontend — React SPA
│       └── src/
│           ├── routes/       # TanStack Router files
│           ├── components/   # UI elements
│           │   ├── ui/           # Basic Primitives (buttons, inputs, cards)
│           │   ├── ai-elements/  # AI stream components
│           │   ├── chat/         # ChatBubble, ChatList, ChatInput
│           │   ├── settings/     # AIProviders, Platforms, Reports
│           │   ├── sidebar/      # ChannelList, KnowledgeVault
│           │   └── ...           
│           ├── hooks/        # React custom hooks (useMessages, useSocketEvents, useAiChat)
│           ├── stores/       # Zustand store modules (authStore, uiStore)
│           └── lib/          # API client instances, socket adapters
├── packages/
│   ├── database/        # @ghost/database — Prisma client and schema
│   │   ├── prisma/          # schema.prisma + migrations
│   │   └── src/             # Prisma extended database helper functions
│   ├── shared/          # @ghost/shared — Shared TypeScript interfaces & Zod schemas
│   └── config/          # @ghost/config — Zod-validated environment config
├── package.json         # Workspace root package definition
├── bun.lock             # Bun lockfile
└── turbo.json           # Turborepo task pipeline configuration
```

---

## Design Patterns

| Pattern | Description |
|------|-------------|
| **Modular Monolith** | Separate domain logics grouped under `modules/` in a single server process. Ready for migration to microservices if needed. |
| **Monorepo** | Bun workspaces and Turborepo caching for quick builds and shared types. |
| **Event-Driven** | In-process `EventBus` (Node.js EventEmitter) to decouple business modules. |
| **RAG Pipeline** | Pre-retrieval searching → Vector Search (pgvector) → Excerpt Context → LLM prompt generation. |

---

## Security Specifications

| Scope | Security Implementation |
|------|----------|
| **Credentials** | Encrypted using AES-256-GCM in PostgreSQL table. |
| **Authentication** | Session-based JWT verification handled by Better Auth plugin. |
| **Webhook Verification** | HMAC-SHA256 (WhatsApp, Slack) and secret token matching (Telegram). |
| **CORS Policy** | Allowed domains configured in environment variable checks. |

---

## Local Development Actions

```bash
# Install dependencies
bun install

# Run database push and setup
bun run db:push

# Launch local dev servers (Frontend & Backend simultaneously)
bun dev

# Run compilation check
bun run build

# Run linting checks
bun run lint
```
