import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * Throwaway test database.
 *
 * This is deliberately NOT the development database (dev.db). Tests must never
 * read or write real development data, and must always start from a known
 * empty schema so that results do not depend on whatever happens to be in
 * dev.db at the time.
 */
const TEST_DATABASE_URL = "file:./test.db";

/** SQLite may create sidecar files alongside the main database file. */
const DATABASE_FILES = [
  "test.db",
  "test.db-journal",
  "test.db-wal",
  "test.db-shm",
];

export function setup() {
  const projectRoot = process.cwd();

  // 1. Delete any database left over from a previous run.
  //    Cleaning up at the START of the run (rather than at the end) guarantees
  //    a known clean state even if a previous run crashed part-way through.
  for (const file of DATABASE_FILES) {
    const fullPath = path.join(projectRoot, file);
    if (existsSync(fullPath)) {
      rmSync(fullPath);
    }
  }

  // 2. Recreate the schema by applying the committed migrations.
  //    "migrate deploy" applies existing migrations without prompting and
  //    without generating new ones, so the test schema is exactly the schema
  //    described by prisma/migrations.
  //
  //    DATABASE_URL is passed explicitly to the child process. dotenv (loaded
  //    by prisma.config.ts) does not overwrite variables that are already set,
  //    so this value wins over the one in .env.
  execSync("npx prisma migrate deploy", {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
}
