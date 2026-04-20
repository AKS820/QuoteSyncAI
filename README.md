# QuoteSync AI

A Watson Orchestrate-powered quote validation solution for mid-market manufacturing companies. Autonomous AI agents keep your quoting system and ERP perfectly aligned — automatically.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- An Anthropic API key

### Option A — Docker Compose (recommended)

```bash
cp .env.example .env          # fill in ANTHROPIC_API_KEY
docker compose up --build
```

Frontend: http://localhost:5173  
Backend API: http://localhost:3000  
Analytics dashboard: http://localhost:5173/dashboard (password: `quotesync-admin`)

### Option B — Local development

```bash
# 1. Start postgres (or use your own instance)
# 2. Install and migrate backend
cd backend
cp .env.example .env          # edit DATABASE_URL, ANTHROPIC_API_KEY
npm install
npx prisma migrate dev --name init
npm run seed

# 3. Start mock services (separate terminals)
cd ../mock-sap && npm install && npm start   # port 3001
cd ../mock-cpq && npm install && npm start   # port 3002

# 4. Start backend
cd ../backend && npm run dev                 # port 3000

# 5. Start frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev                                  # port 5173
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for Quinn chatbot | Yes |
| `MOCK_SAP_URL` | URL for mock SAP service | No (default: `http://localhost:3001`) |
| `MOCK_CPQ_URL` | URL for mock CPQ service | No (default: `http://localhost:3002`) |
| `PORT` | Backend port | No (default: `3000`) |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | No (default: uses Vite proxy) |
| `VITE_VIDEO_PROBLEM` | YouTube video ID — "The Problem" tab | No |
| `VITE_VIDEO_SOLUTION` | YouTube video ID — "The Solution" tab | No |
| `VITE_VIDEO_RESULTS` | YouTube video ID — "Real Results" tab | No |
| `VITE_VIDEO_DEMO` | YouTube video ID — demo walkthrough | No |
| `VITE_VIDEO_SAP_SETUP` | YouTube video ID — SAP setup guide | No |
| `VITE_VIDEO_CPQ_SETUP` | YouTube video ID — CPQ setup guide | No |

## Swapping in Real SAP / CPQ Credentials

The mock services at `mock-sap/` and `mock-cpq/` are drop-in replacements. When you're ready for production:

1. Remove `mock-sap` and `mock-cpq` from `docker-compose.yml`
2. Update `MOCK_SAP_URL` and `MOCK_CPQ_URL` in the backend `.env` to point to real endpoints
3. Implement OAuth/API-key auth in `backend/routes/demo.js` under the `// TODO: real auth` comment

The backend demo proxy in `backend/routes/demo.js` is the single integration point — all frontend calls go through it.

## Architecture

```
frontend (React/Vite) :5173
    └── proxies /api/* → backend :3000
              ├── /api/events      — analytics event ingestion
              ├── /api/users       — user management / magic link auth
              ├── /api/roi         — ROI calculation storage
              ├── /api/auth        — magic link auth flow
              ├── /api/analytics   — dashboard data aggregation
              ├── /api/chat        — Claude AI chatbot (Quinn)
              └── /api/demo        — proxies to mock-sap :3001 + mock-cpq :3002
```

## Analytics Dashboard

Visit `/dashboard` and enter password `quotesync-admin`. Shows:
- Visitor funnel by stage
- Video engagement rates
- Demo run/completion counts
- ROI calculation averages
- Purchase intent counts by tier
- Recent AI chatbot questions

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion, Recharts
- **Backend**: Node.js 18, Express, Prisma ORM
- **Database**: PostgreSQL 15
- **AI**: Anthropic Claude API (claude-sonnet-4-6)
- **Auth**: Email magic links (passwordless)
- **Analytics**: Custom event tracking (no third-party SDKs)
