# Claude Collaboration Record — Todo Application

**Module:** COMS3011A Lab 1
**Tool:** Claude-Desktop
**Models:** Claude Sonnet 5 (planning, backend, UI), Claude Opus 5 (testing, documentation)
**Period:** 30 July 2026 – 11 August 2026

---

## About this document

**This is a compiled record, not a machine-generated export.** It was assembled
from the working conversation at the end of the project. Passages marked
**[verbatim]** are the author's own messages, reproduced word for word.
Claude's contributions are **summarised**, with short quoted fragments where the
exact wording matters.

It is presented as a record of the collaboration and of the decisions taken, not
as an unedited transcript.

---

## Phase 1 — Project planning and setup (30 July)

### 1.1 Opening instructions to the AI **[verbatim]**

> "I am a Computer Science student working on COMS3011A Lab 1. I want you to act
> as a senior software engineer mentoring a junior developer, not as a code
> generator.
>
> Important constraints:
> * Explain your reasoning before generating code.
> * Do not generate the entire project at once.
> * Only complete the current milestone.
> * If there are multiple valid approaches, explain the trade-offs and recommend one.
> * If I ask questions, answer them before continuing.
> * Assume I want to understand every decision because I may be asked to explain
>   my implementation during assessment."

The same message specified the stack (Next.js, SQLite, Node.js, GitHub), the full
feature list, and: *"Please stop after each major step and wait for my
confirmation before continuing. Do not generate UI components, API routes or
React pages yet."*

### 1.2 Project scaffolding

**Claude proposed** `create-next-app` with TypeScript, ESLint, `src/` directory,
App Router and the default import alias, and raised Tailwind as a genuine
trade-off rather than a default, recommending against it since the session was
backend-focused.

**Decision:** accepted, Tailwind declined. Command run:

```
npx create-next-app@latest todo-app --typescript --eslint --no-tailwind --src-dir --app --import-alias "@/*"
```

**Shipped:** `package.json`, `tsconfig.json`, `src/app/`.

### 1.3 Cleaning up unwanted generated files

`npx prisma init` created `.claude/`, `.windsurf/`, `.agents/` and
`skills-lock.json` — AI-assistant integration files unrelated to the application.
These were identified and deleted before the first Prisma commit.

**Shipped:** none of those directories exist in the repository.

### 1.4 Correcting the AI on the Prisma client — **rejected output** **[verbatim]**

Claude supplied a `PrismaClient` singleton using `new PrismaClient()` with no
arguments. This is the pattern for the older `prisma-client-js` generator and
produced a TypeScript error against the generator actually in use.

> "I'm using the new Prisma generator:
>
> ```
> generator client {
>   provider = "prisma-client"
>   output = "../src/generated/prisma"
> }
> ```
>
> The singleton code you provided appears to be for the older `prisma-client-js`
> generator. My import now works with:
>
> ```
> import { PrismaClient } from "@/generated/prisma/client";
> ```
>
> but `new PrismaClient()` is still producing a TypeScript error.
> Please provide the correct singleton implementation for the new `prisma-client`
> generator, compatible with Prisma 6+, and explain why the constructor differs
> (if it does). Do not switch me back to `prisma-client-js`; I want to keep using
> the new generator."

**Claude's corrected response (summary):** checked the current Prisma
documentation, acknowledged the error, and explained that the new generator ships
without a bundled query engine and therefore requires a driver adapter passed to
the constructor. Supplied a corrected implementation using
`PrismaBetterSqlite3`.

**Decision:** installed `@prisma/adapter-better-sqlite3` and
`@types/better-sqlite3`; applied the corrected singleton; confirmed the
TypeScript error cleared.

**Shipped:** `src/lib/prisma.ts`, `package.json`.

### 1.5 Task model design

**Claude proposed** a `Task` model with reasoning per field, notably: `status` as
a constrained enum but `topic` as free text; `archived` as a boolean flag
separate from status; and **no `overdue` field**, on the grounds that overdue
depends on the relationship between `dueDate` and the current time and would
require rewriting rows as time passes.

**Decision:** accepted as proposed.

**Shipped:** `prisma/schema.prisma`,
`prisma/migrations/20260730193211_init/migration.sql`.

### 1.6 Verification before writing application code

Database location was confirmed by running `Get-ChildItem -Name *.db` rather than
assumed (`dev.db` is at the project root, not inside `prisma/`). The schema was
verified in Prisma Studio — `Task` table present, correct columns, zero rows —
before any application code was written.

