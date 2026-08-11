# COMS3011A Lab 1 — Local-First Todo Application

A single-user todo application built with Next.js and SQLite. The application is
local-first: it is not deployed to the web, has no user accounts, and stores all
data in a SQLite file on the machine it runs on. Data persists across restarts.

**The three sections required by the brief are:**
[Third-Party Code](#third-party-code) · [Database Design](#database-design) · [Running It](#running-it)

---

## Features

- Create, edit and archive tasks. Each task carries a **Title**, **Description**,
  **Due Date** and **Topic**.
- Tasks cannot be deleted — only archived. Archived tasks leave the active list
  but remain viewable in a separate archived view.
- The task list can be sorted by **topic**, **status** or **due date**.
- Each task has exactly one of three fixed statuses: `TODO`, `IN_PROGRESS`,
  `DONE`. These are not user-customisable.
- A task whose due date has passed is flagged as overdue in the list. Overdue is
  **derived at read time** from the due date, archived flag and status — it is
  not stored in the database and it is not one of the three statuses.
- All data is stored in SQLite and survives stopping and restarting the app.

---

## Running It

### Node version

**Node.js 20.9.0 or newer is required.** The repository pins Node 22 (the
current LTS line) in `.nvmrc`, and `package.json` declares
`"engines": { "node": ">=20.9.0" }`.

That floor is not arbitrary — it is the strictest requirement of the installed
dependencies: Next.js 16 declares `node >=20.9.0`, and Vitest 4 declares
`^20.0.0 || ^22.0.0 || >=24.0.0`.

If you use `nvm`, run `nvm use` in the project root to switch to the pinned
version. Otherwise check your version with `node --version`.

### Setup from a clean clone

Run these commands in order from a terminal. Every step is required — the
repository does not ship `node_modules`, a `.env` file, a database file, or the
generated Prisma client, so all four are created here.

**1. Clone the repository and enter it**

```bash
git clone <repository-url>
cd todo-app
```

**2. Install dependencies**

```bash
npm install
```

**3. Create the environment file**

The application reads its database location from `DATABASE_URL`. A template is
committed as `.env.example`; copy it to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS / Linux:

```bash
cp .env.example .env
```

**4. Create the database and apply the schema**

```bash
npx prisma migrate deploy
```

This creates `dev.db` in the project root and applies the two committed
migrations in `prisma/migrations`.

**5. Generate the Prisma client**

```bash
npx prisma generate
```

The generated client is written to `src/generated/prisma` and is not committed
to the repository, so this step is required before the application will compile.

**6. Start the development server**

```bash
npm run dev
```

**7. Open the application**

Visit <http://localhost:3000>.

### Production build (optional)

```bash
npm run build
npm start
```

### Inspecting the database (optional)

```bash
npx prisma studio
```

---

## Testing

Run the full test suite with a single command from the project root:

```bash
npm test
```

This runs every test once and exits; it does not start a watch process. Steps
1, 2 and 5 of the setup above must have been completed first (the tests need
`node_modules` and the generated Prisma client). They do **not** need a `.env`
file — the test configuration supplies its own database location.

The suite contains 9 tests across 2 files:

| File | Covers |
| --- | --- |
| `tests/isOverdue.test.ts` | The overdue rule: past due, future due, no due date, archived, and completed tasks. |
| `tests/taskService.test.ts` | The service layer against a real SQLite database: creating a task, editing a task, archiving a task, and sorting with the derived overdue flag. |

**Throwaway test database.** The tests never touch `dev.db`. `vitest.config.ts`
sets `DATABASE_URL` to `file:./test.db`, and `tests/globalSetup.ts` deletes any
previous `test.db` and recreates the schema with `prisma migrate deploy` before
the suite runs. Every task row is deleted between tests, and test files run
sequentially, so results do not depend on execution order or on data left behind
by a previous run. The overdue unit tests pass an explicit `now` value rather
than reading the system clock.

---

## Third-Party Code

### Runtime dependencies

| Package | Version | Why this project uses it |
| --- | --- | --- |
| `next` | 16.2.12 | The application framework. Its App Router provides file-based routing for both the single page (`src/app/page.tsx`) and the four API route handlers, and its Server Components allow the task list to be rendered on the server without shipping client-side data-fetching code. |
| `react` | 19.2.4 | The UI library Next.js builds on. Used for the three interactive Client Components (create form, task item, edit form), which hold local state for form input and edit mode. |
| `react-dom` | 19.2.4 | Renders React components into the browser DOM; required as a peer of React for any web application. |
| `@prisma/client` | 7.9.1 | The generated, type-safe query API the service layer calls (`prisma.task.create`, `findMany`, `update`). Types are generated from `schema.prisma`, so a schema change that breaks a query is caught at compile time. |
| `@prisma/adapter-better-sqlite3` | 7.9.1 | Prisma 7's `prisma-client` generator ships without a bundled query engine, so a driver adapter is required. This one connects Prisma Client to the local SQLite file through the `better-sqlite3` driver, which is the correct choice for a file-based database running under Node.js. |
| `zod` | 4.4.3 | Validates request bodies and query parameters at the HTTP boundary before anything reaches the service layer. The service layer's input types are inferred from the same schemas with `z.infer`, so the validation rules and the TypeScript types cannot drift apart. |

`better-sqlite3` (^12.6.0) is installed transitively as a dependency of
`@prisma/adapter-better-sqlite3`. It is the actual SQLite driver, and is not
listed directly in `package.json` because the adapter owns that dependency.

### Development dependencies

| Package | Version | Why this project uses it |
| --- | --- | --- |
| `prisma` | 7.9.1 | The Prisma CLI. Generates and applies migrations (`prisma migrate`), generates the client (`prisma generate`), and provides a database browser (`prisma studio`). Development-only, since the running application never invokes the CLI. |
| `typescript` | ^5 | Type checking across every layer. Its value here is concrete: Prisma-generated types and Zod-inferred types meet in the service layer, so a mismatch between the database schema and the validation rules becomes a compile error. |
| `vitest` | 4.1.10 | The test runner. Chosen over Jest because it runs ESM and TypeScript natively, which matches Prisma 7's ESM-first generated client — Jest would have needed additional transform configuration to load the same modules. |
| `dotenv` | 17.4.2 | Prisma 7's CLI no longer loads `.env` automatically, so `prisma.config.ts` imports `dotenv/config` to read `DATABASE_URL` when running migrations. |
| `@types/better-sqlite3` | ^7.6.13 | Type definitions for `better-sqlite3`, which ships no types of its own. |
| `@types/node` | ^20 | Type definitions for Node.js built-ins used in configuration and test setup (`node:fs`, `node:path`, `node:child_process`). |
| `@types/react`, `@types/react-dom` | ^19 | Type definitions for React and React DOM. |
| `eslint` | ^9 | Static analysis to catch likely mistakes before they reach the browser. |
| `eslint-config-next` | 16.2.12 | Next.js's own ESLint rules, including App Router specific checks such as correct Server/Client Component usage. |

---

## Database Design

The database is a single SQLite file (`dev.db` by default, set by
`DATABASE_URL`). The schema is defined in `prisma/schema.prisma` and applied
through the migrations in `prisma/migrations`.

### Tables

The database contains **one table, `Task`**.

| Column | SQLite type | Prisma type | Nullable | Default | Description |
| --- | --- | --- | --- | --- | --- |
| `id` | `INTEGER` | `Int` | No | auto-increment | Primary key, assigned by the database. |
| `title` | `TEXT` | `String` | No | — | The task's title. |
| `description` | `TEXT` | `String` | No | — | The task's description. |
| `topic` | `TEXT` | `String` | No | — | Free-text category. Stored as text rather than a lookup table so the single user can name topics freely; the list can be sorted by this column. |
| `status` | `TEXT` | `Status` (enum) | No | `'TODO'` | One of the three fixed statuses. SQLite has no native enum type, so Prisma stores the enum as text. |
| `dueDate` | `DATETIME` | `DateTime?` | Yes | `NULL` | Optional deadline. Null means the task has no due date and can never be overdue. |
| `archived` | `BOOLEAN` | `Boolean` | No | `false` | Whether the task has been archived. |
| `createdAt` | `DATETIME` | `DateTime` | No | `CURRENT_TIMESTAMP` | When the row was created. |
| `updatedAt` | `DATETIME` | `DateTime` | No | — | Set by Prisma on every write via `@updatedAt`. |

### Enum

`Status` has exactly three values: `TODO`, `IN_PROGRESS`, `DONE`. These are
fixed in the schema and are not user-editable. Note that SQLite does not enforce
enum membership at the database level — the constraint is enforced by Prisma and
by the Zod validation schemas.

### Relationships

**There are no relationships.** The schema contains a single table with no
foreign keys, no join tables, and therefore no one-to-one, one-to-many or
many-to-many associations.

This is a deliberate consequence of the brief rather than an omission. The
application serves one local user, so there is no `User` table to relate tasks
to. `topic` is a free-text field on the task rather than a separate `Topic`
table, because the brief requires only that the list be sortable by topic — not
that topics be managed as entities in their own right.

### Design decisions

- **Archiving is a flag, not a deletion.** `archived` is a boolean column on the
  task. Archiving sets it to `true`; the row is never removed and never copied
  to another table, so an archived task remains fully retrievable.
- **Overdue is derived, never stored.** There is no `overdue` column and no
  overdue status. It is computed at read time in `src/utilities/isOverdue.ts`
  from `dueDate`, `archived` and `status`. Storing it would require rewriting
  rows as time passes, since whether a task is overdue changes without anyone
  editing it.
- **`status` is an enum, `topic` is free text.** Status is a small fixed set
  fixed by the brief, so it is constrained. Topic is user-supplied and open-
  ended, so it is not.

### Migrations

| Migration | What it does |
| --- | --- |
| `20260730193211_init` | Creates the `Task` table with `id`, `title`, `topic`, `status`, `dueDate`, `archived`, `createdAt`, `updatedAt`. |
| `20260803104202_add_description_to_task` | Adds the required `description` column. SQLite cannot add a `NOT NULL` column without a default in place, so Prisma rebuilds the table and copies the existing rows across. |

---

## Architecture

The application is layered, with each layer having a single responsibility:

```
Client Components  ──HTTP──▶  API route handlers ──▶ validation ──▶ services ──▶ Prisma ──▶ SQLite
(create/edit/archive)         (src/app/api)          (Zod)          (business    (client)
                                                                     logic)
Server Component ────────────────────────────────────────────────▶  services ──▶ Prisma ──▶ SQLite
(src/app/page.tsx)
```

| Layer | Location | Responsibility |
| --- | --- | --- |
| Validation | `src/validation/taskSchema.ts` | Zod schemas for request bodies, the `id` route parameter, and the `archived` / `sortBy` query parameters. Types for the service layer are inferred from these schemas. |
| Services | `src/services/taskService.ts` | The business logic: `createTask`, `getAllTasks`, `updateTask`, `archiveTask`. Framework-agnostic — no HTTP types. Prisma errors are deliberately not caught here. |
| Route handlers | `src/app/api/**` | HTTP translation only: parse the request, run validation, call a service, map the result to a status code. This is where Prisma's `P2025` ("record not found") is translated into a `404`. |
| Database access | `src/lib/prisma.ts` | A single shared `PrismaClient`, cached on `globalThis` in development so Next.js Fast Refresh does not open a new connection on every file save. |
| UI | `src/app/page.tsx`, `src/components/**` | A Server Component page plus three Client Components for the interactive parts. |

**One deliberate asymmetry worth noting.** The task list page
(`src/app/page.tsx`) is a Server Component and calls `getAllTasks()` **directly**
— it does not fetch `GET /api/tasks`. Both run on the server, so an internal
HTTP request would add a network round trip and require an absolute URL for no
benefit; this follows Next.js's own guidance on using Route Handlers with Server
Components. The mutations are different: `CreateTaskForm`, `EditTaskForm` and
`TaskItem` run in the browser, so they genuinely cross a client/server boundary
and call the API over HTTP.

`GET /api/tasks` therefore still exists as part of the documented and manually
tested API surface, but it is not on the live request path of this frontend.

### API surface

| Method and path | Purpose |
| --- | --- |
| `POST /api/tasks` | Create a task. Returns `201` with the created task, or `400` on validation failure. |
| `GET /api/tasks?archived=&sortBy=` | List tasks. `archived=true` returns archived tasks (default is active only); `sortBy` accepts `topic`, `status` or `dueDate`. |
| `PATCH /api/tasks/[id]` | Edit a task. Partial update — omitted fields are left unchanged. Returns `404` if no task has that id. |
| `PATCH /api/tasks/[id]/archive` | Archive a task. Takes no request body. Returns `404` if no task has that id. |

Filtering and sorting in the UI are driven by URL search parameters
(`/?archived=true&sortBy=topic`), so a filtered or sorted view can be
bookmarked, shared and reloaded.

### Project structure

```
prisma/
  schema.prisma          Data model and SQLite datasource
  migrations/            Committed SQL migrations
src/
  app/
    page.tsx             Task list (Server Component)
    layout.tsx           Root layout
    api/tasks/           Route handlers
  components/            CreateTaskForm, TaskItem, EditTaskForm (Client Components)
  services/taskService.ts
  validation/taskSchema.ts
  utilities/isOverdue.ts Derived overdue rule
  types/task.ts          Task extended with the computed isOverdue flag
  lib/prisma.ts          Shared Prisma client
tests/
  globalSetup.ts         Creates the throwaway test database
  isOverdue.test.ts
  taskService.test.ts
vitest.config.ts
prisma.config.ts
```
