# AI Usage Transcript

**Module:** COMS3011A — Lab 1
**Project:** Local-first todo application (Next.js + SQLite)

> **Scope of this document.** This is an index and evidence summary for the AI
> conversation transcripts submitted alongside it. It does not replace them.
> Passages marked **verbatim** are quoted exactly from the conversation history;
> everything else is a labelled summary. No interaction described here has been
> reconstructed or invented.

---

## 1. Overview

**Tools and models used**

| Tool | Model | Used for |
| --- | --- | --- |
| Claude-Desktop | Claude Sonnet 5 | Planning, backend implementation (Prisma, services, validation, API route handlers) and the user interface |
| Claude-Desktop | Claude Opus 5 | Automated test design and implementation, project documentation, and review of the shipped architecture |

AI was used throughout this project as a design and implementation
assistant, under constraints I set before any code was written. The working
pattern was consistent across every feature:

1. I stated the milestone and the constraints.
2. Claude explained the design and the trade-offs **before** producing code.
3. I reviewed the reasoning, accepted, rejected or amended it.
4. I wrote/pasted the code into the project myself, compiled it, tested it in the
   browser or Postman, and committed it.
5. Only then did we move to the next milestone.

The project was **not** generated in bulk. The repository contains 32 commits
spread across 30 July – 11 August 2026, each a single coherent slice, which
reflects this milestone-by-milestone process rather than a one-shot generation.

---

## 2. Planning and Architecture

### 2.1 Constraints stated up front

Before any code existed, I opened the first session with explicit constraints
(**verbatim**):

> "I want you to act as a senior software engineer mentoring a junior developer,
> not as a code generator."

> "Explain your reasoning before generating code."
> "Do not generate the entire project at once."
> "Only complete the current milestone."
> "If there are multiple valid approaches, explain the trade-offs and recommend one."
> "Assume I want to understand every decision because I may be asked to explain my
> implementation during assessment."

These constraints were restated at the start of each subsequent phase (backend
foundation, frontend, testing, documentation).

### 2.2 Layered architecture

**Summary.** Claude proposed separating the application into validation →
services → route handlers → UI, arguing that putting business logic inside route
handlers would make it testable only by simulating HTTP requests, and would
prevent reuse from any non-HTTP caller.

**My decision.** Accepted, and enforced for the rest of the project. This
decision is what later made the test suite possible without a running server.

**Repository evidence:** `src/validation/taskSchema.ts`,
`src/services/taskService.ts`, `src/app/api/tasks/**`, `src/lib/prisma.ts`.

### 2.3 Database design decisions

**Summary.** Claude proposed and justified three schema decisions:

- `archived` as a boolean flag rather than deletion, so a task remains
  retrievable (the brief forbids deletion).
- `status` as a constrained enum (`TODO`, `IN_PROGRESS`, `DONE`) but `topic` as
  free text, on the basis that status is a fixed set and topic is user-supplied.
- **Overdue deliberately not stored** — no column, no status value. The argument
  given was that overdue depends on the relationship between `dueDate` and the
  current time, so storing it would require rewriting rows as time passes.

**My decision.** Accepted all three.

**Repository evidence:** `prisma/schema.prisma`,
`prisma/migrations/20260730193211_init/migration.sql`,
`src/utilities/isOverdue.ts`.

### 2.4 A design decision I made against the AI's initial suggestion

**Summary.** When designing the frontend, Claude's first recommendation was that
the task list Server Component should fetch its own `GET /api/tasks` endpoint. I
did not accept this on assertion — my standing constraint required the reasoning
to be explained first, and I asked explicitly why fetching through the API route
was preferable to calling the service layer directly.

On being required to justify it, Claude checked the current Next.js guidance,
found that fetching your own Route Handler from a Server Component is listed by
the framework's own maintainers as a common mistake (it adds a pointless network
hop and forces an absolute URL), and **reversed its own recommendation**.

**My decision.** I accepted the corrected approach: `page.tsx` calls
`getAllTasks()` directly; browser-side mutations still go over HTTP.

