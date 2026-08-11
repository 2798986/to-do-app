import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createTask,
  getAllTasks,
  updateTask,
  archiveTask,
} from "@/services/taskService";

/**
 * These tests exercise the service layer against a real SQLite database
 * (the throwaway test.db created in tests/globalSetup.ts).
 *
 * The service layer is tested rather than the route handlers because that is
 * where the application's behaviour lives: route handlers only translate HTTP
 * requests into service calls and service results into HTTP responses.
 *
 * Every task is removed before each test so that no test depends on data left
 * behind by another test, and the suite produces the same result regardless of
 * the order in which tests run.
 */
beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("createTask", () => {
  it("persists a new task that can be read back from the database", async () => {
    const created = await createTask({
      title: "Write lab report",
      description: "Draft the Lab 1 write-up",
      topic: "COMS3011A",
    });

    // The id is assigned by the database, not by the caller.
    expect(created.id).toBeGreaterThan(0);

    // Read back through a separate query to prove the row was actually stored,
    // rather than only inspecting the value createTask returned.
    const tasks = await getAllTasks(false);

    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(created.id);
    expect(tasks[0].title).toBe("Write lab report");
    expect(tasks[0].description).toBe("Draft the Lab 1 write-up");
    expect(tasks[0].topic).toBe("COMS3011A");

    // Neither status nor archived was supplied, so these values come from the
    // schema defaults applied by the database.
    expect(tasks[0].status).toBe("TODO");
    expect(tasks[0].archived).toBe(false);
  });
});

describe("updateTask", () => {
  it("persists the changed field and leaves the other fields untouched", async () => {
    const created = await createTask({
      title: "Original title",
      description: "Original description",
      topic: "Original topic",
    });

    const updated = await updateTask(created.id, { title: "Renamed title" });

    expect(updated.title).toBe("Renamed title");

    // A partial update must not blank out fields that were not supplied.
    expect(updated.description).toBe("Original description");
    expect(updated.topic).toBe("Original topic");

    // Re-read from the database to prove the change was written, not just
    // returned by the update call.
    const [reloaded] = await getAllTasks(false);

    expect(reloaded.title).toBe("Renamed title");
    expect(reloaded.description).toBe("Original description");
    expect(reloaded.topic).toBe("Original topic");
  });
});

describe("archiveTask", () => {
  it("moves a task out of the active list and into the archived list", async () => {
    const created = await createTask({
      title: "Task to archive",
      description: "This task will be archived",
      topic: "COMS3011A",
    });

    // Precondition: the task starts out in the active list.
    const activeBefore = await getAllTasks(false);
    expect(activeBefore).toHaveLength(1);

    const archived = await archiveTask(created.id);
    expect(archived.archived).toBe(true);

    // The task must disappear from the active view...
    const activeAfter = await getAllTasks(false);
    expect(activeAfter).toHaveLength(0);

    // ...but must still exist, and be retrievable from the archived view.
    // This is what distinguishes archiving from deleting.
    const archivedTasks = await getAllTasks(true);
    expect(archivedTasks).toHaveLength(1);
    expect(archivedTasks[0].id).toBe(created.id);
    expect(archivedTasks[0].title).toBe("Task to archive");
  });
});

describe("getAllTasks", () => {
  it("sorts by due date and derives the overdue flag for each task", async () => {
    // 2020 is unambiguously in the past and 2999 unambiguously in the future,
    // so the expected result does not change depending on when the suite runs.
    await createTask({
      title: "Overdue task",
      description: "Due date has passed",
      topic: "COMS3011A",
      dueDate: new Date("2020-01-01T00:00:00.000Z"),
    });

    await createTask({
      title: "Future task",
      description: "Due date has not passed",
      topic: "COMS3011A",
      dueDate: new Date("2999-01-01T00:00:00.000Z"),
    });

    // Sorting explicitly by due date makes the order of the result defined,
    // rather than relying on whatever order the database returns rows in.
    const tasks = await getAllTasks(false, "dueDate");

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe("Overdue task");
    expect(tasks[1].title).toBe("Future task");

    // isOverdue is computed by the service layer; it is not stored in the
    // database and it is not one of the task statuses.
    expect(tasks[0].isOverdue).toBe(true);
    expect(tasks[1].isOverdue).toBe(false);
  });
});
