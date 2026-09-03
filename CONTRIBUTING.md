# Contributing to BA Coach Pro

Thanks for considering a contribution! BA Coach Pro is an open-source,
AI-powered business-analysis coaching platform, and contributions of all
kinds are welcome — code, skill content, UX, docs and pedagogy.

## Ways to contribute

- **Skill content** — improve or extend the 53-skill pack in `src/data/skills-data.ts`
  (purpose, use-when, procedure, outputs, guardrails must stay crisp and coachable).
- **Coach behaviour** — tune the persona compiler in `src/lib/coach-prompt.ts`
  (modes: coach, skill, interviewer, feedback). Keep the debrief format strict —
  graders and students rely on its shape.
- **Platform code** — Next.js 16 App Router + TypeScript + Prisma. Keep every
  data query scoped to `studentId`; this invariant is the security model.
- **Docs & screenshots** — the README screenshots live in `docs/screenshots/`.

## Ground rules

1. **Security invariants are non-negotiable**
   - Every `/api/*` route must authenticate via `getAuthedStudent()` and scope
     all reads/writes by `studentId`.
   - Never log, return or persist a student's GitHub token anywhere except the
     `Student.githubToken` column.
   - Never render another student's data. Ever.
2. **No new dependencies for their own sake** — the stack is intentionally lean.
3. **LLM outputs must be schema-validated** (see `extractJson` patterns in the
   quiz/flashcard routes) before touching the database.
4. **Sync must stay rate-limit friendly** — new auto-sync triggers should go
   through `triggerSync()`, which serialises and coalesces per student.

## Dev workflow

```bash
bun install
bun run db:push        # sync Prisma schema to SQLite
bun run dev            # http://localhost:3000
bun run lint           # eslint
bunx tsc --noEmit      # typecheck
```

## Submitting

1. Fork → feature branch (`feat/…`, `fix/…`).
2. Keep PRs focused; one behaviour change per PR.
3. Describe the student-visible impact in the PR body.
4. Ensure lint + typecheck pass.

## License

By contributing you agree that your contributions are licensed under the
repository's [MIT License](LICENSE).