**Repository evidence:** `src/app/page.tsx` (imports `getAllTasks` from
`@/services/taskService`, no `fetch`), versus `src/components/CreateTaskForm.tsx`
and `src/components/TaskItem.tsx` (both `fetch` the API).

**Why this matters.** The error was caught because of a constraint I imposed —
"explain your reasoning before generating code" — not because the first answer
happened to be right.

---

## 3. Code Generation

Claude produced initial implementations, which I reviewed, compiled and tested
before committing. Each was scoped to a single milestone.

| Feature | What the AI proposed | Shipped file(s) |
| --- | --- | --- |
| Prisma client singleton | A shared `PrismaClient` cached on `globalThis` to survive Next.js Fast Refresh | `src/lib/prisma.ts` |
| Validation schemas | Zod schemas with types inferred via `z.infer`, so validation and TypeScript types cannot drift | `src/validation/taskSchema.ts` |
| Service functions | `createTask`, `getAllTasks`, `updateTask`, `archiveTask` — thin, framework-agnostic, no error catching | `src/services/taskService.ts` |
| Route handlers | HTTP translation only: parse, validate, call service, map to status code | `src/app/api/tasks/route.ts`, `src/app/api/tasks/[id]/route.ts`, `src/app/api/tasks/[id]/archive/route.ts` |
| Overdue rule | Pure function taking an injectable `now` parameter | `src/utilities/isOverdue.ts` |
| UI components | One Server Component page plus three Client Components for interactivity | `src/app/page.tsx`, `src/components/*.tsx` |

### 3.1 Code I wrote that the AI did not produce

The "Clear sorting" control on the task list was **not** part of the AI's
proposal. I identified that the sort links had no way to be reset, implemented
the additional link myself using the existing `buildQueryString` helper, and
tested it before committing.

**Repository evidence:** `src/app/page.tsx` — the fourth `<Link>` in the sort
controls, calling `buildQueryString({ archived: showArchived })` with no
`sortBy`.

---

## 4. Debugging and Problem Solving

### 4.1 Prisma client not generated automatically

**Problem.** After running `npx prisma migrate dev --name init`, the application
could not resolve `@/generated/prisma`.

**Investigation.** Rather than assume, I was asked to list the actual directory
contents. This showed `src/generated/prisma` did not exist — `migrate dev` had
not generated the client in this setup.

**Resolution.** Running `npx prisma generate` explicitly. This later became a
mandatory documented step, because the generated client is gitignored.

**Repository evidence:** `README.md` → Running It, step 5; `.gitignore` line
`/src/generated/prisma`.

### 4.2 Unexpected files created by `prisma init`

**Problem.** `npx prisma init` created `.claude/`, `.windsurf/`, `.agents/` and
`skills-lock.json` — AI-assistant integration files unrelated to the application.

**Resolution.** I removed all four before the first Prisma commit, so the
repository contains only files relevant to the project.

**Repository evidence:** none of these directories exist in the repository.

### 4.3 Database file location verified rather than assumed

**Problem.** It was unclear whether `dev.db` had been created inside `prisma/` or
at the project root, because Prisma 7 resolves the datasource URL differently
from earlier versions.

**Resolution.** I ran `Get-ChildItem -Name *.db` and confirmed it was at the
project root. The documentation reflects the verified location, not an assumption.

**Repository evidence:** `README.md` → "This creates `dev.db` in the project
root"; `.gitignore` entry `/dev.db`.

---

## 5. Human Review and Correction

This section records the instances where I rejected, corrected, constrained or
redirected the AI's output.

### 5.1 Rejecting an incorrect Prisma singleton implementation (primary example)

**AI interaction.** Claude produced a `PrismaClient` singleton for
`src/lib/prisma.ts` using `new PrismaClient()` with no arguments.

**The problem I identified.** This is the pattern for the older
`prisma-client-js` generator. My project uses Prisma 7's newer ESM-first
`prisma-client` generator, which ships without a bundled query engine and
therefore requires a driver adapter. The suggested code produced a TypeScript
error.

**My instruction (verbatim):**

