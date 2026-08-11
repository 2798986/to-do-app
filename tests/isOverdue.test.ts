import { describe, it, expect } from "vitest";
import { isOverdue } from "@/utilities/isOverdue";

/**
 * These tests exercise the overdue rule itself.
 *
 * "Overdue" is a derived property, not a stored column and not a status, so the
 * rule lives in a pure function. Passing an explicit `now` means these tests do
 * not depend on the real system clock: the same inputs always produce the same
 * result, whenever the suite is run.
 */
const NOW = new Date("2026-06-15T12:00:00.000Z");
const YESTERDAY = new Date("2026-06-14T12:00:00.000Z");
const TOMORROW = new Date("2026-06-16T12:00:00.000Z");

describe("isOverdue", () => {
  it("flags an active task whose due date has already passed", () => {
    const overdue = isOverdue(
      { dueDate: YESTERDAY, archived: false, status: "TODO" },
      NOW
    );

    expect(overdue).toBe(true);
  });

  it("does not flag a task that is still due in the future", () => {
    const overdue = isOverdue(
      { dueDate: TOMORROW, archived: false, status: "TODO" },
      NOW
    );

    expect(overdue).toBe(false);
  });

  it("does not flag a task that has no due date", () => {
    const overdue = isOverdue(
      { dueDate: null, archived: false, status: "TODO" },
      NOW
    );

    expect(overdue).toBe(false);
  });

  it("does not flag an archived task, even when its due date has passed", () => {
    const overdue = isOverdue(
      { dueDate: YESTERDAY, archived: true, status: "TODO" },
      NOW
    );

    expect(overdue).toBe(false);
  });

  it("does not flag a completed task, even when its due date has passed", () => {
    const overdue = isOverdue(
      { dueDate: YESTERDAY, archived: false, status: "DONE" },
      NOW
    );

    expect(overdue).toBe(false);
  });
});