**Shipped:** `.gitignore` entry `/dev.db`; `README.md` documents the root location.

---

## Phase 2 — Backend foundation (31 July – 3 August)

### 2.1 Instructions for the session **[verbatim]**

> "For this session I ONLY want to build the backend data-access layer.
> Please follow these rules:
> • Explain your reasoning before generating code.
> • Work in small milestones.
> • Stop after each milestone and wait for my confirmation.
> • Explain why each new file exists.
> • Explain how the files interact.
> • If there are multiple approaches, explain the trade-offs and recommend one."

### 2.2 Architecture

**Claude proposed** a layered design — validation → services → route handlers —
arguing that business logic inside route handlers would be testable only by
simulating HTTP requests, and could not be reused by any non-HTTP caller.

**Decision:** accepted and enforced for the remainder of the project.

**Shipped:** `src/validation/`, `src/services/`, `src/app/api/`.

### 2.3 Declining files with no consumer — **deferred output** **[verbatim]**

Claude proposed creating `src/types/task.ts` and `src/utilities/isOverdue.ts`
several milestones before anything used them.

> "I like the reasoning behind `TaskWithOverdue`, especially reusing Prisma's
> generated `Task` type instead of redefining it. However, since nothing consumes
> this type yet, I'd prefer to postpone creating `src/types/task.ts` until
> Milestone 5 when `getAllTasks()` actually computes and returns `isOverdue`. I'd
> like to keep the project free of unused code and create each file when it gains
> its first consumer."

**Claude's response (summary):** accepted, and applied the same reasoning to
`utilities/isOverdue.ts`, deferring that too.

**Shipped:** both files exist and are imported by `src/services/taskService.ts`.
No unused files were created.

### 2.4 Interrogating the design before accepting it **[verbatim]**

Before accepting `createTask`, two specific questions were put to the AI:

> "1. Since `status` is optional in `CreateTaskInput`, is relying on Prisma to
> ignore `undefined` values and apply the schema default (`TODO`) intentional?
> 2. Why is it safe to pass `CreateTaskInput` directly as `data: input` when Prisma
> defines its own `TaskCreateInput` type? I'd like to understand how those types
> are compatible."

**Claude's response (summary):** explained that Prisma distinguishes `undefined`
("use the default") from `null` ("set to NULL"), and that TypeScript's structural
typing makes `CreateTaskInput` acceptable because it satisfies every required
field of `TaskCreateInput`.

**Shipped:** `src/services/taskService.ts` — `createTask`.

### 2.5 Scoping a function deliberately **[verbatim]**

> "Since Prisma's `findMany()` supports options such as `orderBy` and `where`,
> should this milestone deliberately leave `findMany()` without any ordering or
> filtering so that sorting and filtering remain separate milestones later?
> I'd like to avoid implementing future requirements too early"

**Decision:** `getAllTasks()` shipped initially with no options, and gained
parameters only when the filtering and sorting milestones arrived.

**Shipped:** `src/services/taskService.ts` — `getAllTasks(archived, sortBy?)`.

### 2.6 Declining unassessed work — **rejected recommendation** **[verbatim]**

Claude recommended building a standalone verification script
(`scripts/verify-task-service.ts`).

> "Does the lab brief specifically require a standalone verification script, or is
> this your recommended engineering practice?"

and, after the answer:

> "If it is not part of the assessed requirements, I'd prefer to continue building
> the remaining required backend components first and verify functionality through
> those, unless there is a compelling reason not to."

**Claude's response (summary):** confirmed it was its own recommendation, not a
requirement, and stated the trade-off of skipping it.

**Decision:** deferred; effort redirected to required features.

**Shipped:** no `scripts/` directory exists in the repository.

### 2.7 Enforcing incremental delivery **[verbatim]**

Claude offered to implement the `POST` and `GET` route handlers together.

> "I'd like to continue with the same incremental workflow we've been using
> throughout the project.
> Let's implement the `POST` handler first, verify that it compiles correctly,
> commit it to Git, and only then move on to the `GET` handler."

**Shipped:** commits `0cedac6 Add POST /api/tasks route handler` and
`d398174 Add GET /api/tasks route handler` — separate commits, separate days.

### 2.8 `PATCH` versus `PUT`

**Claude proposed** `PATCH`, arguing that `PUT` implies full replacement, which
would force the client to resend unchanged fields and risk overwriting fields the
user never edited with a stale copy.