> "The singleton code you provided appears to be for the older
> `prisma-client-js` generator. My import now works with:
> `import { PrismaClient } from "@/generated/prisma/client";` but
> `new PrismaClient()` is still producing a TypeScript error.
> Please provide the correct singleton implementation for the new `prisma-client`
> generator, compatible with Prisma 6+, and explain why the constructor differs
> (if it does). **Do not switch me back to `prisma-client-js`; I want to keep
> using the new generator.**"

**AI response after correction.** Claude checked the current Prisma documentation,
acknowledged the error, explained that the new generator requires a driver
adapter (`@prisma/adapter-better-sqlite3`) passed to the constructor, and
supplied a corrected implementation.

**My decision.** I installed `@prisma/adapter-better-sqlite3` and
`@types/better-sqlite3`, applied the corrected singleton, confirmed the
TypeScript error cleared, and committed it.

**Repository evidence:** `src/lib/prisma.ts` — constructs
`new PrismaBetterSqlite3({ url: ... })` and passes it as
`new PrismaClient({ adapter })`; `package.json` lists
`@prisma/adapter-better-sqlite3` as a runtime dependency.

**Why this demonstrates responsible AI usage.** I did not accept code that
compiled in the AI's model of the project but not in mine. I diagnosed the
version mismatch myself, and constrained the correction so that the fix could not
be a downgrade to the older generator.

### 5.2 Rejecting files that had no consumer

**AI interaction.** Claude proposed creating `src/types/task.ts` (a
`TaskWithOverdue` type) and `src/utilities/isOverdue.ts` several milestones
before anything used them.

**My instruction (verbatim):**

> "However, since nothing consumes this type yet, I'd prefer to postpone creating
> `src/types/task.ts` until Milestone 5 when `getAllTasks()` actually computes and
> returns `isOverdue`. I'd like to keep the project free of unused code and create
> each file when it gains its first consumer."

**My decision.** Both files were deferred until the overdue milestone, when they
gained a real consumer.

**Repository evidence:** `src/types/task.ts` and `src/utilities/isOverdue.ts`
exist and are both imported by `src/services/taskService.ts`. No unused files
were created.

### 5.3 Challenging work that was not an assessed requirement

**AI interaction.** Claude recommended building a standalone verification script
(`scripts/verify-task-service.ts`) to exercise the service layer before the API
existed.

**My instruction (verbatim):**

> "Does the lab brief specifically require a standalone verification script, or is
> this your recommended engineering practice?"

and subsequently:

> "If it is not part of the assessed requirements, I'd prefer to continue building
> the remaining required backend components first and verify functionality through
> those, unless there is a compelling reason not to."

**AI response.** Claude confirmed it was its own recommendation, not a
requirement, and stated the trade-off of skipping it.

**My decision.** Deferred. Effort went to required features instead.

**Repository evidence:** no `scripts/` directory exists in the repository.

### 5.4 Catching a schema field missing against the brief

**AI interaction.** The `Task` model designed with AI assistance contained
`title`, `topic`, `status`, `dueDate` and `archived` — but no `description`.

**What I identified (verbatim):**

> "I have compared our current Prisma schema against the official COMS3011A brief.
> The brief requires every task to have Title, Description, Due Date and Topic, but
> our current Task model has no description field."

**My decision.** I required the schema, migration and validation layers to be
corrected. I also independently decided **against** making `dueDate` non-nullable
at the same time, on the grounds that the brief does not require it.

**Repository evidence:**
`prisma/migrations/20260803104202_add_description_to_task/migration.sql`;
`description String` in `prisma/schema.prisma`; `description` present in both
`createTaskSchema` and `updateTaskSchema`; `dueDate` remains `DateTime?`.

### 5.5 Imposing incremental delivery over bulk generation

**Summary.** Where Claude offered to implement multiple items at once (for
example both the `POST` and `GET` route handlers together), I required them to be
split, compiled, committed and pushed separately (**verbatim**):

> "Let's implement the `POST` handler first, verify that it compiles correctly,
> commit it to Git, and only then move on to the `GET` handler."

**Repository evidence:** commits `0cedac6 Add POST /api/tasks route handler` and
`d398174 Add GET /api/tasks route handler` are separate commits on separate days.

---

## 6. Testing

**Constraint I set (verbatim):**

