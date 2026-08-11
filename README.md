This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Running the tests

The full test suite runs with a single command from the project root:

```bash
npm test
```

This runs every test once and exits (it does not start a watch process).

### What the tests cover

- `tests/isOverdue.test.ts` — the overdue rule, which is derived from the due
  date rather than stored in the database or treated as a status.
- `tests/taskService.test.ts` — the service layer, run against a real SQLite
  database: creating a task, editing a task, archiving a task, and sorting.

### Test database

The tests never touch `dev.db`. Before the suite runs, `tests/globalSetup.ts`
deletes any previous `test.db`, then recreates the schema by applying the
committed migrations with `prisma migrate deploy`. `vitest.config.ts` sets
`DATABASE_URL` to `file:./test.db` so that the Prisma client used by the tests
connects to that throwaway file. Every task is deleted between tests, so no test
depends on data created by another one.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
