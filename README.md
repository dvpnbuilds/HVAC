# hvac-lead-desk

Lead intake + AI triage app for small-med HVAC shops. Public form captures leads, AI flags emergencies and drafts follow-ups, admin dashboard runs the workflow. Branding rebrandable per client via `client.config.ts`.

## Stack
Next.js 15 (App Router) + TypeScript · Prisma + Postgres (driver adapter `@prisma/adapter-pg`) · Tailwind + shadcn/ui · Anthropic API (claude-haiku) · Vercel.

## Features
- **Intake form** (`/`) — public, mobile-first, validated, writes `Lead` + ActionLog.
- **AI triage** — keyword fast-path (gas/smoke/spark/CO/burning) + LLM classification, zod-validated. No API key → lead saved, triage marked "pending" (never blocks intake).
- **Admin dashboard** (`/admin`, env-login protected) — lead list w/ emergency filter, status workflow (new→contacted→scheduled→closed), raw input vs AI summary, operator emergency override, regenerate-triage button, full per-lead timeline.
- **Follow-up drafts** — 4 types × email/SMS, generate/edit/copy/mailto, template fallback if AI unavailable.
- **FAQ page** (`/faq`) — renders from `client.config.ts`.

## Setup
```
npm install
cp .env.example .env   # set DATABASE_URL (Postgres), ANTHROPIC_API_KEY, ADMIN_USERNAME/PASSWORD/SESSION_SECRET
npx prisma migrate dev
npx prisma db seed     # 20 demo leads
npm run dev
```

Needs a real Postgres instance (Vercel Postgres, Neon, Supabase, or local) — SQLite is no longer supported.

## Deploy (Vercel)
1. Provision a Postgres DB (Vercel Postgres / Neon) and set `DATABASE_URL` in Vercel env vars, plus `ANTHROPIC_API_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
2. Run `npx prisma migrate deploy` against that DB before or during first deploy (e.g. via a Vercel build step or manually).
3. Deploy — `postinstall` runs `prisma generate` automatically after `npm install`.

## Conventions
- All DB access via `lib/repo/`, all AI calls via `lib/ai/` — never called directly from components/routes.
- Raw customer input stored verbatim, never overwritten by AI.
- Every mutation writes an `ActionLog` row.
- No hardcoded branding — `client.config.ts` only.

## Project docs
`PLAN.md` — phases/scope · `PROGRESS.md` — build/audit status · `RULES.md` — build rules.