> "I want us to implement this properly rather than simply creating superficial
> tests to satisfy the minimum number."

> "I do not want meaningless React render tests simply because they are easy."

**Decisions taken, with reasoning:**

| Decision | Reasoning | Shipped file |
| --- | --- | --- |
| Test the **service layer**, not route handlers or React components | Route handlers only translate HTTP; the behaviour lives in the services. Testing services needs no server or HTTP simulation. | `tests/taskService.test.ts` |
| **Vitest** rather than Jest | Runs ESM and TypeScript natively, matching Prisma 7's ESM-first generated client; Jest would have required extra transform configuration. | `vitest.config.ts`, `package.json` |
| **Throwaway database** | `src/lib/prisma.ts` falls back to `file:./dev.db` when `DATABASE_URL` is unset, and Vitest does not load `.env`. Without an explicit override the suite would have silently run against my real development data. | `vitest.config.ts` (`env: { DATABASE_URL: "file:./test.db" }`) |
| Schema rebuilt from committed migrations before each run | Guarantees the test schema is exactly the shipped schema; cleanup happens at the **start** of a run so a previous crash cannot leave bad state. | `tests/globalSetup.ts` |
| **Determinism** | Overdue tests pass an explicit `now`; date-based service tests use 2020/2999; ordering asserted with an explicit `sortBy`; all rows deleted between tests; test files run sequentially so two files cannot truncate one SQLite file concurrently. | `tests/isOverdue.test.ts`, `tests/taskService.test.ts`, `vitest.config.ts` (`fileParallelism: false`) |
| **Archive and overdue coverage** | Required for full marks. The archive test asserts a task leaves the active list *and* remains in the archived list — the distinction between archiving and deleting. | `tests/taskService.test.ts` |
| **Single command** | `npm test` runs the whole suite once and exits. | `package.json` (`"test": "vitest run"`) |

**Tests are non-tautological by design:** the create test asserts values supplied
by the *database* (`status` default `TODO`, `archived` default `false`), and the
update test asserts that fields **not** included in a partial update remain
unchanged.

**Result:** 9 tests across 2 files, passing from `npm test`.

---

## 7. Documentation and Clean-Clone Verification

