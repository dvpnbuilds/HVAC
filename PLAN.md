# hvac-lead-desk — Plan (approved 2026-07-05)

## Vision
A demo-ready, modular lead intake and AI triage app for small-to-medium HVAC shops that mostly run on pen-and-paper and Facebook/WhatsApp messages. Every inquiry lands in one place, AI flags emergencies and cleans messy customer input into service notes, and replies are pre-written for the operator. Built to be rebranded and deployed per client (one-time setup + small monthly hosting/AI fee, or client-owned hosting/API key).

## Core features (v1)
- Public lead intake form — name, phone/email, location, service type, issue description, urgency, preferred schedule; mobile-first, brandable via client.config.ts
- AI triage — issue classification, emergency detection (keyword fast-path + LLM, operator override), recommended next action, urgency SLA hint, clean service notes; raw input stored and shown alongside
- Admin dashboard — lead list with hot/emergency flags, status workflow (new → contacted → scheduled → closed), AI summaries, pending follow-ups; dead simple and phone-friendly
- Follow-up draft assistant — quote follow-up, booking confirmation, "need more details", maintenance reminder; each in email + SMS/WhatsApp variants; copy/mailto only
- Action log — per-lead timeline: submitted, triaged, status changes, drafts generated
- Demo seed data — ~20 realistic leads including a vague 9pm message the AI flags as a same-night emergency

## Deferred (not v1)
- Customer-facing chatbot — liability + scope; static FAQ page instead
- Email/SMS sending — copy/mailto suffices for demo
- Multi-tenant accounts/billing — per-client redeploy instead
- Scheduling integration, payments — out of scope

## Stack
Next.js (App Router) + TypeScript, Prisma (SQLite → Postgres on Vercel), Tailwind + shadcn/ui, Anthropic API, Vercel. One codebase, one deploy, brandable via a single config file — right for a clone-per-client demo product.

## Phases

### Phase 1: Scaffold + data model
- Scope: Next.js app, Prisma schema (Lead, TriageResult, FollowUpDraft, ActionLog), client.config.ts branding system, seed script skeleton.
- Done when: `npm run dev` boots with config-driven branding on a placeholder page; `npx prisma migrate dev` creates all four tables; seed script inserts and reads back one lead; repo layer functions exist with tests.

### Phase 2: Lead intake form
- Scope: public intake page with validation, writes Lead + ActionLog, success state with SLA expectation message.
- Done when: submitting valid input creates Lead + "submitted" ActionLog row; invalid input shows field errors and creates nothing; page renders branded and usable at 375px.

### Phase 3: AI triage pipeline
- Scope: lib/ai triage — classification, emergency detection (keyword fast-path + LLM), SLA hint, service-note summary; zod-validated structured output; stores TriageResult; graceful degradation without API key; eval set of 10–15 inputs.
- Done when: new lead triggers triage and stores structured result; all evals pass including zero missed emergencies on gas/CO/smoke cases; missing API key leaves lead intact with "pending" triage; raw input preserved verbatim.

### Phase 4: Admin dashboard
- Scope: /admin behind env-based login — lead list with emergency flags and filters, status workflow, lead detail (raw input vs AI summary side by side, timeline), operator override of emergency flag.
- Done when: all seeded leads listed with correct flags; status changes persist and log; detail view shows raw + summary + full timeline; override works and logs; usable at 375px.

### Phase 5: Follow-up drafts
- Scope: four draft types × email/SMS variants, generate/edit/copy (and mailto for email), stored as FollowUpDraft, logged to timeline.
- Done when: each of the 8 type/variant combos generates from lead context; drafts editable and copyable; every generation logged; SMS variants under 300 chars and casual in tone.

### Phase 6: Demo polish
- Scope: full seed data (~20 leads incl. the 9pm missed-lead story), static FAQ page from config, empty states, "regenerate triage" button.
- Done when: one seed command produces a full, convincing dashboard; FAQ renders from client.config.ts; empty DB shows helpful empty states; regenerate triage works live and logs.

## Risks / open decisions
- API key per deployment: client-owned key vs proxied through DV — decide per client at setup.
- Emergency detection eval must pass before any live demo.
- Pricing model (one-time + small monthly vs client-owned hosting) doesn't affect code; config supports both.
