# Rules
1. One phase at a time. Never start phase N+1 until phase N is audited-pass.
2. Update PROGRESS.md at the end of every session.
3. No new dependencies without noting them in the decision log.
4. Keep PLAN.md immutable after approval; scope changes go through DV and get logged.
5. Write tests for each phase's completion criteria before marking it built.
6. All DB access through lib/repo/ — no Prisma calls in components or API routes.
7. All AI calls through lib/ai/ with zod-validated output; handle malformed LLM responses explicitly.
8. Never hardcode shop name, colors, service area, or FAQ text — client.config.ts only.
9. Every mutation writes an ActionLog row. No silent state changes.
10. Raw customer input is stored verbatim and never overwritten by AI output.
11. AI failures degrade gracefully: intake must never fail because triage failed.
12. Emergency keyword fast-path (gas, smoke, sparks, CO, burning) flags a lead even if the LLM call fails.
13. Every admin screen must be usable at 375px width before a phase is marked built.
14. Never commit .env or API keys; .env.example documents required vars.
15. Run the triage eval set before any demo-related milestone; zero missed emergencies required.
