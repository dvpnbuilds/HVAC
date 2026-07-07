# hvac-lead-desk

Demo-ready, modular lead intake + AI triage app for small-med HVAC shops. Built to be rebranded and redeployed per client — all branding lives in `client.config.ts`.

## Stack
- Next.js 15 (App Router) + TypeScript
- Prisma ORM — SQLite locally, Postgres on Vercel (provider swap via env)
- Tailwind CSS + shadcn/ui
- Anthropic API (claude-haiku for triage + follow-up drafts)
- Deploy target: Vercel

## Commands
- `dev`: npm run dev
- `test`: npm test
- `build`: npm run build
- `db`: npx prisma migrate dev / npx prisma db seed

## Conventions
- App Router, server components by default; client components only where interactive.
- All DB access through `lib/repo/` functions — no Prisma calls in components or routes.
- All AI calls through `lib/ai/` with zod-validated structured output. Never trust raw LLM output.
- Every mutation (lead created, status change, triage run, draft generated) writes an ActionLog row.
- Branding, service area, service types, FAQ content read ONLY from `client.config.ts` — never hardcode a shop name or color.
- Mobile-first: the admin dashboard must work on a phone. Test at 375px width.

## Workflow
- Read PLAN.md for scope and phases; PROGRESS.md for current state; RULES.md before writing code.
- Work strictly one phase at a time. After finishing a phase, run the audit-phase skill.

## Key context
- Raw customer input is sacred: store it verbatim on Lead and always render it alongside the AI summary.
- Emergency detection = keyword fast-path (gas, smoke, sparks, CO, burning smell) that flags immediately, PLUS LLM judgment. Operator can always override. The eval set in `lib/ai/evals/` must pass before any live demo — a missed gas-smell emergency kills the pitch.
- Follow-up drafts: two variants each — email (semi-formal) and SMS/WhatsApp (short, casual). v1 is copy-to-clipboard / mailto only, no sending integration.
- No auth complexity in v1: single admin login (env-based credentials) protecting /admin.
- ANTHROPIC_API_KEY per deployment; a missing key must degrade gracefully (lead saved, triage marked "pending — AI unavailable"), never block intake.