**Decision:** accepted. Recorded in the author's own words:

> "I agree that `PATCH` is more appropriate than `PUT` for this project because
> editing a task is naturally a partial update rather than replacing the entire
> task."

The author also agreed to omit a pre-emptive existence check and let Prisma's
`P2025` error propagate to the route handler for translation to `404`, noting this
"keeps us consistent with our existing policy that services don't catch Prisma
errors."

**Shipped:** `src/app/api/tasks/[id]/route.ts`.

### 2.9 Questioning file organisation **[verbatim]**

> "Since `taskIdSchema` validates a route parameter rather than a Task object, do
> you recommend keeping it inside `taskSchema.ts`, or would you separate route
> parameter validation into its own validation file? Which approach do you think
> is more appropriate for this project's current size, and why?"

**Claude's response (summary):** recommended keeping it colocated until a second
entity existed to justify the split.

**Shipped:** `src/validation/taskSchema.ts`.

### 2.10 Catching a requirement the AI missed — **author-identified defect** **[verbatim]**

> "I have compared our current Prisma schema against the official COMS3011A brief.
> The brief requires every task to have Title, Description, Due Date and Topic,
> but our current Task model has no description field. I think we should correct
> this before continuing with the remaining milestones."

**Claude's response (summary):** confirmed the gap, noted that `dueDate` was also
optional in the schema and asked whether it should be made required, and proposed
a layer-by-layer correction.

**Decision:** `description` added as required; `dueDate` deliberately kept
optional —

> "Let's keep `dueDate` optional for now because the brief doesn't explicitly
> require it to be non-null, but I agree we should add the missing `description`
> field since that's clearly part of the required task data model."

**Shipped:** `prisma/migrations/20260803104202_add_description_to_task/migration.sql`;
`description String` in `prisma/schema.prisma`; `description` in both Zod schemas;
`dueDate DateTime?` unchanged.

### 2.11 Archiving — challenging an implementation detail **[verbatim]**

> "Should `archiveTask()` first check whether the task is already archived, or
> should it simply execute `prisma.task.update({ where: { id }, data: { archived:
> true } })` every time?
> My instinct is to keep it simple and always set `archived: true`, relying on the
> fact that the operation is idempotent."

**Claude's response (summary):** agreed, noted that a pre-check also introduces a
check-then-act gap, and flagged that `@updatedAt` will still be bumped on a
repeat archive.

**Shipped:** `src/services/taskService.ts` — `archiveTask`;
`src/app/api/tasks/[id]/archive/route.ts`.

---

## Phase 3 — Frontend (4 August)

### 3.1 A reversed AI recommendation

Claude's initial frontend plan proposed that the task list Server Component
should fetch its own `GET /api/tasks` endpoint. The author did not accept this on
assertion, and required justification:

> "Explain why we should fetch through our API routes rather than directly calling
> the service layer."

**Claude's response (summary):** on checking current Next.js guidance, found that
fetching your own Route Handler from a Server Component is documented by the
framework's maintainers as a common mistake — it adds a network hop and forces an
absolute URL — and **reversed its own recommendation**.

**Decision:** `page.tsx` calls `getAllTasks()` directly; browser-side mutations
continue to use the API over HTTP.

**Shipped:** `src/app/page.tsx` (no `fetch`), versus
`src/components/CreateTaskForm.tsx` and `src/components/TaskItem.tsx` (both fetch).

### 3.2 Component design decisions

**Claude proposed and justified:** inline editing rather than a modal or a
separate `/tasks/[id]/edit` page (a separate page would have required a
"get task by id" read path that did not exist); a separate `EditTaskForm` rather
than parameterising `CreateTaskForm`; and the archive action as a plain button
inside `TaskItem` rather than a new component file.

**Decision:** all accepted after discussion.

**Shipped:** `src/components/TaskItem.tsx`, `src/components/EditTaskForm.tsx`.

### 3.3 Filtering and sorting via the URL

**Claude proposed** driving the archived view and sorting through URL search
params (`?archived=true&sortBy=topic`) read by the Server Component, rather than
client-side state, so views remain bookmarkable and reload-safe.

**Decision:** accepted, with the author specifying the exact behaviour required:

> "I'd also like the UI to preserve the current sort when switching between active
> and archived views. For example:
> * `/?sortBy=topic` → clicking "View archived tasks" should become
>   `/?archived=true&sortBy=topic`"

**Shipped:** `src/app/page.tsx` — `buildQueryString`.