While preparing documentation, Claude audited the repository as though it had
just been cloned, and identified two defects that would have caused the
functional walkthrough to fail at step 1 ("the application installs and starts by
following the README alone").

| Issue found | Why it would have failed | Fix applied |
| --- | --- | --- |
| `.env` is gitignored and not tracked | `prisma.config.ts` reads `process.env["DATABASE_URL"]`, which is undefined on a clean clone, so `prisma migrate deploy` has no datasource | Added tracked `.env.example`, plus `!.env.example` in `.gitignore` so the `.env*` rule does not swallow it |
| `src/generated/prisma` is gitignored, and there is no `postinstall` hook | Every `@/generated/prisma/client` import fails on a fresh clone | `npx prisma generate` documented as a required setup step |

The Node version was **derived from the repository**, not assumed: `next` declares
`node >=20.9.0` and `vitest` declares `^20.0.0 || ^22.0.0 || >=24.0.0`. The
stricter floor, `>=20.9.0`, was recorded in `package.json` under `engines`, and
Node 22 pinned in `.nvmrc`.

Claude explicitly reported that it **could not execute** a full clean-clone run
(its sandbox has no package-registry access) and stated the verification status as
partial rather than claiming success. **I performed the clean-clone verification
myself** and confirmed the documented steps work.

**Repository evidence:** `README.md`, `.env.example`, `.nvmrc`, `.gitignore`,
`package.json` (`engines`).

---

## 8. Traceability to the Shipped Repository

| AI interaction | Decision | Repository file(s) | Current shipped state |
| --- | --- | --- | --- |
| Layered architecture proposed | Accepted | `src/validation/`, `src/services/`, `src/app/api/` | Three distinct layers; route handlers contain no Prisma calls |
| Prisma singleton (first attempt, wrong generator) | **Rejected and corrected by me** | `src/lib/prisma.ts` | Uses `PrismaBetterSqlite3` adapter passed to `new PrismaClient({ adapter })` |
| Archive as boolean flag, not deletion | Accepted | `prisma/schema.prisma`, `src/services/taskService.ts` | `archived Boolean @default(false)`; `archiveTask` sets it true; no delete function exists |
| Overdue derived, never stored | Accepted | `src/utilities/isOverdue.ts` | Pure function; no `overdue` column in any migration |
| `types/task.ts` / `isOverdue.ts` proposed early | **Deferred by me until they had a consumer** | `src/types/task.ts`, `src/utilities/isOverdue.ts` | Both exist and are imported by `taskService.ts` |
| Standalone verification script proposed | **Declined by me — not an assessed requirement** | — | No `scripts/` directory exists |
| Server Component fetching its own API route | **Reversed after I required justification** | `src/app/page.tsx` | Calls `getAllTasks()` directly; no `fetch` in the page |
| Missing `description` field | **Identified by me against the brief** | `prisma/migrations/20260803104202_...` | `description String` required in schema and both Zod schemas |
| `PATCH` over `PUT` for editing | Accepted after trade-off discussion | `src/app/api/tasks/[id]/route.ts` | `PATCH` handler; partial updates leave omitted fields unchanged |
| Sort/filter via URL search params | Accepted | `src/app/page.tsx` | `?archived=`/`?sortBy=` read from `searchParams` |
| "Clear sorting" control | **Written by me, not proposed by the AI** | `src/app/page.tsx` | Fourth link in the sort controls |
| Test strategy (service layer, throwaway DB) | Accepted | `tests/`, `vitest.config.ts` | 9 tests passing from `npm test` |
| Clean-clone defects (`.env`, `prisma generate`) | Accepted and fixed | `.env.example`, `.nvmrc`, `README.md` | Documented 7-step setup, verified by me |

---

## 9. AI Usage Reflection

AI was used as a development assistant. I retained responsibility for:

- **Requirements** — I checked the implementation against the brief and found a
  missing required field the AI had not caught.
- **Design decisions** — every architectural proposal was explained before code
  was written, and I accepted, deferred or rejected each one.
- **Reviewing generated code** — I read and compiled every file before committing;
  nothing was committed unread.
- **Testing** — I ran the application in the browser, tested every endpoint in
  Postman, ran the automated suite, and performed the clean-clone verification.
- **Debugging** — I reported actual compiler and CLI output rather than assuming
  the AI's suggestions worked, which is how the Prisma generator mismatch was
  found.
- **Correcting unsuitable suggestions** — documented in section 5.
- **Final implementation decisions** — including work the AI did not propose
  (the "Clear sorting" control) and work I chose not to build.

Where the AI was uncertain or lacked access to something (the official brief, my
repository, a live clean clone), it said so explicitly rather than inventing an
answer, and I supplied the missing information.

---

## 10. Rubric Evidence

- [x] **AI was used for planning** — architecture, layering, schema design, `PATCH`
      vs `PUT`, URL-driven filtering and sorting (sections 2, 8)
- [x] **AI was used for code generation** — services, validation, route handlers,
      components, tests (sections 3, 6)
- [x] **AI was used for debugging** — Prisma client generation, database file
      location, unexpected `prisma init` output (section 4)
- [x] **Constraints were stated** — quoted verbatim from the opening prompt and
      restated at each phase (section 2.1)
- [x] **At least one unsuitable/incorrect AI output was identified** — the
      `prisma-client-js` singleton, which produced a TypeScript error against the
      generator actually in use (section 5.1)
- [x] **I redirected/corrected the AI** — with an explicit constraint against
      downgrading the generator; further instances in sections 5.2–5.5
- [x] **AI decisions are traceable to shipped code** — full mapping table in
      section 8

---

## Appendix — Commit history as corroboration

The commit history independently corroborates the incremental process described
above: 32 commits from 30 July to 11 August 2026, each a single coherent change
(for example `Add task validation schema` → `Implement createTask service` →
`Add POST /api/tasks route handler` as three separate commits), rather than bulk
generation.

---

AI Declaration: The preceding document was generated with the assistance of the
following: Claude-Desktop[Claude Opus 5]
