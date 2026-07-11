# Ghost Relay — Frontend

React 19 SPA dengan TanStack Router, Tailwind CSS v4, dan shadcn/ui.

## Development

```bash
bun install
bun dev
```

Frontend runs on http://localhost:5173 with API proxy to backend at port 8000.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 8
- **Routing**: TanStack Router (type-safe)
- **Server State**: TanStack Query v5
- **Client State**: Zustand v5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Real-time**: Socket.io-client

## Structure

```
src/
├── routes/          # TanStack Router pages
├── components/      # UI components (shadcn/ui, ai-elements)
├── hooks/           # TanStack Query hooks
├── stores/          # Zustand stores (auth, ui)
├── lib/             # API client, socket, utilities
└── integrations/    # shadcn/ui components
```
