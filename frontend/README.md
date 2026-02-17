# NT-2 v3 SPA (frontend)

React SPA for NT-2 v3. Communicates with the Django API (see repo root).

## Requirements

- Node.js LTS
- [pnpm](https://pnpm.io/) (package manager). Dependencies are stored in pnpm’s **global store** (e.g. `~/.pnpm-store`); no store is created inside this project directory.

## Install

```bash
pnpm install
```

## Scripts

| Command       | Description                |
| ------------- | -------------------------- |
| `pnpm dev`    | Start Vite dev server      |
| `pnpm build`  | Type-check and production build |
| `pnpm preview`| Preview production build  |
| `pnpm lint`   | Run ESLint                 |

## Running locally

1. Start the backend on port 8000 (from repo root or `backend/`).
2. From `frontend/`: run `pnpm dev`. The app runs at e.g. `http://localhost:5173`.
3. The Vite dev server proxies `/api` to `http://localhost:8000`, so API calls go to the Django backend without CORS.

For production (or without the proxy), set `VITE_API_URL` to the full API base URL (no trailing slash). See [.env.example](.env.example).

## Stack

- **Build:** Vite 7 + React 19 (TypeScript)
- **Server state / API:** TanStack Query
- **UI:** shadcn/ui + Tailwind CSS + Lucide icons
- **Routing:** React Router v7

See [v3/adr-002-frontend-stack.md](../v3/adr-002-frontend-stack.md) for rationale and alternatives.
