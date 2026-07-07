# Progress

Current phase: 1

## Phase 1: Scaffold + data model — audited-pass
Notes: Next.js+TS+Tailwind scaffold; client.config.ts branding read by placeholder page; Prisma schema (Lead, TriageResult, FollowUpDraft, ActionLog) migrated to SQLite via `@prisma/adapter-better-sqlite3` (Prisma 7 requires driver adapters, no plain `url`); repo layer (`lib/repo/leads.ts`, `lib/repo/actionLog.ts`) built TDD with vitest, tests pass; seed script (`prisma/seed.ts`) inserts a lead + action log and reads it back.
Audit: 2026-07-07 — PASS. Verified live: `npx next dev -p 3401` booted, page rendered "Summit HVAC Co." from client.config.ts (HTTP 200); grep confirmed no hardcoded shop name/color outside client.config.ts. `npx prisma migrate status` shows schema up to date, 1 migration (20260707090155_init) containing all 4 CREATE TABLE statements (Lead, TriageResult, FollowUpDraft, ActionLog). `npm test` (vitest): 2/2 tests passed (leads.test.ts, actionLog.test.ts). `npx prisma db seed` inserted and read back lead "Maria Lopez". No Prisma calls found in app/ outside generated client code. Deps logged in decision log below (rule 3 satisfied). .env.example documents DATABASE_URL only, .env gitignored. Minor non-blocking note: app/layout.tsx still has default Next.js scaffold metadata title ("Create Next App") — recommend switching to clientConfig.shopName in a later phase. All Phase 1 "Done when" criteria satisfied.

## Phase 2: Lead intake form — pending
Notes:
Audit:

## Phase 3: AI triage pipeline — pending
Notes:
Audit:

## Phase 4: Admin dashboard — pending
Notes:
Audit:

## Phase 5: Follow-up drafts — pending
Notes:
Audit:

## Phase 6: Demo polish — pending
Notes:
Audit:

## Decision log
- 2026-07-05: Plan approved. Portfolio demo first, modular per-client redeploy model. Knowledge Assistant chatbot cut from v1 (static FAQ instead).
- 2026-07-05: Stack: Next.js + TS, Prisma (SQLite→Postgres), Tailwind + shadcn/ui, Anthropic API, Vercel.
- 2026-07-07: Phase 1 deps added: `prisma`, `@prisma/client` (ORM per plan), `vitest` (test runner for repo-layer TDD), `@prisma/adapter-better-sqlite3` (Prisma 7 requires a driver adapter for SQLite, no more plain `url`), `tsx` (run TS seed script).