### 3.4 Functionality written by the author, not the AI **[verbatim]**

> "I just added a clear sorting functionality, which you hadn't added, so I've
> tested it, and everything works well. I have also managed to test all the other
> features, and they work well too"

**Shipped:** `src/app/page.tsx` — the "Clear sorting" link, calling
`buildQueryString({ archived: showArchived })` with no `sortBy`.

### 3.5 Architectural review

The author requested a critical review of the finished application, asking Claude
to "be critical where appropriate, but only recommend changes that genuinely
improve the project" and to avoid suggesting features outside the brief.

Claude raised two observations: an asymmetry in error handling between the direct
service call and the route handlers, and duplicated submit-handling scaffolding
between the two form components. The author explained the first correctly in
their own words:

> "Because Server Components call the service layer directly. If an unexpected
> database error occurs, Next.js' error boundary handles it. Route Handlers are
> responsible for translating service exceptions into HTTP responses for API
> consumers"

**Decision:** neither was refactored, on the basis that both were deliberate
trade-offs and late refactoring of tested code carried more risk than benefit.

---

## Phase 4 — Testing (11 August, Claude Opus 5)

### 4.1 Instructions **[verbatim]**

> "I want us to implement this properly rather than simply creating superficial
> tests to satisfy the minimum number."

> "I do not want meaningless React render tests simply because they are easy."

### 4.2 Decisions taken

| Decision | Reasoning | Shipped |
| --- | --- | --- |
| Test the service layer | Route handlers only translate HTTP; behaviour lives in services, testable without a server | `tests/taskService.test.ts` |
| Vitest over Jest | Runs ESM and TypeScript natively, matching Prisma 7's ESM-first client | `vitest.config.ts` |
| Throwaway database | `src/lib/prisma.ts` falls back to `dev.db` when `DATABASE_URL` is unset, and Vitest does not load `.env` — without an override the suite would have run against real development data | `vitest.config.ts` |
| Schema rebuilt from migrations before each run | Guarantees the test schema is the shipped schema | `tests/globalSetup.ts` |
| Determinism | Explicit `now`; 2020/2999 dates; explicit sort; rows cleared between tests; sequential test files | `tests/*.test.ts` |
| Single command | `npm test` | `package.json` |

**Result:** 9 tests across 2 files, passing.

---

## Phase 5 — Documentation (11 August, Claude Opus 5)

### 5.1 Clean-clone defects found by the AI

Auditing the repository as a fresh clone surfaced two problems that would have
failed the functional walkthrough at step 1:

1. `.env` is gitignored and untracked, so `DATABASE_URL` is undefined on a clean
   clone and `prisma migrate deploy` has no datasource.
2. `src/generated/prisma` is gitignored with no `postinstall` hook, so every
   import of the generated client fails until `npx prisma generate` is run.

**Decision:** `.env.example` committed (with `!.env.example` added to
`.gitignore`), and `npx prisma generate` documented as a required step. Node
version derived from the installed packages (`next` requires `>=20.9.0`) rather
than assumed, and recorded in `engines` and `.nvmrc`.

Claude explicitly reported that it **could not execute** a clean-clone run in its
own environment and marked the verification as partial rather than claiming
success. **The author performed the clean-clone verification.**

**Shipped:** `README.md`, `.env.example`, `.nvmrc`, `package.json`, `.gitignore`.

---

## Summary of author interventions

| # | Intervention | Outcome in the repository |
| --- | --- | --- |
| 1 | Rejected an incorrect Prisma singleton and forbade downgrading the generator | `src/lib/prisma.ts` uses the driver adapter |
| 2 | Deferred two files until they had a consumer | No unused files; both now imported |
| 3 | Declined a verification script as unassessed | No `scripts/` directory |
| 4 | Required justification for an API-fetch recommendation, which was then reversed | `src/app/page.tsx` calls the service directly |
| 5 | Identified the missing `description` field against the brief | Migration `20260803104202` |
| 6 | Kept `dueDate` optional against a proposed change | `dueDate DateTime?` |
| 7 | Forced route handlers into separate commits | Commits `0cedac6`, `d398174` |
| 8 | Wrote the "Clear sorting" control unprompted | `src/app/page.tsx` |
| 9 | Performed all testing and the clean-clone verification | 9 passing tests; verified setup |

---

AI Declaration: The preceding document was generated with the assistance of the
following: Claude-Desktop[Claude Opus 5]
