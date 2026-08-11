import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // The application imports everything via the "@/..." alias defined in
    // tsconfig.json. Vitest does not read tsconfig paths on its own, so the
    // same alias is declared here to keep test imports identical to app imports.
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],

    // Points every test at a throwaway SQLite file instead of dev.db.
    // src/lib/prisma.ts reads process.env.DATABASE_URL when it is first
    // imported, so this value must be set before any test file loads.
    env: {
      DATABASE_URL: "file:./test.db",
    },

    // Creates the throwaway database and applies the committed migrations
    // once, before any test runs.
    globalSetup: ["./tests/globalSetup.ts"],

    // All database-backed tests share one SQLite file and truncate it between
    // tests. Running test files in parallel would let one file's cleanup
    // delete another file's data mid-test, which would make results depend on
    // timing. Sequential execution keeps the suite deterministic.
    fileParallelism: false,
  },
});
